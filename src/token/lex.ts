import { TokenKind } from './token_kind';
import { isAlpha, isIgnoreChar, isMathOperator, isNumber, isRelationOperator } from '../utils';

export class Token {
  kind: TokenKind = TokenKind.unknown;
  value: unknown;

  constructor(kind: TokenKind, value: unknown) {
    this.kind = kind;
    this.value = value;
  }
}

export class Lex {
  private _idx: number = 0;
  private _input: string = '';
  private _keywords: Token[] = [];
  private _operators: Token[] = [];

  constructor() {
    this._keywords = [
      new Token(TokenKind.import, 'import'),
      new Token(TokenKind.syntax, 'syntax'),
      new Token(TokenKind.package, 'package'),
      new Token(TokenKind.message, 'message'),
      new Token(TokenKind.optional, 'optional'),
      new Token(TokenKind.required, 'required'),
      new Token(TokenKind.repeated, 'repeated'),
      new Token(TokenKind.int32, 'int32'),
      new Token(TokenKind.int64, 'int64'),
      new Token(TokenKind.uint32, 'uint32'),
      new Token(TokenKind.sint32, 'sint32'),
      new Token(TokenKind.sint64, 'sint64'),
      new Token(TokenKind.fixed32, 'fixed32'),
      new Token(TokenKind.fixed64, 'fixed64'),
      new Token(TokenKind.sfixed32, 'sfixed32'),
      new Token(TokenKind.sfixed64, 'sfixed64'),
      new Token(TokenKind.bool, 'bool'),
      new Token(TokenKind.float, 'float'),
      new Token(TokenKind.double, 'double'),
      new Token(TokenKind.string, 'string'),
      new Token(TokenKind.bytes, 'bytes'),
    ];

    this._operators = [
      new Token(TokenKind.add, '+'),
      new Token(TokenKind.subtract, '-'),
      new Token(TokenKind.multiply, '*'),
      new Token(TokenKind.divide, '/'),
      new Token(TokenKind.remainder, '%'),
      new Token(TokenKind.addEqual, '+='),
      new Token(TokenKind.subtractEqual, '-='),
      new Token(TokenKind.multiplyEqual, '*='),
      new Token(TokenKind.divideEqual, '/='),
      new Token(TokenKind.remainderEqual, '%='),
      new Token(TokenKind.selfAdd, '++'),
      new Token(TokenKind.selfSubtract, '--'),

      new Token(TokenKind.bitWith, '&'),
      new Token(TokenKind.bitOr, '|'),
      new Token(TokenKind.bitXor, '^'),
      new Token(TokenKind.bitReverse, '~'),
      new Token(TokenKind.bitRightMove, '>>'),
      new Token(TokenKind.bitLeftMove, '<<'),
      new Token(TokenKind.bitWidthEqual, '&='),
      new Token(TokenKind.bitOrEqual, '|='),
      new Token(TokenKind.bitXorEqual, '^='),
      new Token(TokenKind.bitReverseEqual, '~='),
      new Token(TokenKind.bitRightMoveEqual, '>>='),
      new Token(TokenKind.bitLeftMoveEqual, '<<='),

      new Token(TokenKind.greater, '>'),
      new Token(TokenKind.less, '<'),
      new Token(TokenKind.greaterEqual, '>='),
      new Token(TokenKind.lessEqual, '<='),
      new Token(TokenKind.equal, '=='),
      new Token(TokenKind.allEqual, '==='),
      new Token(TokenKind.assignment, '='),

      new Token(TokenKind.logicWith, '&&'),
      new Token(TokenKind.logicOr, '||'),

    ];
  }

  private _searchKeywordIndex(input: string) {
    for (let i = 0; i < this._keywords.length; i += 1) {
      if (input === this._keywords[i].value) {
        return i;
      }
    }
    return -1;
  }

  private _processAlpha(char: string) {
    let current = char;
    this._idx += 1;
    while (this._idx < this._input.length) {
      if (/\w/.test(this._input[this._idx])) {
        current += this._input[this._idx];
      } else {
        break;
      }
      this._idx += 1;
    }
    const keywordIndex = this._searchKeywordIndex(current);
    if (keywordIndex === -1) {
      return new Token(TokenKind.identifier, current);
    }

    return this._keywords[keywordIndex];
  }

