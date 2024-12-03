const fs = require('fs');
const path = require('path');
const { Lex } = require('../dist/token/lex');
const { TokenKind } = require('../dist/token/token_kind');

const url = path.resolve(__dirname, 'test.proto');

const str = fs.readFileSync(url, 'utf-8');

const lex = new Lex();

const tokens = lex.parse(str);

console.log(tokens.map((item) => {
  return {
    ...item,
    kind: TokenKind[item.kind],
  }
}));

