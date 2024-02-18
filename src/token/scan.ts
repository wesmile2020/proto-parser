import { TokenKind } from './token_kind';

class Token {
  kind: TokenKind = TokenKind.unknown;
  value: unknown;

  constructor(kind: TokenKind, value: unknown) {
    this.kind = kind;
    this.value = value;
  }
}

function scanKeyword(input: string) {
  const keywords = [
   new Token(TokenKind.syntax, 'syntax'),
   new Token(TokenKind.package, 'package'),
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
  for (let i = 0; i < keywords.length; i += 1) {
    if (input === keywords[i].value) {
      return keywords[i];
    }
  }
  return null;
}

function scanSymbol(input: string) {
  const symbols = [
    new Token(TokenKind.add, '+'),
    new Token(TokenKind.subtract, '-'),
    new Token(TokenKind.multiply, '*'),
    new Token(TokenKind.divide, '/'),
    new Token(TokenKind.assignment, '='),

    new Token(TokenKind.singleQuotes, '\''),
    new Token(TokenKind.doubleQuotes, '"'),
    new Token(TokenKind.semicolon, ';'),

    new Token(TokenKind.leftParentheses, '('),
    new Token(TokenKind.rightParentheses, ')'),
    new Token(TokenKind.leftSquareBrackets, '['),
    new Token(TokenKind.rightSquareBrackets, ']'),
    new Token(TokenKind.leftAngleBrackets, '<'),
    new Token(TokenKind.rightAngleBrackets, '>'),
    new Token(TokenKind.leftBrace, '{'),
    new Token(TokenKind.rightBrace, '}'),
  ];
  for (let i = 0; i < symbols.length; i += 1) {
    if (symbols[i].value === input) {
      return symbols[i];
    }
  }
  return null;
}

function scanComment(input: string) {
  const comments = [
    new Token(TokenKind.singleComment, '//'),
    new Token(TokenKind.multipleCommentStart, '/*'),
    new Token(TokenKind.multipleCommentEnd, '*/'),
  ];
  for (let i = 0; i < comments.length; i += 1) {
    if (comments[i].value === input) {
      return comments[i];
    }
  }
  return null;
}

function isDeclareKeyword(token: Token) {
  return (
    token.kind === TokenKind.package || token.kind === TokenKind.message ||
    token.kind === TokenKind.int32 || token.kind === TokenKind.int64 ||
    token.kind === TokenKind.uint32 || token.kind === TokenKind.uint64 ||
    token.kind === TokenKind.sint32 || token.kind === TokenKind.sint64 ||
    token.kind === TokenKind.fixed32 || token.kind === TokenKind.fixed64 ||
    token.kind === TokenKind.sfixed32 || token.kind === TokenKind.sfixed64 ||
    token.kind === TokenKind.bool || token.kind === TokenKind.float ||
    token.kind === TokenKind.double || token.kind === TokenKind.string ||
    token.kind === TokenKind.bytes
  );
}

const unknownToken = new Token(TokenKind.unknown, 0);

export function scan(input: string) {
  const result: Token[] = [];
  let lastToken = unknownToken

  let i = 0;
  let current = '';
  while (i < input.length) {
    if (i < input.length - 1) {
      const comment = scanComment(input[i] + input[i + 1]);
      if (comment) {
        if (comment.kind === TokenKind.multipleCommentEnd && lastToken.kind === TokenKind.multipleCommentStart) {
          const token = new Token(TokenKind.literal, current);
          result.push(token);
          lastToken = unknownToken;
          current = '';
        }

        result.push(comment);
        lastToken = comment;
        
        current = '';
        i += 2;
        continue;
      }
    }

    if (lastToken.kind === TokenKind.singleComment) {
      if (input[i] === '\n' || i === input.length - 1) {
        const token = new Token(TokenKind.literal, current);
        result.push(token);
        lastToken = unknownToken;
        current = '';
      } else {
        current += input[i];
      }

      i += 1;
      continue;
    }

    if (lastToken.kind === TokenKind.multipleCommentStart) {
      current += input[i];
      i += 1;
      continue;
    }

    if (/\s/.test(input[i])) {
      if (current) {
        if (isDeclareKeyword(lastToken)) {
          const token = new Token(TokenKind.identifier, current);
          result.push(token);
          lastToken = token;
        } else {
          const keyword = scanKeyword(current);
          if (keyword) {
            result.push(keyword);
            lastToken = keyword;
          } else {
            result.push(new Token(TokenKind.unknown, current));
          }
        }
      }
      current = '';
      i += 1;
      continue;
    }

    const symbol = scanSymbol(input[i]);
    if (symbol) {
      if (current) {
        if (isDeclareKeyword(lastToken)) {
          const token = new Token(TokenKind.identifier, current);
          result.push(token);
          lastToken = symbol;
        } else if (lastToken.kind === TokenKind.doubleQuotes && symbol.kind === TokenKind.doubleQuotes) {
          const token = new Token(TokenKind.literal, current);
          result.push(token);
          lastToken = unknownToken;
        } else if (lastToken.kind === TokenKind.assignment && symbol.kind === TokenKind.semicolon) {
          const token = new Token(TokenKind.literal, current);
          result.push(token);
          lastToken = unknownToken;
        } else {
          result.push(new Token(TokenKind.unknown, current));
        }
      } else {
        lastToken = symbol;
      }
      result.push(symbol);
      current = '';
      i += 1;
      continue;
    }
    current += input[i];
    i += 1;
  }

  if (current) {
    result.push(new Token(TokenKind.unknown, current));
  }

  return result;
}