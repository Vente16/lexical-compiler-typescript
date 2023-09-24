/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Token, Tokenizer } from './';

type Nullable<T> = T | null;

export interface ParseNode {
  type: string;
  children: (ParseNode | Nullable<Token>)[];
}

interface Block {
  init: number;
  end: number;
}

export class SyntaxAnalyzer {
  private tokenizer: Tokenizer;
  private currentToken: Token | null;
  private expectedInitLine: number | null = null;

  //private previousToken: Token | null;
  private blockSize: Block = {
    init: 0,
    end: 0
  };
  private declaredVariables: Set<string> = new Set<string>();

  constructor(tokenizer: Tokenizer) {
    this.tokenizer = tokenizer;
    this.currentToken = this.tokenizer.getNextToken();
    //this.previousToken = this.tokenizer.getPreviousToken();
  }

  private declareVariable(identifier: string) {
    this.declaredVariables.add(identifier);
  }

  private isVariableDeclared(identifier: string): boolean {
    return this.declaredVariables.has(identifier);
  }

  public parse(): ParseNode {
    const programNode: ParseNode = {
      type: 'Program',
      children: []
    };

    while (this.currentToken) {
      switch (this.currentToken.type) {
        case 'char':
        case 'string':
        case 'int':
        case 'double':
        case 'bol':
        case 'empty':
        case 'DATA_TYPE':
          console.log('DATA TYPE TEST:', this.currentToken);
          programNode.children.push(this.parseVariableDeclaration());
          break;
        case 'OPEN_BLOCK':
        case 'init':
          this.blockSize.init = this.blockSize.init + 1;
          this.currentToken = this.tokenizer.getNextToken();
          break;

        case 'CLOSE_BLOCK':
        case 'end':
          this.blockSize.end = this.blockSize.end + 1;
          if (this.blockSize.init === this.blockSize.end) {
            this.currentToken = this.tokenizer.getNextToken();
          } else {
            const errorMessage = `Mismatched init and end blocks. Expected 'end' at line ${this.currentToken?.line} ${this.expectedInitLine}`;
            throw new Error(errorMessage);
          }
          this.currentToken = this.tokenizer.getNextToken();
          break;

        case 'SIMPLE_ASSIGN':
          programNode.children.push(this.parseAssignmentStatement());
          break;
        case 'OPEN_PAREN':
          this.currentToken = this.tokenizer.getNextToken();
          continue;
        case 'POINT':
          this.currentToken = this.tokenizer.getNextToken();
          continue;
        case 'CLOSE_PAREN':
          this.currentToken = this.tokenizer.getNextToken();
          continue;
        case 'RESERVED_KEYWORD':
          this.currentToken = this.tokenizer.getNextToken();
          continue;
        case 'IDENTIFIER':
          if (!this.isVariableDeclared(this.currentToken.value)) {
            throw new Error(
              `Variable '${this.currentToken.value}' is not defined at line ${this.currentToken.line}`
            );
          }
          this.currentToken = this.tokenizer.getNextToken();
          continue;

        case 'EQUALITY_OPERATOR':
          programNode.children.push(this.parseExpression());
          break;

        case 'if':
          programNode.children.push(this.parseIfStatement());
          break;

        default:
          throw new Error(
            `Unexpected token at line ${this.currentToken?.line}`
          );
      }
    }

    return programNode;
  }

  private parseAssignmentStatement(): ParseNode {
    const assignmentStatementNode: ParseNode = {
      type: 'AssignmentStatement',
      children: []
    };

    const assignToken = this.currentToken;
    this.currentToken = this.tokenizer.getNextToken();

    if (
      !this.currentToken ||
      !['char', 'string', 'int', 'double', 'bol', 'empty'].includes(
        this.currentToken.type
      )
    ) {
      throw new Error(
        `Expected a valid data type, but got '${this.currentToken?.value}' at line ${this.currentToken?.line}`
      );
    }

    const identifierToken = this.currentToken;
    assignmentStatementNode.children.push(assignToken);
    assignmentStatementNode.children.push(identifierToken);
    this.currentToken = this.tokenizer.getNextToken();

    // Consume the '=' token
    const equalsToken = this.currentToken;
    assignmentStatementNode.children.push(equalsToken);
    this.currentToken = this.tokenizer.getNextToken();

    // Parse the expression on the right side of the assignment
    const expressionNode = this.parseExpression();

    assignmentStatementNode.children.push(expressionNode);

    return assignmentStatementNode;
  }

  // Helper function to get the regular expression for a data type
  /*private getDataTypeRegex(dataType: string): RegExp {
    const dataTypeRegex: { [key: string]: RegExp } = {
      string: /^'.*'$/,
      int: /^\d+$/,
      double: /^\d+(\.\d+)?$/,
      bol: /^(true|false)$/,
      empty: /^empty$/,
      '': /^$/
    };

    return dataTypeRegex[dataType] || /^$/; // Default to an empty regex if data type is not found
  } */

