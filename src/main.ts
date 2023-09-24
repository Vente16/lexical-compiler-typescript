// Main.ts

import { Tokenizer } from './checker';
//import { Parser } from './parser';
import { ParseNode, SyntaxAnalyzer } from './syntaxis';

const myCode = `
int age = 10
bol name = false

if age == 10 init 
  print('Welcome')
 end else init
  print('You are wrong, please quit this place')
 end`;

const lexer = new Tokenizer(myCode);
const syntaxAnalyzer = new SyntaxAnalyzer(lexer);
const programNode = syntaxAnalyzer.parse();

// Walk through the parsed program and print the type of each node
function printNodeType(node: ParseNode) {
  console.log(node.type);
  if (node.children) {
    for (const child of node.children) {
      if (child) {
        printNodeType(child as ParseNode);
      }
    }
  }
}

printNodeType(programNode);
