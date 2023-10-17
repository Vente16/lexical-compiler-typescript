import { Tokenizer } from './checker';
import { ParseNode } from './syntaxis';
import { Token } from './types';

type FunctionType = 'int' | 'string' | 'bol' | 'void';

export interface FunctionDeclaration {
  type: FunctionType;
  name: string;
  parameters: FunctionParameter[];
  body: ParseNode[];
}

interface FunctionParameter {
  type: string; // The data type of the parameter
  name: string; // The name of the parameter
}

export class SemanticAnalyzer {
  private declaredVariables: Set<string> = new Set<string>();
  private declaredFunctions: Set<string> = new Set<string>();
  private currentToken: Token | null;
  private tokenizer: Tokenizer;

  constructor(tokenizer: Tokenizer, code = '') {
    this.tokenizer = tokenizer;
    this.currentToken = this.tokenizer.getNextToken();
  }

  public analyzeSyntax(tree: ParseNode): void {
    this.analyzeNode(tree);
  }

  private analyzeNode(node: ParseNode) {
    if (node.type === 'VariableDeclaration') {
      this.analyzeVariableDeclaration(node);
    } else if (node.type === 'FunctionDeclaration') {
      this.analyzeFunctionDeclaration(node);
    }

    if (node.children) {
      for (const child of node.children) {
        if (child && typeof child !== 'string') {
          this.analyzeNode(child as ParseNode);
        }
      }
    }
  }

  private analyzeVariableDeclaration(node: ParseNode) {
    const dataTypeToken = node.children[0] as Token;
    const identifierToken = node.children[1] as Token;

    if (this.isVariableDeclared(identifierToken.value)) {
      throw new Error(
        `Variable '${identifierToken.value}' is already declared.`
      );
    }

    this.declareVariable(identifierToken.value);
  }

  public analyzeFunctionDeclaration(node: ParseNode): void {
    if (node.children.length >= 2) {
      const functionToken = node.children[0] as Token;
      const functionNameToken = node.children[1] as Token;

      if (this.isFunctionDeclared(functionNameToken.value)) {
        throw new Error(
          `Function '${functionNameToken.value}' is already declared.`
        );
      }

      this.declareFunction(functionNameToken.value);
    } else {
      throw new Error('Invalid function declaration structure');
    }
  }

  private declareVariable(identifier: string) {
    this.declaredVariables.add(identifier);
  }

  private isVariableDeclared(identifier: string): boolean {
    return this.declaredVariables.has(identifier);
  }

  private declareFunction(functionName: string) {
    this.declaredFunctions.add(functionName);
  }

  private isFunctionDeclared(functionName: string): boolean {
    return this.declaredFunctions.has(functionName);
  }

  public parseFunctionDeclaration(): FunctionDeclaration {
    const functionDeclaration: FunctionDeclaration = {
      type: 'void', // Default to 'void' type
      name: '',
      parameters: [],
      body: []
    };

    // Parse 'func' keyword
    this.expectToken('func');
    this.currentToken = this.tokenizer.getNextToken();

    // Parse the return type
    if (
      ['int', 'string', 'bol', 'void'].includes(this.currentToken?.value || '')
    ) {
      functionDeclaration.type = this.currentToken?.value as FunctionType;
    } else {
      throw new Error(
        `Invalid function return type: ${this.currentToken?.value || ''}`
      );
    }
    this.currentToken = this.tokenizer.getNextToken();

    // Parse the function name
    if (this.currentToken?.type === 'IDENTIFIER') {
      functionDeclaration.name = this.currentToken?.value || '';
    } else {
      throw new Error(
        `Invalid function name: ${this.currentToken?.value || ''}`
      );
    }
    this.currentToken = this.tokenizer.getNextToken();

    // Parse function parameters
    if (this.currentToken?.type === 'OPEN_PAREN') {
      this.currentToken = this.tokenizer.getNextToken();
      if (this.currentToken?.type !== 'CLOSE_PAREN') {
        functionDeclaration.parameters = this.parseFunctionParameters();
      }
    } else {
      throw new Error('Expected function parameter list');
    }

    // Parse 'init' keyword
    this.expectToken('init');
    this.currentToken = this.tokenizer.getNextToken();

    // Parse function body
    functionDeclaration.body = this.parseFunctionBody();

    // Parse 'end' keyword
    this.expectToken('end');
    this.currentToken = this.tokenizer.getNextToken();

    return functionDeclaration;
  }

