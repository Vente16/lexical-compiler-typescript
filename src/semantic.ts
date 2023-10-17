import { Token } from './'; // Import your token definition here
import { Nullable } from './syntaxis';

// Define a function declaration structure
interface FunctionDeclaration {
    returnType: string;
    name: string;
    parameters: string[]; // An array of parameter types
  }
  

export class SemanticAnalyzer {
  variableTypes: Map<string, string> = new Map(); // To track variable types
  functionSignatures: Map<string, string> = new Map(); // To track function return types

  analyzeProgram(tokens: Nullable<Token>[]): void {
    this.analyzeCode(tokens);
  }

  analyzeCode(tokens: Nullable<Token>[]): void {
    while (tokens.length > 0) {
      if (
        tokens[0]?.type === 'RESERVED_KEYWORD' &&
        tokens[0].value === 'func'
      ) {
        this.analyzeFunctionDeclaration(tokens);
      }
    }
  }


   private parseFunctionDeclaration(tokens: Nullable<Token>[]): FunctionDeclaration {
    const declaration: FunctionDeclaration = {
      returnType: "",
      name: "",
      parameters: []
    };
  
    if (tokens.shift()?.type === 'RESERVED_KEYWORD' && tokens[0]?.type === 'DATA_TYPE') {
      declaration.returnType = tokens.shift()?.value || '';
  
      if (tokens[0]?.type === 'IDENTIFIER') {
        declaration.name = tokens.shift()!.value;
      } else {
        throw new Error(`Expected a valid function name at line ${tokens[0]?.line || ''}`);
      }
  
      if (tokens[0]?.type === 'OPEN_PAREN') {
        // Parse parameter list
        tokens.shift(); // Consume the open parenthesis
  
        while (tokens[0]?.type === 'DATA_TYPE') {
          const paramType = tokens.shift()?.value;
          if (tokens[0]?.type === 'IDENTIFIER') {
            declaration.parameters.push(paramType || '');
            tokens.shift(); // Consume parameter name
          } else {
            throw new Error(`Expected a valid parameter name at line ${tokens[0]?.line || ''}`);
          }
  
          if (tokens[0]?.type === 'COMMA') {
            tokens.shift(); // Consume comma if there are more parameters
          }
        }
  
        if (tokens[0]?.type === 'CLOSE_PAREN') {
          tokens.shift(); // Consume the closing parenthesis
        } else {
          throw new Error(`Expected a closing parenthesis ')' after the parameter list at line ${tokens[0]?.line || ''}`);
        }
      }
  
      if (tokens[0]?.type === 'init') {
        tokens.shift(); // Consume 'init' keyword
      } else {
        throw new Error(`Expected 'init' keyword after function declaration at line ${tokens[0]?.line || ''}`);
      }
  
      // Analyze the function body (code block)
      this.analyzeCodeBlock(tokens);
  
      if (tokens[0]?.type === 'end') {
        tokens.shift(); // Consume 'end' keyword
      } else {
        throw new Error(`Expected 'end' keyword to close the function at line ${tokens[0]?.line || ''}`);
      }
  
    } else {
      throw new Error(`Expected a valid return type at line ${tokens[0]?.line || ''}`);
    }
  
    return declaration;
  }

  analyzeFunctionDeclaration(tokens: Nullable<Token>[]): void {
    const declaration = this.parseFunctionDeclaration(tokens);
  
    // Now you can use the parsed function declaration
    const { returnType, name, parameters } = declaration;
  
    // Store the function signature
    this.functionSignatures.set(name, returnType);
  }
    

  // Function declaration should not contain 'end'

  // Code to analyze 'end' should be in a separate method
  // that is called outside the function declaration context

  analyzeEndKeyword(tokens: Nullable<Token>[]): void {
    // Consume 'end' keyword
    if (tokens[0]?.type === 'end') {
      tokens.shift(); // Consume 'end' keyword
    } else {
      throw new Error(
        `Expected 'end' keyword to close the function at line ${
          tokens[0]?.line || ''
        }`
      );
    }
  }

  analyzeVariableDeclaration(tokens: Nullable<Token>[]): void {
    const dataType = tokens.shift();
    if (dataType?.type !== 'DATA_TYPE') {
      throw new Error(
        `Expected a valid data type at line ${dataType?.line || ''}`
      );
    }

    const identifier = tokens.shift();
    if (identifier?.type !== 'IDENTIFIER') {
      throw new Error(
        `Expected a valid variable name at line ${identifier?.line || ''}`
      );
    }

    // Check for assignment
    if (tokens[0]?.type === 'SIMPLE_ASSIGN') {
      this.analyzeAssignmentStatement(tokens, dataType.value);
    }
  }

  analyzeParameterList(tokens: Nullable<Token>[]): void {
    // Implement parameter list analysis
  }

  analyzeAssignmentStatement(
    tokens: Nullable<Token>[],
    declaredDataType: string
  ): void {
    // Implement assignment statement analysis
  }

  analyzeCodeBlock(tokens: Nullable<Token>[]): void {
    // Implement code block analysis
  }
}
