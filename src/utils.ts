export function getWhitespace(count: number) {
  return new Array(count).fill(' ').join('');
}

export function isAlpha(char: string) {
  return /[a-z]/i.test(char);
}

export function isNumber(char: string) {
  return /\d/.test(char);
}

export function isIgnoreChar(char: string) {
  return char === ' ' || char === '\n' || char === '\t' || char === '\r';
}

export function isRelationOperator(char: string) {
  return char === '>' || char === '<' || char === '=';
}

export function isMathOperator(char: string) {
  return (char === '+' || char === '-' || char === '*' || char === '/' || char === '%' 
    || char === '&' || char === '|' || char === '^' || char === '~'
    || char === '='
  );
}
