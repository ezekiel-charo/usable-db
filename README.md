# Simple RDBMS - Pesapal Junior Dev Challenge '26

A relational database management system built from scratch in TypeScript, featuring SQL parsing, query execution, primary key constraint, and CRUD operations.

## Overview

This project implements a minimal but functional RDBMS to demonstrate understanding of database internals such as schema enforcement, query parsing, and execution.

## Quick Start (60 seconds)

```bash
# Clone and install
git clone https://github.com/ezekiel-charo/usable-db
cd usable-db
npm install

# Run interactive REPL
npm start

# Or run the server interface
npm run server
# Visit http://localhost:3000/api/query
```

### Try it in the REPL

```sql
db> CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)
db> INSERT INTO users (id, name, age) VALUES (1, 'Alice', 30), (2, 'Bob', 25)
db> SELECT * FROM users WHERE age > 26
db> UPDATE users SET age = 31 WHERE name = 'Alice'
db> DELETE FROM users WHERE id = 2
```

## Supported SQL Subset

This project supports a deliberately small subset of SQL:

- CREATE TABLE table (column type [PRIMARY KEY], ...)
- INSERT INTO table (columns...) VALUES (...)
- SELECT columns FROM table WHERE condition
- UPDATE table SET column = value WHERE condition
- DELETE FROM table WHERE condition

WHERE conditions only support comparison operators (`=`, `!=`, `>`, `<`, `>=`, `<=`) without `AND` chaining.

## Architecture

The implementation favors simplicity and readability over performance, with the goal of making the system easy to reason about and extend.

### High-Level Design

```
SQL Query
    ↓
Tokenizer ──→ Breaks SQL into tokens
    ↓
Parser ──────→ Builds Abstract Syntax Tree (AST)
    ↓
Executor
    ↓
database.getTable(table_name)
    ↓
Table API (insert / select / update / delete)
    ↓
Result
```

### Core Components

**1. Storage Layer** (`src/core/`)

- **Database**: Manages collection of tables
- **Table**: Stores rows, enforces schema and constraints

**2. Query Processing** (`src/query/`)

- **Tokenizer**: SQL string → tokens (lexical analysis)
- **Parser**: Tokens → AST (syntax analysis)
- **Executor**: AST → execute operations on tables

**3. Interfaces**

- **REPL**: Interactive SQL shell
- **Web**: POST endpoint that expects sql in the body e.g. `POST:` `{sql: "SELECT * FROM users WHERE age > 26" }`

### Key Design Decisions

**Why In-Memory Storage?**

- Short project timeline
- Simplifies implementation
- Fast for demos and testing
- Persistence can be added later

**Why Table and Database as Classes?**

- Clear ownership of data
- Easy to reason about mutations

## Features Implemented

### Core SQL Operations

- `CREATE TABLE` - Define tables with schema
- `INSERT INTO` - Add rows (single or multiple)
- `SELECT` - Retrieve data with column selection
- `UPDATE` - Modify existing rows
- `DELETE` - Remove rows

### Data Types

- `INTEGER` - Numeric values
- `TEXT` - String values
- `BOOLEAN` - True/false values

### Constraints & Features

- **PRIMARY KEY** - Uniqueness enforcement
- **WHERE clause** - Filter rows with operators: `=`, `!=`, `>`, `<`, `>=`, `<=`

### Error Handling

- Primary key violation detection
- Table/column existence checks
- Clear error messages

## Limitations (Known Trade-offs)

### Not Implemented

- **Joins** - Joins are not implemented in order to prioritize correctness of single-table queries
- **Persistence** - Data lives in memory only (restarts clear data)
- **Multiple databases** - Currently only one default database is supported
- **Transactions** - No ACID guarantees, no rollback
- **Complex Queries** - No `GROUP BY`, `ORDER BY`, `LIMIT`, subqueries
- **Advanced Constraints** - No FOREIGN KEY, UNIQUE checks (except PRIMARY KEY)
- **Auto-increment** - Primary keys must be manually specified
- **Indexing** - Indexing (B-tree or hash map) not yet supported
- **Concurrent Access** - Single-threaded, no locking
- **Authentication & Authorization** - There is no authentication or authorization 

## What I Learned

### 1. Databases Are Abstracted Data Structures and algorithms

As a mental model, databases can be viewed as a collection of data structures and algorithms exposed through a declarative querying interface. (SQL)

### 2. Indexing makes writes slower for a reason

Indexing makes reads faster but has the downside of making writes slower. I learnt that writes are slower because the B/B+ trees commonly used for indexing must be rebalanced or updated on writes, which explains the write overhead.

### 3. SQL is a DSL for Data Structure Operations

SQL lets you declare what you want to do to data and the database figures out how to efficiently achieve that.

### 4. Better understanding Lexers and parsers

Building a lexer and parser from scratch (with help from AI & [Youtube tutorials](https://www.youtube.com/watch?v=lwF1zrlXaW8&list=PLdcl7L1x9I0SCDCz2Vlaalnxz_beZaoNm&index=1)) gave me a better understanding of compilers and interpreters work, and an appreciation of existing compiler tools.

## Future Improvements

- Add basic JOIN support
- Introduce simple indexing using a hash map
- Persist data to disk using JSON
- Improve error specificity in the parser

## Project Structure

```
src/
├── core/           # Core database entities
│   ├── Database.ts   # Database management
│   ├── Table.ts      # Table with rows
│   └── types.ts      # Shared type definitions
├── query/            # SQL processing
│   ├── tokenizer.ts  # Lexical analysis
│   ├── parser.ts     # Syntax analysis → AST
│   ├── executor.ts   # Execute queries
│   └── ast.ts        # AST type definitions
├── repl/
│   └── repl.ts      # Interactive shell
│   └── utils.ts      # REPL printing utils
├── web/
│   └── server.ts     # Web Interface
└── index.ts          # Main entry point
```

## Tech Stack

- **TypeScript** - Type safety and modern JavaScript
- **Node.js** - Runtime environment
- **Express.js** - Web server
- **tsx** - Fast TypeScript execution during development

## License

MIT License - feel free to learn from, modify, or use this code.
