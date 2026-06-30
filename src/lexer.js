/**
 * Breaks PineScript source code into individual tokens that the parser can work with.
 */

const TokenType = {
  // Reserved words in the PineScript language
  STUDY: 'STUDY',
  STRATEGY: 'STRATEGY',
  INDICATOR: 'INDICATOR',
  VERSION: 'VERSION',
  VAR: 'VAR',
  VARIP: 'VARIP',
  IF: 'IF',
  ELSE: 'ELSE',
  FOR: 'FOR',
  BY: 'BY',
  IN: 'IN',
  FROM: 'FROM',
  TO: 'TO',
  WHILE: 'WHILE',
  SWITCH: 'SWITCH',
  CASE: 'CASE',
  DEFAULT: 'DEFAULT',
  TYPE: 'TYPE',
  IMPORT: 'IMPORT',
  AS: 'AS',
  BREAK: 'BREAK',
  CONTINUE: 'CONTINUE',
  RETURN: 'RETURN',
  TRUE: 'TRUE',
  FALSE: 'FALSE',
  NA: 'NA',
  AND: 'AND',
  OR: 'OR',
  NOT: 'NOT',
  METHOD: 'METHOD',

  // Variable and function names
  IDENTIFIER: 'IDENTIFIER',

  // Literal values like numbers, strings, and colors
  NUMBER: 'NUMBER',
  STRING: 'STRING',
  COLOR_HEX: 'COLOR_HEX',

  // Mathematical, logical, and comparison operators
  PLUS: '+',
  MINUS: '-',
  MULTIPLY: '*',
  DIVIDE: '/',
  MODULO: '%',
  EQUAL: '=',
  PLUS_EQUAL: '+=',
  MINUS_EQUAL: '-=',
  MULTIPLY_EQUAL: '*=',
  DIVIDE_EQUAL: '/=',
  EQUAL_EQUAL: '==',
  NOT_EQUAL: '!=',
  GREATER: '>',
  LESS: '<',
  GREATER_EQUAL: '>=',
  LESS_EQUAL: '<=',
  AND_AND: '&&',
  OR_OR: '||',
  BITWISE_AND: '&',
  BITWISE_OR: '|',
  BITWISE_XOR: '^',
  QUESTION: '?',
  COLON: ':',
  COLON_EQUAL: ':=',

  // Brackets, parentheses, and other punctuation
  LPAREN: '(',
  RPAREN: ')',
  LBRACKET: '[',
  RBRACKET: ']',
  LBRACE: '{',
  RBRACE: '}',
  COMMA: ',',
  DOT: '.',
  ARROW: '=>',

  // Whitespace, comments, and indentation tracking
  COMMENT: 'COMMENT',
  NEWLINE: 'NEWLINE',
  INDENT: 'INDENT',
  DEDENT: 'DEDENT',

  // Signals that we have reached the end of the source code
  EOF: 'EOF'
};

const KEYWORDS = new Set([
  'study', 'strategy', 'indicator', 'version', 'var', 'varip',
  'if', 'else', 'for', 'in', 'from', 'to', 'while', 'switch', 'case', 'default',
  'type', 'import', 'as',
  'break', 'continue', 'return', 'true', 'false', 'na',
  'and', 'or', 'not',
  'by', 'method'
]);

class Token {
  constructor(type, value, line, column) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.column = column;
  }

  toString() {
    return `Token(${this.type}, "${this.value}", ${this.line}:${this.column})`;
  }
}

class Lexer {
  constructor(source) {
    // Normalize all line endings to plain newlines so the indentation logic works consistently
    this.source = source.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    this.pos = 0;
    this.line = 1;
    this.column = 0;
    this.currentChar = this.source[0] || null;
    this.indentStack = [0];
    this.pendingIndents = [];
    this.groupDepth = 0;
    this.sawDirectivePrefix = false; // Tracks whether we just consumed a //@ prefix
  }

