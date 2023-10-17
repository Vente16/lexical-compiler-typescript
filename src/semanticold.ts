import { Token, Tokenizer } from './';
import { ParseNode } from './syntaxis';

type TokenType = Token | null;

export class SemanticAnalyzer {
  private declaredVariables: Set<string> = new Set();
  private currentToken: Token | null;
  private blockDepth = 0;
  private tokenizer: Tokenizer;

  constructor(tokenizer: Tokenizer, code = '') {
    this.tokenizer = tokenizer;
    this.currentToken = tokenizer.getNextToken();
    
  }

  public analyze(): void {
    while (this.currentToken) {
      switch (this.currentToken.type) {
        case 'int':
        case 'string':
          this.analyzeVariableDeclaration();
          break;

        case 'if':
          this.blockDepth++;
          this.analyzeIfStatement();
          break;

        case 'end':
          if (this.blockDepth === 0) {
            throw new Error(
              `Unmatched 'end' statement at line ${
                this.currentToken?.line || ''
              }`
            );
          }
          this.blockDepth--;
          // Handle 'end' in other constructs (if/else) if needed
          break;

        case 'print':
          this.analyzePrintStatement();
          break;

          case 'func':
            this.analyzeFunctionDeclaration();
            break;
          
        // Add more cases for other statements and expressions

        default:
          // Handle other tokens if necessary
          break;
      }

      this.currentToken = this.tokenizer.getNextToken();
    }

    if (this.blockDepth > 0) {
      throw new Error(`Unclosed 'if' block`);
    }
  }

  private analyzeVariableDeclaration(): void {
    // Implement logic to check variable declarations
  }

  private analyzeIfStatement(): void {
    // Implement logic to check 'if' statement
    // Check to make sure that the condition is a boolean expression
    const condition = this.tokenizer.getNextToken();
    if (condition?.type !== 'bol') {
      throw new Error(
        `If condition must be a boolean expression at line ${
          condition?.line || ''
        }`
      );
    }

    // Move to the next token
    this.currentToken = condition;
  }

  private parseExpression(): ParseNode {
    const expressionNode: ParseNode = {
      type: 'Expression',
      children: []
    };

    // You can add logic here to parse different types of expressions
    // For simplicity, I'll assume a basic arithmetic expression

    // Handle the first operand (e.g., variable, literal, or function call)
    const operandNode = this.parsePrimaryExpression();
    expressionNode.children.push(operandNode);

    // Check for binary operators (e.g., +, -, *, /)
    while (this.currentToken && this.isBinaryOperator(this.currentToken)) {
      const operatorToken = this.currentToken;
      expressionNode.children.push(operatorToken);
      this.currentToken = this.tokenizer.getNextToken();

      // Handle the next operand
      const nextOperandNode = this.parsePrimaryExpression();
      expressionNode.children.push(nextOperandNode);
    }

    return expressionNode;
  }

  private isBinaryOperator(token: TokenType): boolean {
    return (
      token?.type === 'ADDITION_OPERATOR' ||
      token?.type === 'SUBTRACTION_OPERATOR' ||
      token?.type === 'MULTIPLICATION_OPERATOR' ||
      token?.type === 'DIVISION_OPERATOR'
    );
  }

  private parsePrimaryExpression(): ParseNode {
    // Handle different types of primary expressions (e.g., variables, literals, function calls)
    const primaryExpressionNode: ParseNode = {
      type: 'PrimaryExpression',
      children: []
    };

    if (this.currentToken?.type === 'IDENTIFIER') {
      // Handle variable or function call
      primaryExpressionNode.children.push(this.currentToken);
      this.currentToken = this.tokenizer.getNextToken();

      // Check if it's a function call (look for open parenthesis)
      if (this.currentToken?.type === 'OPEN_PAREN') {
        // Handle function call and arguments (if any)
        primaryExpressionNode.children.push(this.currentToken);
        this.currentToken = this.tokenizer.getNextToken();

        // Parse function arguments here

        // Check for closing parenthesis
        if (this.currentToken?.type === 'CLOSE_PAREN') {
          primaryExpressionNode.children.push(this.currentToken);
          this.currentToken = this.tokenizer.getNextToken();
        } else {
          throw new Error(
            `Expected ')' for function call at line ${
              this.currentToken?.line || ''
            }`
          );
        }
      }
    } else {
      // Handle literals (e.g., numbers, strings, booleans)
      primaryExpressionNode.children.push(this.currentToken);
      this.currentToken = this.tokenizer.getNextToken();
    }

    return primaryExpressionNode;
  }

  private getExpressionDataType(expressionNode: ParseNode): string {
    // Implement logic to determine the data type of an expression
    // You need to traverse the expression tree and check data types
    // For simplicity, I'll assume all operands are of the same data type (no type checking)
    // You should enhance this logic based on your language's type system

    // Example: You can check if all operands are of type 'int' for a simple case
    return 'int';
  }

