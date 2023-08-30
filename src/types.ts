export const reservedKeywordsTokenTypes = [
  'if',
  'pass',
  'else',
  'then',
  'break',
  'return',
  'print',
  'read',
  'this',
  'for',
  'while',
  'in',
  'try',
  'handler',
  'class',
  'public',
  'private',
  'void',
  'static',
  'object',
  'func',
  'abstract',
  'inherits',
  'interface',
  'global',
  'constructor',
  'init',
  'end',
  'new'
] as const;

export const literalTokenTypes = [
  'char',
  'string',
  'int',
  'double',
  'bol',
  'empty'
] as const;

const symbolTokenTypes = [
  'COMMA',
  'OPEN_CURLY_BRACKET',
  'CLOSE_CURLY_BRACKET',
  'OPEN_PAREN',
  'CLOSE_PAREN'
] as const;

export const assignTokenTypes = ['SIMPLE_ASSIGN', 'COMPLEX_ASSIGN'] as const;

const operatorTokenTypes = [
  'ADDITION_OPERATOR',
  'SUBTRACTION_OPERATOR',
  'DIVISION_OPERATOR',
  'MULTIPLICATION_OPERATOR',
  'EQUALITY_OPERATOR',
  'RELATIONAL_OPERATOR'
] as const;

export const blockKeywordsTokenTypes = ['OPEN_BLOCK', 'CLOSE_BLOCK'] as const;

// const blockKeywordsTokenTypes = ['init', 'end'] as const;

const logicalTokenTypes = ['LOGICAL_OPERATOR'] as const;
const keywordsTokenTypes = ['RESERVED_KEYWORD'] as const;
const dataTypesTokenTypes = ['DATA_TYPE'] as const;

export const tokenTypes = [
  'IDENTIFIER',
  ...assignTokenTypes,
  ...keywordsTokenTypes,
  ...literalTokenTypes,
  ...operatorTokenTypes,
  ...symbolTokenTypes,
  ...keywordsTokenTypes,
  ...blockKeywordsTokenTypes,
  ...logicalTokenTypes,
  ...dataTypesTokenTypes
] as const;

export type AssignmentTokenType = (typeof assignTokenTypes)[number];
export type LiteralTokenType = (typeof literalTokenTypes)[number];
export type TokenType = (typeof tokenTypes)[number];
export type BlockKeywordsTokenType = (typeof blockKeywordsTokenTypes)[number];
export type LocalTokenOperator = (typeof logicalTokenTypes)[number];

export type Token = {
  type: TokenType;
  value: string;
};
