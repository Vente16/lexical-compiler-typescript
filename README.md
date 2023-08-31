# Lexical compiler

A small lexical compiler for a new "Programming Language" 

## Token Specification 

| TOKEN TYPE   | TOKEN VALUE                      |
|--------------|----------------------------------|
| RESERVED_KEYWORD      | if, pass, else, then, break, return, print, read, this, for, while, in, try, handler, class, public, private, void, static, object, func, abstract, inherits, interface, global, constructor, init, end, new|
|DATA_TYPE| char, string, int, double, bol, empty|
| COMMA   | ,               |
|OPEN_CURLY_BRACKET     |  {                |
|CLOSE_CURLY_BRACKET     |  }             |
|OPEN_PAREN     |  (             |
|OPEN_PAREN     |  )             |
|SIMPLE_ASSIGN     |  =          |
|COMPLEX_ASSIGN     |  += -= =+ =- *=           |
|ADDITION_OPERATOR     |  +           |
|SUBTRACTION_OPERATO   |  -           |
|DIVISION_OPERATOR     |  /           |
|MULTIPLICATION_OPERATOR     |  *         |
|EQUALITY_OPERATOR     | =           |
|RELATIONAL_OPERATOR  |  ==, !=, >, <, >=, <= |
|OPEN_BLOCK     |  init          |
|CLOSE_BLOCK   |  end       |
|LOGICAL_OPERATOR     |  and, or, not          |


## Prerequisites

- Install [ Node js](https://nodejs.dev/en/) > v16.20.0 
- Install [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) as global


## Setting up

Install node dependencies
```shell
 yarn install
```

## Running the project

Run the following command
```shell
 yarn dev
```

### commands

- `yarn build` to compile the typescript code to javascript
- `yarn run lint` to run the eslint.
- `yarn test` to run the jest tests.
- `yarn run dev` to build the project in watch mode for development