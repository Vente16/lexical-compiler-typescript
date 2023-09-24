// ast.ts
export type ASTNode =
  | VariableDeclaration
  | IfStatement
  | OpenBlock
  | EndBlock;

export interface VariableDeclaration {
  type: 'VARIABLE_DECLARATION';
  dataType: string;
  identifier: string;
  value?: string;
}

export interface IfStatement {
  type: 'CONDITIONAL_STATEMENT';
  condition: string;
  body: ASTNode[];
}

export interface OpenBlock {
  type: 'OPEN_BLOCK';
  body: ASTNode[];
}

export interface EndBlock {
  type: 'END_BLOCK';
}