  readColorHex() {
    const startColumn = this.column;
    let value = '';

    if (this.currentChar !== '#') {
      return null;
    }

    value += this.currentChar;
    this.advance();

    while (this.currentChar && /[0-9a-fA-F]/.test(this.currentChar)) {
      value += this.currentChar;
      this.advance();
    }

    return new Token(TokenType.COLOR_HEX, value, this.line, startColumn);
  }

  advance() {
    if (this.currentChar === '\n') {
      this.line++;
      this.column = 0;
      this.atLineStart = true;
    } else {
      this.column++;
      this.atLineStart = false;
    }
    this.pos++;
    this.currentChar = this.source[this.pos] || null;
  }

  countIndent() {
    let count = 0;
    while (this.currentChar === ' ' || this.currentChar === '\t') {
      count += this.currentChar === '\t' ? 4 : 1;
      this.advance();
    }
    return count;
  }

  peek(offset = 1) {
    return this.source[this.pos + offset] || null;
  }

  skipWhitespace() {
    while (this.currentChar && /\s/.test(this.currentChar) && this.currentChar !== '\n') {
      this.advance();
    }
  }

  skipComments() {
    // Only //@version carries meaning for us. Other //@ annotations (//@description,
    // //@param, //@Metrify author tags, ...) are documentation and must be skipped as
    // ordinary comments, otherwise the word after //@ leaks out as a stray identifier.
    if (this.currentChar === '/' && this.peek(1) === '/' && this.peek(2) === '@') {
      let word = '';
      for (let o = 3; o < 10 && this.peek(o) && /[A-Za-z]/.test(this.peek(o)); o++) word += this.peek(o);
      if (word.toLowerCase() === 'version') return false; // process the version directive
      // otherwise fall through and skip the rest of the line like any other comment
    }
    if (this.currentChar === '/' && this.peek(1) === '/') {
      while (this.currentChar && this.currentChar !== '\n') {
        this.advance();
      }
      return true;
    }
    return false;
  }

  readNumber() {
    let value = '';
    const startColumn = this.column;

    while (this.currentChar && /[\d.]/.test(this.currentChar)) {
      value += this.currentChar;
      this.advance();
    }

    // Also handle scientific notation like 1e-10, 1e6, or 1.5e+3
    if (this.currentChar && (this.currentChar === 'e' || this.currentChar === 'E')) {
      const nextChar = this.peek(1);
      if (nextChar && (/\d/.test(nextChar) || nextChar === '+' || nextChar === '-')) {
        value += this.currentChar; // include the 'e' or 'E'
        this.advance();
        if (this.currentChar === '+' || this.currentChar === '-') {
          value += this.currentChar;
          this.advance();
        }
        while (this.currentChar && /\d/.test(this.currentChar)) {
          value += this.currentChar;
          this.advance();
        }
      }
    }

    return new Token(TokenType.NUMBER, value, this.line, startColumn);
  }

  readString() {
    let value = '';
    const startColumn = this.column;
    const quote = this.currentChar;
    this.advance();

    while (this.currentChar && this.currentChar !== quote) {
      if (this.currentChar === '\\') {
        this.advance();
        value += this.currentChar || '';
      } else {
        value += this.currentChar;
      }
      this.advance();
    }

    this.advance();
    return new Token(TokenType.STRING, value, this.line, startColumn);
  }

