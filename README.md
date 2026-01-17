# Simple RDBMS - Pesapal Junior Dev Challenge '26

A relational database management system built from scratch in TypeScript, featuring SQL parsing, query execution, Primary key constraint, and CRUD operations.

## Overview

This project implements a working RDBMS to learn demonstrate understanding of how databases work under the hood.

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
# Visit http://localhost:3000
```

### Try it in the REPL

```sql
db> CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)
db> INSERT INTO users (id, name, age) VALUES (1, 'Alice', 30), (2, 'Bob', 25)
db> SELECT * FROM users WHERE age > 26
db> UPDATE users SET age = 31 WHERE name = 'Alice'
db> DELETE FROM users WHERE id = 2
```

## Architecture

### High-Level Design

```
SQL Query → Tokenizer → Parser → AST → Executor → Result
                                          ↓
                                       Database
                                          ↓
                                        Table 
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
- **Web API**: POST endpoints that expects sql in the body e.g. `POST:` `{sql: "SELECT * FROM users WHERE age > 26" }`

### Key Design Decisions

**Why In-Memory Storage?**

- Project timeline limitation
- Simplifies implementation
- Fast for demos and testing
- Persistence can be added later

**Why Table and Database as Classes?**

- Natural state encapsulation (rows, indexes, schema)
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

- **PRIMARY KEY** - Uniqueness enforcement with automatic indexing
- **WHERE clause** - Filter rows with operators: `=`, `!=`, `>`, `<`, `>=`, `<=`

### Error Handling
- Primary key violation detection
- Table/column existence checks
- Clear error messages

## Limitations (Known Trade-offs)

### Not Implemented

- **Persistence** - Data lives in memory only (restarts clear data)
- **Transactions** - No ACID guarantees, no rollback
- **Complex Queries** - No `GROUP BY`, `ORDER BY`, `LIMIT`, subqueries
-  **Joins** - Due to time limitation, Joins are not supported
- **Advanced Constraints** - No FOREIGN KEY, UNIQUE checks (except PRIMARY KEY)
- **NULL Handling** - All columns are implicitly NOT NULL
- **Auto-increment** - Primary keys must be manually specified
- **Concurrent Access** - Single-threaded, no locking

## What I Learned

### 1. Databases Are Just Data Structures + Abstraction

## Tech Stack

- **TypeScript** - Type safety and modern JavaScript
- **Node.js** - Runtime environment
- **tsx** - Fast TypeScript execution

## License

MIT License - feel free to learn from, modify, or use this code.
