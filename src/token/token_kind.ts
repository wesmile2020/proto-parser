export enum TokenKind {
  unknown,

  identifier,

  literal,

  /* 关键字 */
  syntax,
  package,
  message,
  optional,
  required,
  repeated,
  int32,
  int64,
  uint32,
  uint64,
  sint32,
  sint64,
  fixed32,
  fixed64,
  sfixed32,
  sfixed64,
  bool,
  float,
  double,
  string,
  bytes,

  /* 运算符 */
  add,
  subtract,
  multiply,
  divide,
  assignment,

  /* 符号 */
  singleQuotes,
  doubleQuotes,
  semicolon,

  /* 括号 */
  leftParentheses, // (
  rightParentheses, // )
  leftSquareBrackets, // [
  rightSquareBrackets, // ]
  leftAngleBrackets, // <
  rightAngleBrackets, // >
  leftBrace, // {
  rightBrace, // }

  /* 注释 */
  singleComment, // 单行注释 '//'
  multipleCommentStart, // /*
  multipleCommentEnd, // */
}

