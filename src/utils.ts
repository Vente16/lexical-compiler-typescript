import { ParseNode } from './syntaxis';
import {
  AssignmentTokenType,
  LiteralTokenType,
  Token,
  assignTokenTypes,
  literalTokenTypes,
  tokenTypes
} from './types';

/**
 * Checks if the provided value is an assignment operator token type.
 * @param value The value to inspect
 */
export function isAssignmentOperatorTokenType(
  value: unknown
): value is AssignmentTokenType {
  return (
    typeof value === 'string' &&
    assignTokenTypes.findIndex((type) => type === value) !== -1
  );
}

/**
 * Checks if the provided value is a literal token type.
 * @param value The value to inspect
 */
export function isLiteralTokenType(value: unknown): value is LiteralTokenType {
  return (
    typeof value === 'string' &&
    literalTokenTypes.findIndex((type) => type === value) !== -1
  );
}

/**
 * Checks if the provided value is a Token object.
 * @param value The value to inspect
 */
export function isToken(value: unknown): value is Token {
  return (
    typeof value === 'object' &&
    value !== null &&
    tokenTypes.includes((value as Token).type) &&
    typeof (value as Token).value === 'string'
  );
}

/**
 * Checks if the provided value is a variable keyword type.
 * @param value The value to inspect
 */
export function isVariableTokenType(
  value: unknown
): value is 'CONST' | 'LET' | 'VAR' {
  return typeof value === 'string' && ['CONST', 'LET', 'VAR'].includes(value);
}

type Key = string | number;

export const generateAssemblyPrint = (
  code: string,
  variables: { [key in Key]: any }
): string => {
  // Outer function
  function generateAssemblyPrintInner(
    template: string,
    variables: { [key in Key]: any }
  ): string {
    function replaceVariables(_match: any, p1: string) {
      const replaced = p1.replace(
        /(["'])(?:(?=(\\?))\2.)*?\1/g,
        (match: string) => {
          // Removing the quotes around the string values
          return match.replace(/["']/g, '');
        }
      );

      // Replace variables
      const resultWithoutPlus = replaced.replace(
        /(\w+)/g,
        (match: any, p1: string | number) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return variables[p1] || match;
        }
      );

      return resultWithoutPlus.replace(/\+/g, '');
    }

    const result = template.replace(/(\+.+?(\+|$))/g, replaceVariables);
    return result;
  }

  const match = /print\((.*)\)/.exec(code);

  if (match) {
    const template = match[1];
    const result1 = generateAssemblyPrintInner(template, variables);
    const formatResult = result1.replace(/["']/g, '');
    return assemblyPrint(formatResult);
  }

  return '';
};

const assemblyPrint = (str: string) => {
  return `section	.text
	global _start       ;must be declared for using gcc
_start:                     ;tell linker entry point
	mov	edx, len    ;message length
	mov	ecx, msg    ;message to write
	mov	ebx, 1	    ;file descriptor (stdout)
	mov	eax, 4	    ;system call number (sys_write)
	int	0x80        ;call kernel
	mov	eax, 1	    ;system call number (sys_exit)
	int	0x80        ;call kernel

section	.data

msg	db	'${str}',0xa	;our dear string
len	equ	$ - msg			;length of our dear string`;
};
