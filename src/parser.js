/**
 * PineScript Parser - Generates AST from tokens
 */

import { TokenType } from './lexer.js';

class ASTNode {
  constructor(type, properties = {}) {
    this.type = type;
    Object.assign(this, properties);
  }
}

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
    this.currentToken = this.tokens[0];
  }

  parseTypeAnnotation() {
    if (!this.match(TokenType.IDENTIFIER)) return null;
    let typeName = this.currentToken.value;
    this.advance();

    if (this.match(TokenType.LESS)) {
      this.skipGenericAnnotation();
    }

    // Support postfix array types like `polyline[]`
    while (this.match(TokenType.LBRACKET) && this.peek(1)?.type === TokenType.RBRACKET) {
      this.advance();
      this.advance();
      typeName += '[]';
    }

    return typeName;
  }

  isGenericAnnotationStart() {
    if (!this.match(TokenType.LESS)) return false;
    let depth = 0;
    for (let i = 0; this.peek(i); i++) {
      const t = this.peek(i);
      if (t.type === TokenType.LESS) depth++;
      else if (t.type === TokenType.GREATER) {
        depth--;
        if (depth === 0) {
          const next = this.peek(i + 1);
          return !!next && (next.type === TokenType.LPAREN || next.type === TokenType.DOT);
        }
      }
    }
    return false;
  }

  advance() {
    this.pos++;
    this.currentToken = this.tokens[this.pos];
  }

  expect(type, message) {
    if (this.currentToken.type === type) {
      const token = this.currentToken;
      this.advance();
      return token;
    }
    throw new Error(`${message} at line ${this.currentToken.line}`);
  }

  peek(offset = 0) {
    return this.tokens[this.pos + offset];
  }

  match(type) {
    return this.currentToken.type === type;
  }

  matchAny(types) {
    return types.includes(this.currentToken.type);
  }

  consume(type) {
    if (this.match(type)) {
      const tok = this.currentToken;
      this.advance();
      return tok;
    }
    return null;
  }

  skipNewlines() {
    while (this.match(TokenType.NEWLINE)) {
      this.advance();
    }
  }

  skipGenericAnnotation() {
    if (!this.match(TokenType.LESS)) return;
    let depth = 0;
    while (!this.match(TokenType.EOF)) {
      if (this.match(TokenType.LESS)) {
        depth++;
        this.advance();
        continue;
      }
      if (this.match(TokenType.GREATER)) {
        depth--;
        this.advance();
        if (depth <= 0) break;
        continue;
      }
      this.advance();
    }
  }

  parse() {
    const statements = [];
    while (!this.match(TokenType.EOF)) {
      this.skipNewlines();
      if (this.match(TokenType.EOF)) break;
      if (this.match(TokenType.DEDENT)) {
        this.advance();
        continue;
      }
      statements.push(this.parseStatement());
    }
    return new ASTNode('Program', { body: statements });
  }

  parseStatement() {
    this.skipNewlines();

    if (this.match(TokenType.IMPORT)) return this.parseImportStatement();
    if (this.match(TokenType.TYPE)) return this.parseTypeDeclaration();

    if (this.match(TokenType.LBRACKET) && this.isDestructuringAssignmentStart()) return this.parseDestructuringAssignment();

    if (this.match(TokenType.INPUT)) return this.parseInputDeclaration();
    if (this.match(TokenType.VAR) || this.match(TokenType.VARIP)) return this.parseVariableDeclaration();
    if (this.match(TokenType.IF)) return this.parseIfStatement();
    if (this.match(TokenType.FOR)) return this.parseForStatementPine();
    if (this.match(TokenType.WHILE)) return this.parseWhileStatementPine();
    if (this.match(TokenType.SWITCH)) return this.parseSwitchStatementPine();
    if (this.match(TokenType.BREAK)) {
      this.advance();
      return new ASTNode('BreakStatement');
    }
    if (this.match(TokenType.CONTINUE)) {
      this.advance();
      return new ASTNode('ContinueStatement');
    }
    if (this.match(TokenType.RETURN)) return this.parseReturnStatement();
    if (this.match(TokenType.STUDY) || this.match(TokenType.STRATEGY)) return this.parseStudyDeclaration();

    if (this.match(TokenType.IDENTIFIER)) {
      if (this.isFunctionDeclarationStart()) return this.parseFunctionDeclaration();
      if (this.isTypedDeclarationStart()) return this.parseTypedDeclarationStatement();
      return this.parseAssignmentOrExpression();
    }

    if (this.match(TokenType.LBRACE)) return this.parseBlock();

    return this.parseExpressionStatement();
  }

  parseDestructuringAssignment() {
    this.expect(TokenType.LBRACKET, 'Expected [');
    const targets = [];
    if (!this.match(TokenType.RBRACKET)) {
      while (true) {
        targets.push(this.expect(TokenType.IDENTIFIER, 'Expected identifier').value);
        if (this.match(TokenType.COMMA)) {
          this.advance();
          continue;
        }
        break;
      }
    }
    this.expect(TokenType.RBRACKET, 'Expected ]');
    if (this.match(TokenType.EQUAL) || this.match(TokenType.COLON_EQUAL)) {
      this.advance();
    } else {
      this.expect(TokenType.EQUAL, 'Expected =');
    }
    const value = this.parseExpression();
    return new ASTNode('DestructuringAssignment', { targets, value });
  }

  parseImportStatement() {
    this.advance();

    let path = '';
    while (!this.match(TokenType.AS) && !this.match(TokenType.NEWLINE) && !this.match(TokenType.EOF)) {
      path += this.currentToken.value;
      this.advance();
    }

    path = path.trim();
    let alias = null;
    if (this.match(TokenType.AS)) {
      this.advance();
      alias = this.expect(TokenType.IDENTIFIER, 'Expected import alias').value;
    }
    this.skipNewlines();
    return new ASTNode('ImportDeclaration', { path, alias });
  }

  parseTypeDeclaration() {
    this.advance();
    const name = this.expect(TokenType.IDENTIFIER, 'Expected type name').value;
    this.skipNewlines();
    this.expect(TokenType.INDENT, 'Expected indented type body');

    const fields = [];
    while (!this.match(TokenType.DEDENT) && !this.match(TokenType.EOF)) {
      this.skipNewlines();
      if (this.match(TokenType.DEDENT) || this.match(TokenType.EOF)) break;

      const fieldType = this.expect(TokenType.IDENTIFIER, 'Expected field type').value;
      if (this.match(TokenType.LESS)) this.skipGenericAnnotation();
      const fieldName = this.expect(TokenType.IDENTIFIER, 'Expected field name').value;
      fields.push({ fieldType, fieldName });
      this.skipNewlines();
    }
    this.consume(TokenType.DEDENT);
    return new ASTNode('TypeDeclaration', { name, fields });
  }

  isTypedDeclarationStart() {
    if (!this.match(TokenType.IDENTIFIER)) return false;
    const t1 = this.peek(1);
    if (!t1) return false;
    // typed decl can be `float x = ...` or `array<float> x = ...`
    if (t1.type !== TokenType.IDENTIFIER && t1.type !== TokenType.LESS) return false;
    return true;
  }

  isDestructuringAssignmentStart() {
    if (!this.match(TokenType.LBRACKET)) return false;
    // Look ahead: [ ... ] must be followed by '=' to be assignment.
    let depth = 0;
    for (let i = 0; this.peek(i); i++) {
      const t = this.peek(i);
      if (t.type === TokenType.LBRACKET) depth++;
      else if (t.type === TokenType.RBRACKET) {
        depth--;
        if (depth === 0) {
          const next = this.peek(i + 1);
          return !!next && (next.type === TokenType.EQUAL || next.type === TokenType.COLON_EQUAL);
        }
      }
    }
    return false;
  }

  parseTypedDeclarationStatement() {
    const declaredType = this.parseTypeAnnotation();
    if (!declaredType) {
      throw new Error(`Expected type at line ${this.currentToken.line}`);
    }

    const name = this.expect(TokenType.IDENTIFIER, 'Expected name').value;
    this.expect(TokenType.EQUAL, 'Expected =');
    const value = this.parseExpression();

    const decl = new ASTNode('VariableDeclaration', { name, isVarip: false, declaredType, value });
    if (this.match(TokenType.COMMA)) {
      const declarations = [decl];
      while (this.match(TokenType.COMMA)) {
        this.advance();
        const t = this.expect(TokenType.IDENTIFIER, 'Expected type').value;
        if (this.match(TokenType.LESS)) this.skipGenericAnnotation();
        const n = this.expect(TokenType.IDENTIFIER, 'Expected name').value;
        this.expect(TokenType.EQUAL, 'Expected =');
        const v = this.parseExpression();
        declarations.push(new ASTNode('VariableDeclaration', { name: n, isVarip: false, declaredType: t, value: v }));
      }
      return new ASTNode('MultiDeclaration', { declarations });
    }
    return decl;
  }

  isFunctionDeclarationStart() {
    if (!this.match(TokenType.IDENTIFIER)) return false;
    if (this.peek(1)?.type !== TokenType.LPAREN) return false;

    let depth = 0;
    for (let i = 1; this.peek(i); i++) {
      const t = this.peek(i);
      if (t.type === TokenType.LPAREN) depth++;
      else if (t.type === TokenType.RPAREN) {
        depth--;
        if (depth === 0) {
          return this.peek(i + 1)?.type === TokenType.ARROW;
        }
      }
    }
    return false;
  }

  parseIndentedBlock() {
    this.skipNewlines();
    if (this.match(TokenType.INDENT)) {
      this.advance();
      const statements = [];
      while (!this.match(TokenType.DEDENT) && !this.match(TokenType.EOF)) {
        this.skipNewlines();
        if (this.match(TokenType.DEDENT) || this.match(TokenType.EOF)) break;
        statements.push(this.parseStatement());
      }
      this.consume(TokenType.DEDENT);
      return new ASTNode('Block', { statements });
    }

    return this.parseStatement();
  }

  isAssignmentStatementStart() {
    if (!this.match(TokenType.IDENTIFIER)) return false;

    let i = 1;
    while (true) {
      const t = this.peek(i);
      if (!t) return false;

      if (t.type === TokenType.DOT) {
        i += 2;
        continue;
      }

      if (t.type === TokenType.LBRACKET) {
        let depth = 1;
        i++;
        while (this.peek(i) && depth > 0) {
          if (this.peek(i).type === TokenType.LBRACKET) depth++;
          else if (this.peek(i).type === TokenType.RBRACKET) depth--;
          i++;
        }
        continue;
      }

      if (t.type === TokenType.LPAREN) {
        let depth = 1;
        i++;
        while (this.peek(i) && depth > 0) {
          if (this.peek(i).type === TokenType.LPAREN) depth++;
          else if (this.peek(i).type === TokenType.RPAREN) depth--;
          i++;
        }
        continue;
      }

      break;
    }

    const op = this.peek(i);
    return !!op && [TokenType.EQUAL, TokenType.COLON_EQUAL, TokenType.PLUS_EQUAL, TokenType.MINUS_EQUAL, TokenType.MULTIPLY_EQUAL, TokenType.DIVIDE_EQUAL].includes(op.type);
  }

  parseInputDeclaration() {
    this.advance();
    const inputName = this.expect(TokenType.IDENTIFIER, 'Expected input name').value;
    this.expect(TokenType.EQUAL, 'Expected =');
    const inputType = this.currentToken.value.toLowerCase();

    let defaultValue;
    if (this.match(TokenType.NUMBER)) {
      defaultValue = parseFloat(this.currentToken.value);
      this.advance();
    } else if (this.match(TokenType.STRING)) {
      defaultValue = this.currentToken.value;
      this.advance();
    } else if (this.match(TokenType.TRUE) || this.match(TokenType.FALSE)) {
      defaultValue = this.currentToken.value.toLowerCase() === 'true';
      this.advance();
    } else {
      defaultValue = null;
    }

    return new ASTNode('InputDeclaration', {
      name: inputName,
      inputType: inputType,
      defaultValue: defaultValue
    });
  }

  parseVariableDeclaration() {
    const isVarip = this.match(TokenType.VARIP);
    const isVar = this.match(TokenType.VAR);
    this.advance();

    let declaredType = null;
    if (this.match(TokenType.IDENTIFIER) && (this.peek(1)?.type === TokenType.IDENTIFIER || this.peek(1)?.type === TokenType.LESS || this.peek(1)?.type === TokenType.LBRACKET)) {
      // Parse type annotation and only keep it as declaredType if what follows is a variable name.
      const startPos = this.pos;
      const maybeType = this.parseTypeAnnotation();
      if (maybeType && this.match(TokenType.IDENTIFIER)) {
        declaredType = maybeType;
      } else {
        // rollback if it wasn't actually a type
        this.pos = startPos;
        this.currentToken = this.tokens[this.pos];
      }
    }

    const parseOneDecl = (baseIsVar, baseIsVarip) => {
      let localIsVar = baseIsVar;
      let localIsVarip = baseIsVarip;
      let localDeclaredType = declaredType;

      // Allow repeating `var`/`varip` in the same statement: `var float a=na, var float b=na`
      if (this.match(TokenType.VAR) || this.match(TokenType.VARIP)) {
        localIsVarip = this.match(TokenType.VARIP);
        localIsVar = this.match(TokenType.VAR);
        this.advance();
        localDeclaredType = null;
        if (this.match(TokenType.IDENTIFIER) && (this.peek(1)?.type === TokenType.IDENTIFIER || this.peek(1)?.type === TokenType.LESS || this.peek(1)?.type === TokenType.LBRACKET)) {
          const startPos = this.pos;
          const maybeType = this.parseTypeAnnotation();
          if (maybeType && this.match(TokenType.IDENTIFIER)) {
            localDeclaredType = maybeType;
          } else {
            this.pos = startPos;
            this.currentToken = this.tokens[this.pos];
          }
        }
      }

      const name = this.expect(TokenType.IDENTIFIER, 'Expected variable name').value;
      this.expect(TokenType.EQUAL, 'Expected =');
      const value = this.parseExpression();
      return new ASTNode('VariableDeclaration', { name, isVarip: localIsVarip, isVar: localIsVar, declaredType: localDeclaredType, value });
    };

    const firstDecl = parseOneDecl(isVar, isVarip);

    if (!this.match(TokenType.COMMA)) {
      return firstDecl;
    }

    const declarations = [firstDecl];
    while (this.match(TokenType.COMMA)) {
      this.advance();
      declarations.push(parseOneDecl(isVar, isVarip));
    }

    return new ASTNode('MultiDeclaration', { declarations });
  }

  parseIfStatement() {
    this.advance();
    const condition = this.parseExpression();

    const thenBranch = this.parseIndentedBlock();

    let elseBranch = null;
    this.skipNewlines();
    if (this.match(TokenType.ELSE)) {
      this.advance();
      elseBranch = this.parseIndentedBlock();
    }

    return new ASTNode('IfStatement', { condition, thenBranch, elseBranch });
  }

  parseForStatementPine() {
    this.advance();

    // Pine v5+ also supports `for x in collection`
    if (this.match(TokenType.IDENTIFIER) && this.peek(1)?.type === TokenType.IN) {
      const variable = this.expect(TokenType.IDENTIFIER, 'Expected loop variable').value;
      // consume `in`
      this.advance();
      const iterable = this.parseExpression();
      const body = this.parseIndentedBlock();
      return new ASTNode('ForInStatement', { variable, iterable, body });
    }

    const variable = this.expect(TokenType.IDENTIFIER, 'Expected loop variable').value;
    this.expect(TokenType.EQUAL, 'Expected =');
    const start = this.parseExpression();
    this.expect(TokenType.TO, 'Expected to');
    const end = this.parseExpression();
    const body = this.parseIndentedBlock();
    return new ASTNode('ForStatement', { variable, start, end, body });
  }

  parseWhileStatementPine() {
    this.advance();
    const condition = this.parseExpression();
    const body = this.parseIndentedBlock();
    return new ASTNode('WhileStatement', { condition, body });
  }

  parseSwitchStatementPine() {
    this.advance();
    const expression = this.parseExpression();

    this.skipNewlines();
    this.expect(TokenType.INDENT, 'Expected indented switch body');

    const cases = [];
    while (!this.match(TokenType.DEDENT) && !this.match(TokenType.EOF)) {
      this.skipNewlines();
      if (this.match(TokenType.DEDENT) || this.match(TokenType.EOF)) break;

      let caseValue = null;
      if (this.match(TokenType.ARROW)) {
        this.advance();
      } else {
        caseValue = this.parseExpression();
        this.expect(TokenType.ARROW, 'Expected =>');
      }

      const resultExpr = this.parseExpression();
      cases.push({ value: caseValue, body: [new ASTNode('ReturnStatement', { value: resultExpr })] });
      this.skipNewlines();
    }

    this.consume(TokenType.DEDENT);
    return new ASTNode('SwitchStatement', { expression, cases });
  }

  parseFunctionDeclaration() {
    const name = this.expect(TokenType.IDENTIFIER, 'Expected function name').value;
    this.expect(TokenType.LPAREN, 'Expected (');
    const params = [];
    if (!this.match(TokenType.RPAREN)) {
      while (true) {
        // Pine allows typed params: type name
        if (this.match(TokenType.IDENTIFIER) && (this.peek(1)?.type === TokenType.IDENTIFIER || this.peek(1)?.type === TokenType.LESS)) {
          // type
          this.advance();
          if (this.match(TokenType.LESS)) this.skipGenericAnnotation();
        }
        const paramName = this.expect(TokenType.IDENTIFIER, 'Expected parameter name').value;
        let defaultValue = null;
        if (this.match(TokenType.EQUAL)) {
          this.advance();
          defaultValue = this.parseExpression();
        }
        params.push({ name: paramName, defaultValue });
        if (this.match(TokenType.COMMA)) {
          this.advance();
          continue;
        }
        break;
      }
    }
    this.expect(TokenType.RPAREN, 'Expected )');
    this.expect(TokenType.ARROW, 'Expected =>');
    const body = this.parseIndentedBlock();
    return new ASTNode('FunctionDeclaration', { name, params, body });
  }

  parseReturnStatement() {
    this.advance();
    const value = this.parseExpression();
    return new ASTNode('ReturnStatement', { value });
  }

  parseStudyDeclaration() {
    const isStrategy = this.match(TokenType.STRATEGY);
    this.advance();
    const title = this.currentToken.value;
    this.advance();

    const options = {};
    if (this.match(TokenType.COMMA)) {
      this.advance();
      this.parseStudyOptions(options);
    }

    return new ASTNode('StudyDeclaration', {
      isStrategy,
      title,
      options
    });
  }

  parseStudyOptions(options) {
    while (!this.match(TokenType.LBRACE) && !this.match(TokenType.NEWLINE) && !this.match(TokenType.EOF)) {
      const key = this.currentToken.value;
      this.advance();
      this.expect(TokenType.EQUAL, 'Expected =');
      let value;
      if (this.match(TokenType.NUMBER)) {
        value = parseFloat(this.currentToken.value);
        this.advance();
      } else if (this.match(TokenType.STRING)) {
        value = this.currentToken.value;
        this.advance();
      } else if (this.match(TokenType.TRUE) || this.match(TokenType.FALSE)) {
        value = this.currentToken.value.toLowerCase() === 'true';
        this.advance();
      }
      options[key] = value;
      if (this.match(TokenType.COMMA)) {
        this.advance();
      }
    }
  }

  parseAssignmentOrExpression() {
    if (this.isAssignmentStatementStart()) {
      let target = new ASTNode('Identifier', { name: this.expect(TokenType.IDENTIFIER, 'Expected identifier').value });

      while (this.match(TokenType.DOT) || this.match(TokenType.LPAREN) || this.match(TokenType.LBRACKET)) {
        if (this.match(TokenType.LPAREN)) {
          target = this.parseFunctionCall(target);
        } else if (this.match(TokenType.LBRACKET)) {
          target = this.parseArrayAccess(target);
        } else {
          target = this.parsePropertyAccess(target);
        }
      }

      const opTok = this.currentToken;
      if (!this.matchAny([TokenType.EQUAL, TokenType.COLON_EQUAL, TokenType.PLUS_EQUAL, TokenType.MINUS_EQUAL, TokenType.MULTIPLY_EQUAL, TokenType.DIVIDE_EQUAL])) {
        throw new Error(`Expected assignment operator at line ${this.currentToken.line}`);
      }
      this.advance();
      const value = this.parseExpression();
      return new ASTNode('Assignment', { operator: opTok.value, target, value });
    }

    return this.parseExpressionStatement();
  }

  parseExpressionStatement() {
    let expr = this.parseExpression();
    if (this.match(TokenType.COMMA)) {
      const expressions = [expr];
      while (this.match(TokenType.COMMA)) {
        this.advance();
        expressions.push(this.parseExpression());
      }
      expr = new ASTNode('SequenceExpression', { expressions });
    }
    return new ASTNode('ExpressionStatement', { expression: expr });
  }

  parseExpression() {
    return this.parseConditional();
  }

  parseConditional() {
    let expr = this.parseLogicalOr();
    if (this.match(TokenType.QUESTION)) {
      this.advance();
      const trueExpr = this.parseExpression();
      this.expect(TokenType.COLON, 'Expected :');
      const falseExpr = this.parseExpression();
      expr = new ASTNode('TernaryExpression', { condition: expr, trueExpr, falseExpr });
    }
    return expr;
  }

  parseLogicalOr() {
    let left = this.parseLogicalAnd();
    while (this.match(TokenType.OR_OR) || this.match(TokenType.OR)) {
      const operator = this.currentToken.value;
      this.advance();
      const right = this.parseLogicalAnd();
      left = new ASTNode('BinaryExpression', {
        operator: operator.toLowerCase() === 'or' ? '||' : '||',
        left,
        right
      });
    }
    return left;
  }

  parseLogicalAnd() {
    let left = this.parseBitwiseOr();
    while (this.match(TokenType.AND_AND) || this.match(TokenType.AND)) {
      const operator = this.currentToken.value;
      this.advance();
      const right = this.parseBitwiseOr();
      left = new ASTNode('BinaryExpression', {
        operator: operator.toLowerCase() === 'and' ? '&&' : '&&',
        left,
        right
      });
    }
    return left;
  }

  parseBitwiseOr() {
    let left = this.parseBitwiseXor();
    while (this.match(TokenType.BITWISE_OR)) {
      this.advance();
      const right = this.parseBitwiseXor();
      left = new ASTNode('BinaryExpression', {
        operator: '|',
        left,
        right
      });
    }
    return left;
  }

  parseBitwiseXor() {
    let left = this.parseBitwiseAnd();
    while (this.match(TokenType.BITWISE_XOR)) {
      this.advance();
      const right = this.parseBitwiseAnd();
      left = new ASTNode('BinaryExpression', {
        operator: '^',
        left,
        right
      });
    }
    return left;
  }

  parseBitwiseAnd() {
    let left = this.parseEquality();
    while (this.match(TokenType.BITWISE_AND)) {
      this.advance();
      const right = this.parseEquality();
      left = new ASTNode('BinaryExpression', {
        operator: '&',
        left,
        right
      });
    }
    return left;
  }

  parseEquality() {
    let left = this.parseComparison();
    while (this.match(TokenType.EQUAL_EQUAL) || this.match(TokenType.NOT_EQUAL)) {
      const operator = this.currentToken.value;
      this.advance();
      const right = this.parseComparison();
      left = new ASTNode('BinaryExpression', {
        operator,
        left,
        right
      });
    }
    return left;
  }

  parseComparison() {
    let left = this.parseAdditive();
    while (this.match(TokenType.GREATER) || this.match(TokenType.LESS) ||
           this.match(TokenType.GREATER_EQUAL) || this.match(TokenType.LESS_EQUAL)) {
      const operator = this.currentToken.value;
      this.advance();
      const right = this.parseAdditive();
      left = new ASTNode('BinaryExpression', {
        operator,
        left,
        right
      });
    }
    return left;
  }

  parseAdditive() {
    let left = this.parseMultiplicative();
    while (this.match(TokenType.PLUS) || this.match(TokenType.MINUS)) {
      const operator = this.currentToken.value;
      this.advance();
      const right = this.parseMultiplicative();
      left = new ASTNode('BinaryExpression', {
        operator,
        left,
        right
      });
    }
    return left;
  }

  parseMultiplicative() {
    let left = this.parseUnary();
    while (this.match(TokenType.MULTIPLY) || this.match(TokenType.DIVIDE) || this.match(TokenType.MODULO)) {
      const operator = this.currentToken.value;
      this.advance();
      const right = this.parseUnary();
      left = new ASTNode('BinaryExpression', {
        operator,
        left,
        right
      });
    }
    return left;
  }

  parseUnary() {
    if (this.match(TokenType.NOT) || this.match(TokenType.MINUS)) {
      const operator = this.currentToken.value;
      this.advance();
      const operand = this.parseUnary();
      return new ASTNode('UnaryExpression', { operator, operand });
    }
    return this.parsePostfix();
  }

  parsePostfix() {
    let expr = this.parsePrimary();

    while (true) {
      if (this.match(TokenType.LESS) && this.isGenericAnnotationStart()) {
        this.skipGenericAnnotation();
        continue;
      }
      if (this.match(TokenType.LBRACKET)) {
        expr = this.parseArrayAccess(expr);
      } else if (this.match(TokenType.DOT)) {
        expr = this.parsePropertyAccess(expr);
      } else if (this.match(TokenType.LPAREN)) {
        expr = this.parseFunctionCall(expr);
      } else {
        break;
      }
    }

    return expr;
  }

  parseArrayAccess(array) {
    this.expect(TokenType.LBRACKET, 'Expected [');
    const index = this.parseExpression();
    this.expect(TokenType.RBRACKET, 'Expected ]');
    return new ASTNode('ArrayAccess', { array, index });
  }

  parsePropertyAccess(object) {
    this.expect(TokenType.DOT, 'Expected .');
    const property = this.expect(TokenType.IDENTIFIER, 'Expected property name').value;
    return new ASTNode('PropertyAccess', { object, property });
  }

  parseCallArgument() {
    if (this.match(TokenType.IDENTIFIER) && this.peek(1)?.type === TokenType.EQUAL) {
      const name = this.currentToken.value;
      this.advance();
      this.expect(TokenType.EQUAL, 'Expected =');
      const value = this.parseExpression();
      return new ASTNode('NamedArgument', { name, value });
    }
    return this.parseExpression();
  }

  parseFunctionCall(callee) {
    this.expect(TokenType.LPAREN, 'Expected (');
    const args = [];

    if (!this.match(TokenType.RPAREN)) {
      while (true) {
        args.push(this.parseCallArgument());
        if (this.match(TokenType.COMMA)) {
          this.advance();
        } else {
          break;
        }
      }
    }

    this.expect(TokenType.RPAREN, 'Expected )');
    return new ASTNode('FunctionCall', {
      callee,
      arguments: args
    });
  }

  parsePrimary() {
    if (this.match(TokenType.NUMBER)) {
      const value = parseFloat(this.currentToken.value);
      this.advance();
      return new ASTNode('Literal', { value, dataType: 'number' });
    }

    if (this.match(TokenType.COLOR_HEX)) {
      const value = this.currentToken.value;
      this.advance();
      return new ASTNode('Literal', { value, dataType: 'color_hex' });
    }

    if (this.match(TokenType.STRING)) {
      const value = this.currentToken.value;
      this.advance();
      return new ASTNode('Literal', { value, dataType: 'string' });
    }

    if (this.match(TokenType.TRUE)) {
      this.advance();
      return new ASTNode('Literal', { value: true, dataType: 'boolean' });
    }

    if (this.match(TokenType.FALSE)) {
      this.advance();
      return new ASTNode('Literal', { value: false, dataType: 'boolean' });
    }

    if (this.match(TokenType.NA)) {
      this.advance();
      return new ASTNode('Literal', { value: null, dataType: 'na' });
    }

    if (this.match(TokenType.IDENTIFIER)) {
      const name = this.currentToken.value;
      this.advance();
      return new ASTNode('Identifier', { name });
    }

    if (this.match(TokenType.LPAREN)) {
      this.advance();
      const expr = this.parseExpression();
      this.expect(TokenType.RPAREN, 'Expected )');
      return expr;
    }

    if (this.match(TokenType.LBRACKET)) {
      return this.parseArrayLiteral();
    }

    if (this.match(TokenType.LBRACE)) {
      return this.parseObjectLiteral();
    }

    if (this.match(TokenType.SWITCH)) {
      return this.parseSwitchExpression();
    }

    if (this.match(TokenType.IF)) {
      return this.parseTernary();
    }

    throw new Error(`Unexpected token: ${this.currentToken.type} at line ${this.currentToken.line}`);
  }

  parseSwitchExpression() {
    this.expect(TokenType.SWITCH, 'Expected switch');

    let subject = null;
    if (!this.match(TokenType.NEWLINE) && !this.match(TokenType.INDENT) && !this.match(TokenType.EOF)) {
      subject = this.parseExpression();
    }

    this.skipNewlines();
    this.expect(TokenType.INDENT, 'Expected indented switch body');

    const cases = [];
    while (!this.match(TokenType.DEDENT) && !this.match(TokenType.EOF)) {
      this.skipNewlines();
      if (this.match(TokenType.DEDENT) || this.match(TokenType.EOF)) break;

      let matchExpr = null;
      if (this.match(TokenType.ARROW)) {
        this.advance();
      } else {
        matchExpr = this.parseExpression();
        this.expect(TokenType.ARROW, 'Expected =>');
      }

      const valueExpr = this.parseExpression();
      cases.push({ matchExpr, valueExpr });
      this.skipNewlines();
    }

    this.consume(TokenType.DEDENT);
    return new ASTNode('SwitchExpression', { subject, cases });
  }

  parseArrayLiteral() {
    this.advance();
    const elements = [];

    if (!this.match(TokenType.RBRACKET)) {
      while (true) {
        elements.push(this.parseExpression());
        if (this.match(TokenType.COMMA)) {
          this.advance();
        } else {
          break;
        }
      }
    }

    this.expect(TokenType.RBRACKET, 'Expected ]');
    return new ASTNode('ArrayLiteral', { elements });
  }

  parseObjectLiteral() {
    this.advance();
    const properties = [];

    if (!this.match(TokenType.RBRACE)) {
      while (true) {
        const key = this.expect(TokenType.IDENTIFIER, 'Expected property key').value;
        this.expect(TokenType.COLON, 'Expected :');
        const value = this.parseExpression();
        properties.push({ key, value });
        if (this.match(TokenType.COMMA)) {
          this.advance();
        } else {
          break;
        }
      }
    }

    this.expect(TokenType.RBRACE, 'Expected }');
    return new ASTNode('ObjectLiteral', { properties });
  }

  parseTernary() {
    this.advance();
    this.expect(TokenType.LPAREN, 'Expected (');
    const condition = this.parseExpression();
    this.expect(TokenType.RPAREN, 'Expected )');

    const trueExpr = this.parseExpression();
    this.expect(TokenType.COLON, 'Expected :');
    const falseExpr = this.parseExpression();

    return new ASTNode('TernaryExpression', {
      condition,
      trueExpr,
      falseExpr
    });
  }

  parseBlock() {
    this.expect(TokenType.LBRACE, 'Expected {');
    const statements = [];

    while (!this.match(TokenType.RBRACE) && !this.match(TokenType.EOF)) {
      statements.push(this.parseStatement());
    }

    this.expect(TokenType.RBRACE, 'Expected }');
    return new ASTNode('Block', { statements });
  }
}

export { Parser, ASTNode };