  private parseFunctionParameters(): FunctionParameter[] {
    const parameters: FunctionParameter[] = [];
    while (this.currentToken?.type === 'DATA_TYPE') {
      const parameterType = this.currentToken.value;
      this.currentToken = this.tokenizer.getNextToken();
      if (this.currentToken?.type === 'IDENTIFIER') {
        const parameterName = this.currentToken.value;
        parameters.push({ type: parameterType, name: parameterName });
        this.currentToken = this.tokenizer.getNextToken();
        if (this.currentToken?.type === 'COMMA') {
          this.currentToken = this.tokenizer.getNextToken();
        } else {
          break;
        }
      } else {
        throw new Error(
          `Invalid function parameter: ${this.currentToken?.value || ''}`
        );
      }
    }
    this.expectToken('CLOSE_PAREN');
    return parameters;
  }

  private parseFunctionBody(): ParseNode[] {
    const body: ParseNode[] = [];
    // Add your logic to parse the statements within the function body.
    // You can use a loop or switch statement to parse different types of statements.
    // Example:
    while (this.currentToken && this.currentToken.type !== 'end') {
      if (this.currentToken?.type === 'print') {
        body.push(this.parsePrintStatement());
      }
      // Add more cases for other statement types...
      else {
        throw new Error(
          `Invalid statement in function body: ${this.currentToken.value}`
        );
      }
    }
    return body;
  }

  public parseFunctionCall(): void {
    // Implement function call parsing here and validate the parameters.
  }

  private expectToken(expectedToken: string): void {
    if (this.currentToken?.type === expectedToken) {
      this.currentToken = this.tokenizer.getNextToken();
    } else {
      throw new Error(
        `Expected '${expectedToken}' but got '${
          this.currentToken?.value || ''
        }'`
      );
    }
  }

  private parsePrintStatement(): ParseNode {
    // Implement the logic to parse a print statement here.
    const printStatementNode: ParseNode = {
      type: 'PrintStatement',
      children: []
    };

    // Parse 'print' keyword
    this.expectToken('print');

    // Parse the expression to be printed
    const expressionNode = this.parseExpression();

    printStatementNode.children.push(expressionNode);

    // You can add additional logic to handle the print statement here.

    return printStatementNode;
  }

  private parseExpression(): ParseNode {
    // Implement the logic to parse an expression here.
    const expressionNode: ParseNode = {
      type: 'Expression',
      children: []
    };

    // You can add logic to parse different types of expressions based on your language's syntax.

    // For example, if your language has arithmetic expressions:
    while (
      this.currentToken &&
      this.isArithmeticOperator(this.currentToken.type)
    ) {
      const operatorToken = this.currentToken;
      this.currentToken = this.tokenizer.getNextToken();
      const operandNode = this.parseOperand(); // You should implement this function too.
      expressionNode.children.push(operatorToken, operandNode);
    }

    return expressionNode;
  }

  private isArithmeticOperator(tokenType: string): boolean {
    return [
      'ADDITION_OPERATOR',
      'SUBTRACTION_OPERATOR',
      'DIVISION_OPERATOR',
      'MULTIPLICATION_OPERATOR'
    ].includes(tokenType);
  }

  private parseOperand(): ParseNode {
    // Implement the logic to parse an operand here.
    const operandNode: ParseNode = {
      type: 'Operand',
      children: []
    };

    // You can add logic to parse different types of operands based on your language's syntax.

    if (this.currentToken?.type === 'int') {
      operandNode.children.push(this.currentToken);
      this.currentToken = this.tokenizer.getNextToken();
    } else if (this.currentToken?.type === 'IDENTIFIER') {
      operandNode.children.push(this.currentToken);
      this.currentToken = this.tokenizer.getNextToken();
    } else if (this.currentToken?.type === 'OPEN_PAREN') {
      // Handle parenthesized expressions
      this.currentToken = this.tokenizer.getNextToken();
      const expressionNode = this.parseExpression();
      operandNode.children.push(expressionNode);

      // Expect a closing parenthesis
      if (this.currentToken?.type === 'CLOSE_PAREN') {
        operandNode.children.push(this.currentToken);
        this.currentToken = this.tokenizer.getNextToken();
      } else {
        throw new Error(`Expected closing parenthesis.`);
      }
    } else {
      throw new Error(`Invalid operand: ${this.currentToken?.value || ''}`);
    }

    return operandNode;
  }
}
