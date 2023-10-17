import { TokenType } from './types';

/**
 * Tokenizer Regex's.
 */
export const spec: [RegExp, TokenType | null][] = [
  // ————————————————————— Whitespace —————————————————————

  [/^\s+/, null],

  // —————————————————————— Comments ——————————————————————

  [/^\/{2}.*/, null], // Skip single-line comments
  [/^\/\*[\s\S]*?\*\//, null], // Skip multi-line comments

  // ————————————————— Equality operators —————————————————
  // ==, !=, !==

  [/^[=!]=/, 'EQUALITY_OPERATOR'],

  // ———————————————— Assignment operators ————————————————
  // =, *=, /=, +=, -=

  [/^=/, 'SIMPLE_ASSIGN'],
  [/^[*/+-]=/, 'COMPLEX_ASSIGN'],

  // ——————————————————— Math operators ———————————————————
  // +, -, *, /

  [/^[+]/, 'ADDITION_OPERATOR'],
  [/^[-]/, 'SUBTRACTION_OPERATOR'],
  [/^[/]/, 'DIVISION_OPERATOR'],
  [/^[*]/, 'MULTIPLICATION_OPERATOR'],
  [/^[.]/, 'POINT'],
  /*
  [/^[+]/, 'ARITHMETIC_OPERATOR'],
  [/^[-]/, 'ARITHMETIC_OPERATOR'],
  [/^[/]/, 'ARITHMETIC_OPERATOR'],
  [/^[*]/, 'ARITHMETIC_OPERATOR'],

  [/^[+]/, 'CONCATENATION_OPERATOR'],
  [/^(-?\d+)(?=\s|\)|;|$)/, 'int'] */

  // ———————————————— Relational operators ————————————————
  // <, <=, >, >=

  [/^[<>]=?/, 'RELATIONAL_OPERATOR'],

  // —————————————————————— Keywords ——————————————————————
  /*
    if, pass, else, then, break, return, print, read, this,
    for, while, in, try, handler, class, public, private,
    void, static, object, func, abstract, inherits, interface,
    global, constructor, init, end
  */
  [/^\bif\b/, 'RESERVED_KEYWORD'],
  [/^\bpass\b/, 'RESERVED_KEYWORD'],
  [/^\belse\b/, 'RESERVED_KEYWORD'],
  [/^\bthen\b/, 'RESERVED_KEYWORD'],
  [/^\bbreak\b/, 'RESERVED_KEYWORD'],
  [/^\breturn\b/, 'RESERVED_KEYWORD'],
  [/^\bprint\b/, 'RESERVED_KEYWORD'],
  [/^\bread\b/, 'RESERVED_KEYWORD'],
  [/^\bthis\b/, 'RESERVED_KEYWORD'],
  [/^\bfor\b/, 'RESERVED_KEYWORD'],
  [/^\bwhile\b/, 'RESERVED_KEYWORD'],
  [/^\bin\b/, 'RESERVED_KEYWORD'],
  [/^\btry\b/, 'RESERVED_KEYWORD'],
  [/^\bhandler\b/, 'RESERVED_KEYWORD'],
  [/^\bclass\b/, 'RESERVED_KEYWORD'],
  [/^\bpublic\b/, 'RESERVED_KEYWORD'],
  [/^\bprivate\b/, 'RESERVED_KEYWORD'],
  [/^\bvoid\b/, 'RESERVED_KEYWORD'],
  [/^\bstatic\b/, 'RESERVED_KEYWORD'],
  [/^\bobject\b/, 'RESERVED_KEYWORD'],
  [/^\bfunc\b/, 'RESERVED_KEYWORD'],
  [/^\babstract\b/, 'RESERVED_KEYWORD'],
  [/^\binherits\b/, 'RESERVED_KEYWORD'],
  [/^\binterface\b/, 'RESERVED_KEYWORD'],
  [/^\bglobal\b/, 'RESERVED_KEYWORD'],
  [/^\bconstructor\b/, 'RESERVED_KEYWORD'],
  [/^\bnew\b/, 'RESERVED_KEYWORD'],
  [/^\bimport\b/, 'RESERVED_KEYWORD'],
  //[/^\bfrom\b/, 'RESERVED_KEYWORD'],
  //[/^\bimport\b/, 'IMPORT_MODULES'],
  //[/^\bfrom\b/, 'IMPORT_MODULES'],
  //[/^\bfrom\b/, 'IMPORT_MODULES'],

  //[/^\bfrom\b/, 'IMPORT_MODULES'],  

  [/^\bfrom\b/, 'from'],
  [/^\bimport\b/, 'import'],
  // —————————————————————— Booleans ——————————————————————
  // false, true

  [/^(true|false)/, 'bol'],
  [/^\bbol\b/, 'DATA_TYPE'],

  // —————————————————————— Numbers ———————————————————————
  // 0, 1, 3, 1337

  [/^(-?\d+)(?=\s|\)|;|$)/, 'int'],
  [/^\bint\b/, 'DATA_TYPE'],

  [/^(-?\d+\.\d+)(?=\s|\)|;|$)/, 'double'],
  [/^\bdouble\b/, 'DATA_TYPE'],

  // —————————————————————— Char ———————————————————————
  // 'a', 'b', "a", "b"
  [/^'(.)'$/u, 'char'], // Matches single character enclosed in single quotes
  [/^"(.)"$/u, 'char'],
  [/^\bchar\b/, 'DATA_TYPE'],
  // —————————————————————— Strings ———————————————————————
  // 'hello', "hello"

  [/^'[^']*'/u, 'string'],
  [/^"[^"]*"/u, 'string'],
  [/^\bstring\b/, 'DATA_TYPE'],

  // —————————————————————— Empty ———————————————————————
  [/^empty/, 'DATA_TYPE'],

  // —————————————————————— Object ———————————————————————
  [/^object/, 'DATA_TYPE'],
  // ———————————————————— Logical Operator —————————————————————
  // and, or, not example if age >= 18 and hasCar

  [/^\band\b/, 'LOGICAL_OPERATOR'],
  [/^\bor\b/, 'LOGICAL_OPERATOR'],
  [/^\bnot\b/, 'LOGICAL_OPERATOR'],

  // ———————————————— Symbols, delimiters —————————————————
  //  init, end, (, )

  [/^init/, 'OPEN_BLOCK'],
  [/^end/, 'CLOSE_BLOCK'],
  [/^\(/, 'OPEN_PAREN'],
  [/^\)/, 'CLOSE_PAREN'],
  [/^,/, 'COMMA'],

  // ———————————————————— Identifiers —————————————————————
  // j, name, age
  [/^[a-zA-Z_]\w*/, 'IDENTIFIER']
];
