export enum TokenKind {
  unknown,

  identifier,
  integerNumber,
  floatNumber,

  /* 关键字 */
  import,
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

  /* 算术运算符 */
  add, // +
  subtract, // -
  multiply, // *
  divide, // /
  remainder, // %
  addEqual, // +=
  subtractEqual, // -=
  multiplyEqual, // *=
  divideEqual, // /=
  remainderEqual, // %=
  selfAdd, // ++
  selfSubtract, // --
  bitWith, // &
  bitOr, // |
  bitXor, // ^
  bitReverse, // ~
  bitRightMove, // >>
  bitLeftMove, // <<
  bitWidthEqual, // &=
  bitOrEqual, // |=
  bitXorEqual, // ^=
  bitReverseEqual, // ~=
  bitRightMoveEqual, // >>=
  bitLeftMoveEqual, // <<= 

  /* 关系运算符 */
  greater, // >
  less, // <
  greaterEqual, // >=
  lessEqual, // <=
  equal, // ==
  allEqual, // ===
  assignment, // =

  /** 逻辑运算符 */
  logicWith, // &&
  logicOr, // ||


  /* 引号 */
  singleQuotes, // '
  doubleQuotes, // "
  templateQuotes, // `
  semicolon, // ;

  /* 括号 */
  leftParentheses, // (
  rightParentheses, // )
  leftSquareBrackets, // [
  rightSquareBrackets, // ]
  leftBrace, // {
  rightBrace, // }

  /* 注释 */
  singleComment, // 单行注释 '//'
  multipleComment, //
}