  readIdentifier() {
    let value = '';
    const startColumn = this.column;
    const startPos = this.pos;

    while (this.currentChar && /[a-zA-Z0-9_]/.test(this.currentChar)) {
      value += this.currentChar;
      this.advance();
    }

    const lowerValue = value.toLowerCase();

    // When na is followed by a parenthesis it is being called as a function, not used as the NA literal
    const nextChar = this.currentChar;
    if (lowerValue === 'na' && nextChar === '(') {
      return new Token(TokenType.IDENTIFIER, value, this.line, startColumn);
    }

    // Property names that come right after a dot should stay as identifiers, not become keywords
    const prevChar = startPos > 0 ? this.source[startPos - 1] : null;
    if (prevChar === '.') {
      return new Token(TokenType.IDENTIFIER, value, this.line, startColumn);
    }

    // Pine lets you use "type" as a regular identifier (like a function param), so only treat it as a keyword at the start of a line
    if (lowerValue === 'type' && startColumn !== 0) {
      return new Token(TokenType.IDENTIFIER, value, this.line, startColumn);
    }

    if (KEYWORDS.has(lowerValue)) {
      // People use "version" as a variable name all the time, so only treat it as a keyword
      // when it appears at column 0 or right after a //@ directive prefix
      if (lowerValue === 'version' && startColumn !== 0 && !this.sawDirectivePrefix) {
        return new Token(TokenType.IDENTIFIER, value, this.line, startColumn);
      }
      // We have consumed the identifier after a directive prefix, so reset the flag
      this.sawDirectivePrefix = false;
      // Words like "strategy" and "indicator" serve double duty as both statement starters
      // and namespace prefixes (e.g. strategy.percent_of_equity), so only treat them as
      // keywords when they appear at the start of a statement
      if ((lowerValue === 'strategy' || lowerValue === 'indicator') && startColumn !== 0) {
        return new Token(TokenType.IDENTIFIER, value, this.line, startColumn);
      }

      const keywordType = lowerValue.toUpperCase();
      const tt = TokenType[keywordType];
      // Only promote to keyword if there is a matching TokenType defined for it
      if (tt) return new Token(tt, value, this.line, startColumn);
    }

    return new Token(TokenType.IDENTIFIER, value, this.line, startColumn);
  }

  readOperator() {
    const startColumn = this.column;
    const char = this.currentChar;

    // Copy-pasted scripts sometimes contain fancy Unicode dashes, so normalize them to a plain minus
    if (char === '–' || char === '—' || char === '−') {
      this.currentChar = '-';
    }

    switch (char) {
      case ';':
        // Pine treats semicolons as statement separators, especially inside curly-brace blocks
        this.advance();
        return new Token(TokenType.NEWLINE, '\n', this.line, startColumn);
      case '+':
        this.advance();
        if (this.currentChar === '=') {
          this.advance();
          return new Token(TokenType.PLUS_EQUAL, '+=', this.line, startColumn);
        }
        return new Token(TokenType.PLUS, '+', this.line, startColumn);

      case '-':
        this.advance();
        if (this.currentChar === '=') {
          this.advance();
          return new Token(TokenType.MINUS_EQUAL, '-=', this.line, startColumn);
        }
        return new Token(TokenType.MINUS, '-', this.line, startColumn);

      case '*':
        this.advance();
        if (this.currentChar === '=') {
          this.advance();
          return new Token(TokenType.MULTIPLY_EQUAL, '*=', this.line, startColumn);
        }
        return new Token(TokenType.MULTIPLY, '*', this.line, startColumn);

      case '/':
        this.advance();
        if (this.currentChar === '=') {
          this.advance();
          return new Token(TokenType.DIVIDE_EQUAL, '/=', this.line, startColumn);
        }
        return new Token(TokenType.DIVIDE, '/', this.line, startColumn);

      case '%':
        this.advance();
        return new Token(TokenType.MODULO, '%', this.line, startColumn);

      case '=':
        this.advance();
        if (this.currentChar === '=') {
          this.advance();
          return new Token(TokenType.EQUAL_EQUAL, '==', this.line, startColumn);
        }
        if (this.currentChar === '>') {
          this.advance();
          return new Token(TokenType.ARROW, '=>', this.line, startColumn);
        }
        return new Token(TokenType.EQUAL, '=', this.line, startColumn);

      case '!':
        this.advance();
        if (this.currentChar === '=') {
          this.advance();
          return new Token(TokenType.NOT_EQUAL, '!=', this.line, startColumn);
        }
        return new Token(TokenType.NOT, '!', this.line, startColumn);

      case '&':
        this.advance();
        if (this.currentChar === '&') {
          this.advance();
          return new Token(TokenType.AND_AND, '&&', this.line, startColumn);
        }
        return new Token(TokenType.BITWISE_AND, '&', this.line, startColumn);

      case '|':
        this.advance();
        if (this.currentChar === '|') {
          this.advance();
          return new Token(TokenType.OR_OR, '||', this.line, startColumn);
        }
        return new Token(TokenType.BITWISE_OR, '|', this.line, startColumn);

      case '^':
        this.advance();
        return new Token(TokenType.BITWISE_XOR, '^', this.line, startColumn);

      case '>':
        this.advance();
        if (this.currentChar === '=') {
          this.advance();
          return new Token(TokenType.GREATER_EQUAL, '>=', this.line, startColumn);
        }
        return new Token(TokenType.GREATER, '>', this.line, startColumn);

      case '<':
        this.advance();
        if (this.currentChar === '=') {
          this.advance();
          return new Token(TokenType.LESS_EQUAL, '<=', this.line, startColumn);
        }
        return new Token(TokenType.LESS, '<', this.line, startColumn);

      case '?':
        this.advance();
        return new Token(TokenType.QUESTION, '?', this.line, startColumn);

      case ':':
        this.advance();
        if (this.currentChar === '=') {
          this.advance();
          return new Token(TokenType.COLON_EQUAL, ':=', this.line, startColumn);
        }
        return new Token(TokenType.COLON, ':', this.line, startColumn);

      case ',':
        this.advance();
        return new Token(TokenType.COMMA, ',', this.line, startColumn);

      case '.':
        this.advance();
        return new Token(TokenType.DOT, '.', this.line, startColumn);

      case '(':
        this.advance();
        this.groupDepth++;
        return new Token(TokenType.LPAREN, '(', this.line, startColumn);

      case ')':
        this.advance();
        if (this.groupDepth > 0) this.groupDepth--;
        return new Token(TokenType.RPAREN, ')', this.line, startColumn);

      case '[':
        this.advance();
        this.groupDepth++;
        return new Token(TokenType.LBRACKET, '[', this.line, startColumn);

      case ']':
        this.advance();
        if (this.groupDepth > 0) this.groupDepth--;
        return new Token(TokenType.RBRACKET, ']', this.line, startColumn);

      case '{':
        this.advance();
        this.groupDepth++;
        return new Token(TokenType.LBRACE, '{', this.line, startColumn);

      case '}':
        this.advance();
        if (this.groupDepth > 0) this.groupDepth--;
        return new Token(TokenType.RBRACE, '}', this.line, startColumn);
    }

    return null;
  }

