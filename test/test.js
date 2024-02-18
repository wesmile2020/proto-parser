const fs = require('fs');
const path = require('path');
const { scan } = require('../dist/token/scan');

const url = path.resolve(__dirname, 'test.proto');

const str = fs.readFileSync(url, 'utf-8');

const tokens = scan(str);

console.log(tokens);
