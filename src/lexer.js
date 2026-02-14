/**
 * PineScript Lexer - Tokenizes PineScript source code
 */

const TokenType = {
  // Keywords
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

  // Identifiers
  IDENTIFIER: 'IDENTIFIER',

  // Literals
  NUMBER: 'NUMBER',
  STRING: 'STRING',
  COLOR_HEX: 'COLOR_HEX',

  // Operators
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

  // Delimiters
  LPAREN: '(',
  RPAREN: ')',
  LBRACKET: '[',
  RBRACKET: ']',
  LBRACE: '{',
  RBRACE: '}',
  COMMA: ',',
  DOT: '.',
  ARROW: '=>',

  // Comments and Newlines
  COMMENT: 'COMMENT',
  NEWLINE: 'NEWLINE',
  INDENT: 'INDENT',
  DEDENT: 'DEDENT',

  // EOF
  EOF: 'EOF'
};

const KEYWORDS = new Set([
  'study', 'strategy', 'indicator', 'version', 'var', 'varip',
  'if', 'else', 'for', 'in', 'from', 'to', 'while', 'switch', 'case', 'default',
  'type', 'import', 'as',
  'break', 'continue', 'return', 'true', 'false', 'na',
  'and', 'or', 'not',
  'by'
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
    this.source = source;
    this.pos = 0;
    this.line = 1;
    this.column = 0;
    this.currentChar = this.source[0] || null;
    this.indentStack = [0];
    this.pendingIndents = [];
    this.groupDepth = 0;
    this.sawDirectivePrefix = false; // Track if we just saw //@
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
    // Check for directive-style comments like //@version=5
    // These are not regular comments - they are directives
    if (this.currentChar === '/' && this.peek(1) === '/' && this.peek(2) === '@') {
      // Don't skip - let it be tokenized as a directive
      return false;
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

    // Handle scientific notation (e.g., 1e-10, 1e6, 1.5e+3)
    if (this.currentChar && (this.currentChar === 'e' || this.currentChar === 'E')) {
      const nextChar = this.peek(1);
      if (nextChar && (/\d/.test(nextChar) || nextChar === '+' || nextChar === '-')) {
        value += this.currentChar; // add 'e' or 'E'
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

    // `na` can be used as a function `na(x)`; do not tokenize it as the NA literal in that case.
    const nextChar = this.currentChar;
    if (lowerValue === 'na' && nextChar === '(') {
      return new Token(TokenType.IDENTIFIER, value, this.line, startColumn);
    }

    // If this identifier is a property name (immediately follows '.'), do not treat it as a keyword.
    const prevChar = startPos > 0 ? this.source[startPos - 1] : null;
    if (prevChar === '.') {
      return new Token(TokenType.IDENTIFIER, value, this.line, startColumn);
    }

    // Pine allows identifiers named `type` (e.g. function params). Only treat `type` as keyword at line start.
    if (lowerValue === 'type' && startColumn !== 0) {
      return new Token(TokenType.IDENTIFIER, value, this.line, startColumn);
    }

    if (KEYWORDS.has(lowerValue)) {
      // Allow variables/constants named VERSION/version in normal code.
      // Only treat `version` as a keyword when it appears directive-like at column 0
      // OR when it immediately follows a //@ directive prefix.
      if (lowerValue === 'version' && startColumn !== 0 && !this.sawDirectivePrefix) {
        return new Token(TokenType.IDENTIFIER, value, this.line, startColumn);
      }
      // Reset the directive flag after reading any identifier
      this.sawDirectivePrefix = false;
      // Some words like `strategy`/`indicator` are both:
      // - statement starters: `strategy(...)`, `indicator(...)`
      // - namespaces in expressions: `strategy.percent_of_equity`
      // Only treat them as keywords at statement start.
      if ((lowerValue === 'strategy' || lowerValue === 'indicator') && startColumn !== 0) {
        return new Token(TokenType.IDENTIFIER, value, this.line, startColumn);
      }

      const keywordType = lowerValue.toUpperCase();
      const tt = TokenType[keywordType];
      // Only treat as keyword if we have an explicit TokenType for it.
      if (tt) return new Token(tt, value, this.line, startColumn);
    }

    return new Token(TokenType.IDENTIFIER, value, this.line, startColumn);
  }

  readOperator() {
    const startColumn = this.column;
    const char = this.currentChar;

    // Normalize some Unicode variants seen in copy/pasted scripts.
    // Treat common dash characters as '-'.
    if (char === '–' || char === '—' || char === '−') {
      this.currentChar = '-';
    }

    switch (char) {
      case ';':
        // Pine allows semicolons as statement separators (often inside `{ ... }` blocks).
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

      // Handle directive-style comments like //@version=5
      if (this.currentChar === '/' && this.peek(1) === '/' && this.peek(2) === '@') {
        // Skip the //@ prefix and tokenize the rest as normal
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

          if (isLineContinuation()) {
            this.advance();
            // consume indentation spaces/tabs but do not emit INDENT/DEDENT
            while (this.currentChar === ' ' || this.currentChar === '\t') {
              this.advance();
            }
            continue;
          }

          tokens.push(new Token(TokenType.NEWLINE, '\n', this.line, this.column));
          this.advance();

          if (this.currentChar === null) {
            continue;
          }

          const indent = this.countIndent();
          const currentIndent = this.indentStack[this.indentStack.length - 1];

          // Ignore indentation changes on blank lines and comment-only lines
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