  private parseVariableDeclaration(): ParseNode {
    const variableDeclarationNode: ParseNode = {
      type: 'VariableDeclaration',
      children: []
    };

    const dataTypeRegex = {
      string: /^(?:'[^']*'|"[^"]*")$/,
      int: /^\d+$/,
      double: /^\d+(\.\d+)?$/,
      bol: /^(true|false)$/,
      empty: /^empty$/,
      '': /^$/
    };

    const typeToken = this.currentToken;

    if (typeToken?.type === 'DATA_TYPE' || typeToken?.type === 'IDENTIFIER') {
      if (
        ['char', 'string', 'int', 'double', 'bol', 'empty'].includes(
          typeToken.value
        )
      ) {
        variableDeclarationNode.children.push(typeToken);
        this.currentToken = this.tokenizer.getNextToken();

        if (this.currentToken?.type === 'IDENTIFIER') {
          const identifierToken = this.currentToken;
          this.declareVariable(identifierToken.value);
          console.log('IDENTIFIER', identifierToken);
          console.log('variable declared', this.declaredVariables);

          variableDeclarationNode.children.push(identifierToken);
          this.currentToken = this.tokenizer.getNextToken();

          if (this.currentToken?.type === 'SIMPLE_ASSIGN') {
            const assignmentToken = this.currentToken;
            this.currentToken = this.tokenizer.getNextToken();

            const expressionNode = this.parseExpression();

            // Get the declared data type of the variable
            const declaredDataType = typeToken.value;

            // Check if the expression's data type matches the declared data type

            //console.log('expressionDataType', expressionDataType);
            //console.log('declaredDataType', declaredDataType);

            //console.log('expressionNode', expressionNode);
            //console.log('token', this.currentToken);
            const tokenDataType = this.currentToken?.type;

            if (tokenDataType === 'DATA_TYPE') {
              throw new Error(
                `Variable '${identifierToken.value}' is declared as '${declaredDataType}', but the value was not assigned at line ${assignmentToken?.line}`
              );
            }
            // Validate the assignment
            if (declaredDataType !== this.currentToken?.type) {
              throw new Error(
                `Variable '${identifierToken.value}' is declared as '${declaredDataType}', but the assigned value is invalid at line ${assignmentToken?.line}`
              );
            }

            variableDeclarationNode.children.push(assignmentToken);
            variableDeclarationNode.children.push(expressionNode);
          }
        } else {
          throw new Error(
            `Expected variable name after '${typeToken.value}', but did not get at line ${typeToken.line}`
          );
        }
      } else {
        const identifierToken = typeToken;
        variableDeclarationNode.children.push(identifierToken);
        this.currentToken = this.tokenizer.getNextToken();

        if (this.currentToken?.type === 'SIMPLE_ASSIGN') {
          const assignmentToken = this.currentToken;
          this.currentToken = this.tokenizer.getNextToken();

          const expressionNode = this.parseExpression();

          // Get the declared data type of the variable
          const declaredDataType = identifierToken.value;

          // Check if the expression's data type matches the declared data type
          const expressionDataType = this.getExpressionDataType(expressionNode);
          console.log('expressionDataType', expressionDataType);
          console.log('declaredDataType', declaredDataType);

          if (expressionDataType !== declaredDataType) {
            throw new Error(
              `Variable '${identifierToken.value}' is declared as '${declaredDataType}', but the assigned value is of type '${expressionDataType}' at line ${assignmentToken?.line}`
            );
          }

          variableDeclarationNode.children.push(assignmentToken);
          variableDeclarationNode.children.push(expressionNode);
        }
      }
    } else if ((typeToken?.type || '') in dataTypeRegex) {
      const valueToken = typeToken?.value || '';
      const typeTokenValid = typeToken?.type || '';
      if (
        dataTypeRegex[typeTokenValid as keyof typeof dataTypeRegex].test(
          valueToken
        )
      ) {
        variableDeclarationNode.children.push(typeToken);
        this.currentToken = this.tokenizer.getNextToken();

        if (this.currentToken?.type === 'IDENTIFIER') {
          const identifierToken = this.currentToken;
          variableDeclarationNode.children.push(identifierToken);
          this.currentToken = this.tokenizer.getNextToken();

          if (this.currentToken?.type === 'SIMPLE_ASSIGN') {
            const assignmentToken = this.currentToken;
            this.currentToken = this.tokenizer.getNextToken();

            const expressionNode = this.parseExpression();

            // Get the declared data type of the variable
            const declaredDataType = typeToken?.value;

            // Check if the expression's data type matches the declared data type
            const expressionDataType =
              this.getExpressionDataType(expressionNode);
            console.log('expressionDataType', expressionDataType);
            console.log('declaredDataType', declaredDataType);

            if (expressionDataType !== declaredDataType) {
              throw new Error(
                `Variable '${identifierToken.value}' is declared as '${declaredDataType}', but the assigned value is of type '${expressionDataType}' at line ${assignmentToken?.line}`
              );
            }

            variableDeclarationNode.children.push(assignmentToken);
            variableDeclarationNode.children.push(expressionNode);
          }
        }
      } else {
        throw new Error(
          `Expected a valid datatype value, but got '${typeToken?.value}'`
        );
      }
    } else {
      throw new Error(
        `Expected 'DATA_TYPE' or 'int', but got '${typeToken?.type}'`
      );
    }

    return variableDeclarationNode;
  }

