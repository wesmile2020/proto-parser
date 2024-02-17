const fs = require('fs');
const path = require('path');
const { parse } = require('../dist/token/parse');

const url = path.resolve(__dirname, 'test.proto');

const str = fs.readFileSync(url, 'utf-8');

const tokens = parse(str);

console.log(tokens);