  private _processNumber(char: string) {
    let current = char;
    this._idx += 1;
    let kind = TokenKind.integerNumber;
    while (this._idx < this._input.length) {
      const item = this._input[this._idx];
      if (isNumber(item) || item === '.') {
        current += item;
        if (item === '.') {
          kind = TokenKind.floatNumber;
        }
      } else if (item === 'x') {
        if (current === '0') {
          current += item;
        } else {
          break;
        }
      } else {
        break;
      }
      this._idx += 1;
    }

    return new Token(kind, Number(current));
  }

  private _processRelationOperator(char: string) {
    let current = char;
    this._idx += 1;
    while (this._idx < this._input.length) {
      if (isRelationOperator(this._input[this._idx])) {
        current += this._input[this._idx];
      } else {
        break;
      }
      this._idx += 1;
    }
    const operatorIndex = this._operators.findIndex((item) => item.value === current);
    if (operatorIndex !== -1) {
      return this._operators[operatorIndex];
    }
    return new Token(TokenKind.unknown, current);
  }

  private _processMathOperator(char: string) {
    let current = char;
    this._idx += 1;
    while (this._idx < this._input.length) {
      if (isMathOperator(this._input[this._idx])) {
        current += this._input[this._idx];
      } else {
        break;
      }
      this._idx += 1;
    }
    // 判断是否是单行注释
    if (current[0] === '/' && current[1] === '/') {
      while (this._idx < this._input.length) {
        if (this._input[this._idx] !== '\n') {
          current += this._input[this._idx];
        } else {
          break;
        }
        this._idx += 1;
      }
      return new Token(TokenKind.singleComment, current);
    }

    // 判断是否是多行注释
    if (current[0] === '/' && current[1] === '*') {
      while (this._idx < this._input.length - 1) {
        if (this._input[this._idx] === '*' && this._input[this._idx + 1] === '/') {
          current += '*/';
          this._idx += 2;
          break;
        } else {
          current += this._input[this._idx];
        }
        this._idx += 1;
      }
      return new Token(TokenKind.multipleComment, current);
    }

    const operatorIndex = this._operators.findIndex((item) => item.value === current);
    if (operatorIndex !== -1) {
      return this._operators[operatorIndex];
    }
    return new Token(TokenKind.unknown, current);
  }

  private _processOther(char: string) {
    if (char === '\'') {
      return new Token(TokenKind.singleQuotes, char);
    }
    if (char === '"') {
      return new Token(TokenKind.doubleQuotes, char);
    }
    if (char === '`') {
      return new Token(TokenKind.templateQuotes, char);
    }
    if (char === ';') {
      return new Token(TokenKind.semicolon, char);
    }
    if (char === '(') {
      return new Token(TokenKind.leftParentheses, char);
    }
    if (char === ')') {
      return new Token(TokenKind.rightParentheses, char);
    }
    if (char === '[') {
      return new Token(TokenKind.leftSquareBrackets, char);
    }
    if (char === ']') {
      return new Token(TokenKind.rightSquareBrackets, char);
    }
    if (char === '{') {
      return new Token(TokenKind.leftBrace, char);
    }
    if (char === '}') {
      return new Token(TokenKind.rightBrace, char);
    }

    return new Token(TokenKind.unknown, char);
  }

  parse(input: string) {
    // 每次parse；索引设置为0
    this._idx = 0;
    this._input = input;

    const result: Token[] = [];

    while (this._idx < this._input.length) {
      const char = this._input[this._idx];
      if (isIgnoreChar(char)) {
        this._idx += 1;
        continue;
      }
      if (isAlpha(char)) {
        const item = this._processAlpha(char);
        result.push(item);
      } else if (isNumber(char)) {
        const item = this._processNumber(char);
        result.push(item);
      } else if (isRelationOperator(char)) {
        const item = this._processRelationOperator(char);
        result.push(item);
      } else if (isMathOperator(char)) {
        const item = this._processMathOperator(char);
        result.push(item);
      } else {
        const item = this._processOther(char);
        this._idx += 1;
        result.push(item);
      }
    }
    return result;
  }
}