  // ...

  private getTokenDataType(tokenValue: string): string {
    switch (tokenValue) {
      case 'string':
        return 'string';
      case 'int':
        return 'int';
      case 'double':
        return 'double';
      case 'bol':
        return 'bol';
      case 'empty':
        return 'empty';
      default:
        return '';
    }
  }

  private getExpressionDataType(expressionNode: ParseNode): string {
    if (
      expressionNode.type === 'Expression' &&
      expressionNode.children.length > 0
    ) {
      const firstChild = expressionNode.children[0];
      if (firstChild && firstChild.type === 'IDENTIFIER') {
        const identifier = firstChild as Token;
        return this.getTokenDataType(identifier.value);
      }
    } else if (
      expressionNode.type === 'AssignmentStatement' &&
      expressionNode.children.length === 3
    ) {
      const variableName = (expressionNode.children[1] as Token).value;
      return this.getTokenDataType(variableName);
    }
    return '';
  }

  private parseIfStatement(): ParseNode {
    const ifStatementNode: ParseNode = {
      type: 'IfStatement',
      children: []
    };

    const ifToken = this.currentToken;
    this.currentToken = this.tokenizer.getNextToken();

    if (this.currentToken?.type === 'OPEN_PAREN') {
      ifStatementNode.children.push(this.currentToken);
      this.currentToken = this.tokenizer.getNextToken();
    } else {
      throw new Error(
        `Expected '(' after 'if', but got '${this.currentToken?.type}' at line ${this.currentToken?.line}`
      );
    }

    const conditionNode = this.parseExpression();
    ifStatementNode.children.push(ifToken);
    ifStatementNode.children.push(conditionNode);

    if (
      this.currentToken?.type === 'init' ||
      this.currentToken?.type === 'OPEN_BLOCK'
    ) {
      ifStatementNode.children.push(this.currentToken);
      this.expectedInitLine = this.currentToken.line || null; // Track the line where 'init' is expected
      this.currentToken = this.tokenizer.getNextToken();

      const initBlockNode = this.parseBlockStatement();
      ifStatementNode.children.push(initBlockNode);

      if (this.currentToken?.type === 'end') {
        ifStatementNode.children.push(this.currentToken);
        this.currentToken = this.tokenizer.getNextToken();
      } else {
        throw new Error(
          `Expected 'end' after 'init' block, but got '${this.currentToken?.type}' at line ${this.currentToken?.line}`
        );
      }
    } else {
      throw new Error(
        `Expected 'init' block after 'if' statement, but got '${this.currentToken?.type}' at line ${this.expectedInitLine}`
      );
    }

    return ifStatementNode;
  }

  private parseBlockStatement(): ParseNode {
    const blockStatementNode: ParseNode = {
      type: 'BlockStatement',
      children: []
    };

    return blockStatementNode;
  }

  private parseExpression(): ParseNode {
    const expressionNode: ParseNode = {
      type: 'Expression',
      children: []
    };

    if (this.currentToken?.type === 'EQUALITY_OPERATOR') {
      expressionNode.children.push(this.currentToken);
      this.currentToken = this.tokenizer.getNextToken();
    }

    if (this.currentToken?.type === 'IDENTIFIER') {
      const nextToken = this.tokenizer.peekNextToken();
      if (nextToken?.type === 'SIMPLE_ASSIGN') {
        const identifierToken = this.currentToken;
        expressionNode.children.push(identifierToken);
        this.currentToken = this.tokenizer.getNextToken();

        const assignToken = this.currentToken;
        expressionNode.children.push(assignToken);
        this.currentToken = this.tokenizer.getNextToken();

        const expressionRightNode = this.parseExpression();
        expressionNode.children.push(expressionRightNode);
      } else {
        const identifierToken = this.currentToken;
        expressionNode.children.push(identifierToken);
        this.currentToken = this.tokenizer.getNextToken();
      }
    }

    return expressionNode;
  }

  /*
  private isImportStatementLine(line: number): boolean {
    // Split the line into words
    const words = this.tokenizer._lines_splitted[line].split(/\s+/);

    if (words[0] === 'import' && words.length >= 4) {
      // Check if the line matches the import statement structure
      if (words[2] === 'from') {
        return true; // Valid import statement
      } else {
        // Check if it's an invalid import statement with a different structure
        return false;
      }
    } else {
      // Check if it's a valid variable declaration line
      // You can add more conditions if needed to validate variable declarations
      return true;
    }
  }  */
}