  tokenize() {
    const tokens = [];

    const lastSignificantToken = () => {
      for (let i = tokens.length - 1; i >= 0; i--) {
        const t = tokens[i];
        if (!t) continue;
        if (t.type === TokenType.NEWLINE || t.type === TokenType.INDENT || t.type === TokenType.DEDENT || t.type === TokenType.COMMENT) {
          continue;
        }
        return t;
      }
      return null;
    };

    const isLineContinuation = () => {
      const lastTok = lastSignificantToken();
      if (!lastTok) return false;
      const contTypes = new Set([
        TokenType.PLUS, TokenType.MINUS, TokenType.MULTIPLY, TokenType.DIVIDE, TokenType.MODULO,
        TokenType.AND_AND, TokenType.OR_OR, TokenType.BITWISE_AND, TokenType.BITWISE_OR, TokenType.BITWISE_XOR,
        TokenType.AND, TokenType.OR, TokenType.NOT,
        TokenType.EQUAL, TokenType.PLUS_EQUAL, TokenType.MINUS_EQUAL, TokenType.MULTIPLY_EQUAL, TokenType.DIVIDE_EQUAL, TokenType.COLON_EQUAL,
        TokenType.COMMA, TokenType.DOT, TokenType.QUESTION, TokenType.COLON,
      ]);
      return contTypes.has(lastTok.type);
    };

    // Looks ahead from the current newline: if the next non-blank, non-comment
    // line begins with an operator that cannot start a statement (e.g. a leading
    // "?" / ":" of a wrapped ternary, or "+", "and", "."), it's a continuation.
    // The backward check above misses these because the trailing token is an
    // ordinary operand. Pine has no statement that begins with these operators.
    const nextLineStartsContinuation = () => {
      const src = this.source;
      let i = this.pos; // sitting on '\n'
      while (i < src.length) {
        const c = src[i];
        if (c === '\n' || c === ' ' || c === '\t') { i++; continue; }
        if (c === '/' && src[i + 1] === '/') { // skip a comment-only line
          i += 2;
          while (i < src.length && src[i] !== '\n') i++;
          continue;
        }
        break;
      }
      if (i >= src.length) return false;
      const rest = src.slice(i);
      if (/^(and|or)\b/.test(rest)) return true;
      const two = src.slice(i, i + 2);
      if (two === '==' || two === '!=' || two === '<=' || two === '>=') return true;
      return '?:*/%+-<>.'.includes(src[i]);
    };

    const flushPendingIndents = () => {
      while (this.pendingIndents.length > 0) {
        tokens.push(this.pendingIndents.shift());
      }
    };

    while (this.currentChar !== null) {
      if (this.pendingIndents.length > 0) {
        flushPendingIndents();
        continue;
      }

      // When we see a //@ directive like //@version=5, strip the prefix and let the rest get tokenized normally
      if (this.currentChar === '/' && this.peek(1) === '/' && this.peek(2) === '@') {
        this.advance();
        this.advance();
        this.advance();
        this.sawDirectivePrefix = true;
        continue;
      }

      if (this.skipComments()) {
        continue;
      }

      if (/\s/.test(this.currentChar)) {
        if (this.currentChar === '\n') {
          if (this.groupDepth > 0) {
            this.advance();
            continue;
          }

          if (isLineContinuation() || nextLineStartsContinuation()) {
            this.advance();
            // Eat the leading whitespace on the continuation line without emitting indentation tokens
            while (this.currentChar === ' ' || this.currentChar === '\t') {
              this.advance();
            }
            continue;
          }

          if (this.groupDepth === 0) {
            tokens.push(new Token(TokenType.NEWLINE, '\n', this.line, this.column));
          }
          this.advance();

          if (this.currentChar === null) {
            continue;
          }

          const indent = this.countIndent();
          const currentIndent = this.indentStack[this.indentStack.length - 1];

          // Blank lines and comment-only lines should not affect indentation tracking
          if (this.currentChar === '\n' || (this.currentChar === '/' && this.peek(1) === '/')) {
            continue;
          }

          if (indent > currentIndent) {
            this.indentStack.push(indent);
            this.pendingIndents.push(new Token(TokenType.INDENT, '', this.line, this.column));
          } else if (indent < currentIndent) {
            while (this.indentStack.length > 1 && indent < this.indentStack[this.indentStack.length - 1]) {
              this.indentStack.pop();
              this.pendingIndents.push(new Token(TokenType.DEDENT, '', this.line, this.column));
            }
          }
          continue;
        }
        this.advance();
        continue;
      }

      if (/[a-zA-Z_]/.test(this.currentChar)) {
        tokens.push(this.readIdentifier());
        continue;
      }

      if (/\d/.test(this.currentChar) || (this.currentChar === '.' && /\d/.test(this.peek() || ''))) {
        tokens.push(this.readNumber());
        continue;
      }

      if (this.currentChar === '#') {
        tokens.push(this.readColorHex());
        continue;
      }

      if (this.currentChar === '"' || this.currentChar === "'") {
        tokens.push(this.readString());
        continue;
      }

      const operator = this.readOperator();
      if (operator) {
        tokens.push(operator);
        continue;
      }

      throw new Error(`Unexpected character: ${this.currentChar} at ${this.line}:${this.column}`);
    }

    while (this.indentStack.length > 1) {
      this.indentStack.pop();
      tokens.push(new Token(TokenType.DEDENT, '', this.line, this.column));
    }

    tokens.push(new Token(TokenType.EOF, '', this.line, this.column));
    return tokens;
  }
}

export { Lexer, Token, TokenType };
