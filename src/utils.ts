export function isSpace(input: string) {
  return /\s/.test(input) || /\n/.test(input);
}