  private analyzeReturnStatement(returnType: string): void {
    // Check and analyze the return statement
    if (this.currentToken?.type === 'return') {
      this.currentToken = this.tokenizer.getNextToken();

      // Analyze the expression to be returned
      const expressionNode = this.parseExpression(); // You can use your existing expression analysis logic
      // Check the data type of the returned expression
      const expressionDataType = this.getExpressionDataType(expressionNode);

      if (expressionDataType !== returnType) {
        throw new Error(
          `Invalid return type. Expected '${returnType}', but got '${expressionDataType}' at line ${
            this.currentToken?.line || ''
          }`
        );
      }
    } else {
      throw new Error(
        `Expected 'return' statement in a function with a non-void return type at line ${
          this.currentToken?.line || ''
        }`
      );
    }
  }

  private analyzePrintStatement(): void {
    // Implement logic to check 'print' statement
  }

  private analyzeFunctionDeclaration(): void {
    const returnTypeToken = this.currentToken; // Type to return
    this.currentToken = this.tokenizer.getNextToken();
  
    if (!returnTypeToken || returnTypeToken.type !== 'DATA_TYPE') {
      throw new Error(`Invalid function return type at line ${returnTypeToken?.line || ''}`);
    }
  
    const functionNameToken = this.currentToken; // Function name
    this.currentToken = this.tokenizer.getNextToken();
  
    if (!functionNameToken || functionNameToken.type !== 'IDENTIFIER') {
      throw Error(`Invalid function name at line ${functionNameToken?.line || ''}`);
    }
  
    // Check and store function parameters (if any)
    if (this.currentToken?.type === 'OPEN_PAREN') {
      this.currentToken = this.tokenizer.getNextToken();
      this.analyzeFunctionParameters(returnTypeToken.value);
    } else {
      // No open parenthesis for parameters
      if (returnTypeToken.value !== 'void') {
        throw new Error(`Expected '(' for function parameters at line ${returnTypeToken.line || ''}`);
      }
    }
  
    // Check for 'init' to start the block
    if (this.currentToken?.type !== 'init') {
      throw new Error(`Expected 'init' to start the function block at line ${this.currentToken?.line || ''}`);
    }
  
    this.blockDepth++;
  
    // Add code to analyze the function block statements here
    function isEnd(tokenType: string | undefined): tokenType is 'end' {
      return tokenType === 'end';
    }
  
    // Handle 'end' of the function declaration
    if (!isEnd(this.currentToken?.type)) {
      throw new Error(`Expected 'end' to close the function block at line ${this.currentToken?.line || ''}`);
    }
  
    this.blockDepth--;
  
    // Move to the next token
    this.currentToken = this.tokenizer.getNextToken();
  }
  
  private analyzeFunctionParameters(returnType: string): void {
    const parameterNames = new Set<string>();
  
    while (this.currentToken?.type !== 'CLOSE_PAREN') {
      if (this.currentToken?.type === 'DATA_TYPE') {
        const paramType = this.currentToken;
        this.currentToken = this.tokenizer.getNextToken();
  
        if (this.currentToken?.type === 'IDENTIFIER') {
          const paramName = this.currentToken;
  
          // Check for duplicate parameter names
          if (parameterNames.has(paramName.value)) {
            throw new Error(`Duplicate parameter name '${paramName.value}' at line ${paramName.line || ''}`);
          } else {
            parameterNames.add(paramName.value);
          }
  
          // Check if the parameter type matches the specified type
          if (paramType.value !== 'any' && paramType.value !== returnType) {
            throw new Error(`Parameter type mismatch. Expected '${returnType}', but got '${paramType.value}' for parameter '${paramName.value}' at line ${paramName.line || ''}`);
          }
  
          this.currentToken = this.tokenizer.getNextToken();
  
          // Handle more parameters if necessary
          if (this.currentToken?.type === 'COMMA') {
            this.currentToken = this.tokenizer.getNextToken();
          }
        } else {
          throw new Error(`Invalid parameter name at line ${paramType.line || ''}`);
        }
      } else {
        throw new Error(`Invalid parameter type at line ${this.currentToken?.line || ''}`);
      }
    }
  
    // Check for the closing parenthesis
    if (this.currentToken?.type !== 'CLOSE_PAREN') {
      throw new Error(`Expected ')' to close function parameters at line ${this.currentToken?.line || ''}`);
    }
  
    // Move to the next token after closing parenthesis
    this.currentToken = this.tokenizer.getNextToken();
  }
  

  // Add more methods to analyze other language constructs

  // Helper methods for type checking and other tasks
}

// Example usage:
const code = `int age = 30
string name = 'John'

if age >= 30 and name == 'John' init
  print('Welcome!')
 end else init
  print('You are wrong, please quit this place')
 end`;
/*
const tokenizer = new Tokenizer(code);
const semanticAnalyzer = new SemanticAnalyzer(tokenizer);

try {
  semanticAnalyzer.analyze();
  console.log('Semantic analysis passed.');
} catch (error) {
  let message = 'Unknown Error'
  if (error instanceof Error) message = error.message
  console.error('Semantic analysis failed:', error);
}
 */
