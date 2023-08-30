import { Token, Tokenizer } from '.';

type Nullable<T> = T | null;

const myCode = `
int age = 30
string name = 'John'

if age >= 30 and name == 'John' init
  print('Welcome!')
 end else init
  print('You are wrong, please quit this place')
 end`;

/*
// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
const filePath = `${__dirname}/basic.be`;

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
fs.readFile(
  filePath,
  'utf8',
  (err: NodeJS.ErrnoException | null, data: string | undefined) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('file content: ', data);
  }
); */

// Initialize the lexer with some code
const lexer = new Tokenizer(myCode);

const tokens: Nullable<Token>[] = [lexer.getNextToken()];
let nextToken: Nullable<Token> = lexer.getNextToken();

while (nextToken) {
  if (nextToken.type !== 'LOGICAL_OPERATOR') {
    tokens.push(nextToken);
  }
  nextToken = lexer.getNextToken();
}

console.log(tokens);
