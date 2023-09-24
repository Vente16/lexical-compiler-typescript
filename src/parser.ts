import { Tokenizer } from './checker';
import { Token } from './types';
import { ASTNode, VariableDeclaration, IfStatement, OpenBlock } from './ast';

export class Parser {
  private tokenizer: Tokenizer;
  private currentToken: Token | null;
  private blockStack: string[] = []; // Stack to track "init" and "end" blocks

  constructor(tokenizer: Tokenizer) {
    this.tokenizer = tokenizer;
    this.currentToken = this.tokenizer.getNextToken();
  }

  private consumeToken(): void {
    this.currentToken = this.tokenizer.getNextToken();
  }

  private matchToken(expectedType: string): boolean {
    if (this.currentToken && this.currentToken.type === expectedType) {
      this.consumeToken();
      return true;
    }
    return false;
  }

  private expectToken(expectedType: string): void {
    if (!this.matchToken(expectedType)) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `Expected token "${expectedType}", but got "${this.currentToken?.value}"`
      );
    }
  }

  parseStatement(): ASTNode | null {
    if (this.matchToken('if')) {
      const condition = this.currentToken!.value;
      const body = this.parseBlock();
      return {
        type: 'CONDITIONAL_STATEMENT',
        condition,
        body
      } as IfStatement;
    }

    // Check for "init" token
    if (this.matchToken('init')) {
      this.blockStack.push('init'); // Push "init" onto the block stack
      const body = this.parseBlock();
      this.expectToken('end'); // Expect an "end" token
      this.blockStack.pop(); // Pop the last element from the block stack
      return {
        type: 'OPEN_BLOCK',
        body
      } as OpenBlock;
    }

    if (this.blockStack.length > 0 && this.matchToken('DATATYPE')) {
      const dataType = this.currentToken!.value;
      const identifier = this.currentToken!.value;

      // Check if there is a value token
      if (this.matchToken('VALUE')) {
        return {
          type: 'VARIABLE_DECLARATION',
          dataType,
          identifier,
          value: this.currentToken!.value
        } as VariableDeclaration;
      }

      // If there is no value token, return a VariableDeclaration without 'value'
      return {
        type: 'VARIABLE_DECLARATION',
        dataType,
        identifier,
        value: '' // or any default value you prefer
      } as VariableDeclaration;
    }

    return null; // Return null for unrecognized constructs
  }

  parseBlock(): ASTNode[] {
    if (this.blockStack.length === 0) {
      throw new Error('Block mismatch: No "init" block found for "end" block');
    }

    const body: ASTNode[] = [];

    while (!this.matchToken('end')) {
      const statement = this.parseStatement();
      if (statement) {
        body.push(statement);
      }
    }

    return body;
  }

  parseProgram(): (VariableDeclaration | IfStatement)[] {
    const program: (VariableDeclaration | IfStatement)[] = [];

    while (this.currentToken) {
      const statement = this.parseStatement();
      if (statement) {
        if (statement.type === 'CONDITIONAL_STATEMENT') {
          program.push(statement);
        } else {
          program.push(statement as VariableDeclaration);
        }
      } else {
        throw new Error(`Unexpected token: "${this.currentToken.value}"`);
      }
    }

    return program;
  }
}
