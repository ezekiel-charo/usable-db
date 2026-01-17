import { ColumnToUpdate } from "../core/types";
import {
  AST,
  CreateTableAST,
  DeleteAST,
  InsertAST,
  SelectAST,
  UpdateAST,
  WhereClause,
} from "./ast";
import { Token, TokenType } from "./tokenizer";

export class Parser {
  private tokens: Token[];
  private current = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  /**
   * Reads the token at the current position
   * @returns The read token
   */
  private peek(): Token | undefined {
    return this.tokens[this.current];
  }

  /**
   * Reads the token at the current position and advances the current position
   * @returns The read token
   */
  private advance(): Token {
    return this.tokens[this.current++]!;
  }

  /**
   * Validate if the current token is the expected token in the statement
   * and then advances the current token position, otherwise throws an error.
   * @param type The expected type of token  e.g. KEYWORD, IDENTIFIER etc.
   * @param value The expected value of the token
   * @returns The current token
   */
  private expect(type: TokenType, value?: string): Token {
    const token = this.peek();
    if (!token) throw new Error(`Expected ${type} but got EOF`);
    if (token.type !== type)
      throw new Error(`Expected ${type} but got ${token.type}`);
    if (value && token.value !== value) {
      throw new Error(`Expected "${value}" but got "${token.value}"`);
    }
    return this.advance();
  }

  /**
   * Checks is the current token is of the specified type and value
   * @param type The type of token  e.g. KEYWORD, IDENTIFIER etc.
   * @param value The value of the token e.g. SELECT, etc
   * @returns True if the current token passes the check, otherwise false.
   */
  private match(type: TokenType, value?: string): boolean {
    const token = this.peek();
    if (!token) return false;
    if (token.type !== type) return false;
    if (value && token.value !== value) return false;
    return true;
  }

  /**
   * Parses the tokens created from a SQL statement
   * @returns an AST that can be used to execute the statement
   */
  parse(): AST {
    const token = this.peek();
    if (!token) throw new Error("Empty query");

    switch (token.value) {
      case "CREATE":
        return this.parseCreate();
      case "INSERT":
        return this.parseInsert();
      case "SELECT":
        return this.parseSelect();
      case "UPDATE":
        return this.parseUpdate();
      case "DELETE":
        return this.parseDelete();
      default:
        throw new Error(`Unexpected keyword: ${token.value}`);
    }
  }

  /**
   * parses 'CREATE' statements
   * @returns An AST for creating a table
   */
  private parseCreate(): CreateTableAST {
    this.expect(TokenType.KEYWORD, "CREATE");
    this.expect(TokenType.KEYWORD, "TABLE");
    const tableName = this.expect(TokenType.IDENTIFIER).value;
    this.expect(TokenType.LPAREN);

    const columns: CreateTableAST["columns"] = [];

    while (!this.match(TokenType.RPAREN)) {
      const name = this.expect(TokenType.IDENTIFIER).value;
      const dataType = this.expect(TokenType.KEYWORD).value as
        | "INTEGER"
        | "TEXT"
        | "BOOLEAN";

      let isPrimaryKey = false;
      if (this.match(TokenType.KEYWORD, "PRIMARY")) {
        this.advance();
        this.expect(TokenType.KEYWORD, "KEY");
        isPrimaryKey = true;
      }

      columns.push({ name, dataType, isPrimaryKey });

      if (this.match(TokenType.COMMA)) {
        this.advance();
      }
    }

    this.expect(TokenType.RPAREN);

    return { type: "CREATE_TABLE", tableName, columns };
  }

  /**
   * parses 'INSERT' statements
   * @returns An AST for inserting values into a table
   */
  private parseInsert(): InsertAST {
    this.expect(TokenType.KEYWORD, "INSERT");
    this.expect(TokenType.KEYWORD, "INTO");
    const tableName = this.expect(TokenType.IDENTIFIER).value;

    // Parse column names (optional)
    let columns: string[] = [];
    if (this.match(TokenType.LPAREN)) {
      this.advance();
      while (!this.match(TokenType.RPAREN)) {
        columns.push(this.expect(TokenType.IDENTIFIER).value);
        if (this.match(TokenType.COMMA)) this.advance();
      }
      this.expect(TokenType.RPAREN);
    }

    this.expect(TokenType.KEYWORD, "VALUES");

    const values: any[][] = [];

    // Parse value rows
    while (this.match(TokenType.LPAREN)) {
      this.advance();
      const row: any[] = [];

      while (!this.match(TokenType.RPAREN)) {
        row.push(this.parseValue());
        if (this.match(TokenType.COMMA)) this.advance();
      }

      this.expect(TokenType.RPAREN);
      values.push(row);

      if (this.match(TokenType.COMMA)) this.advance();
    }

    return { type: "INSERT", tableName, columns, values };
  }

  /**
   * parses 'SELECT' statements
   * @returns An AST for selecting data a table
   */
  private parseSelect(): SelectAST {
    this.expect(TokenType.KEYWORD, "SELECT");

    // Parse columns
    const columns: string[] = [];
    if (this.match(TokenType.ASTERISK)) {
      this.advance();
      columns.push("*");
    } else {
      while (true) {
        const col = this.expect(TokenType.IDENTIFIER).value;
        columns.push(col);
        if (!this.match(TokenType.COMMA)) break;
        this.advance();
      }
    }

    this.expect(TokenType.KEYWORD, "FROM");
    const from = this.expect(TokenType.IDENTIFIER).value;

    let where: WhereClause | undefined;
    let join: SelectAST["join"];

    // Parse JOIN
    if (this.match(TokenType.KEYWORD, "INNER")) {
      this.advance();
      this.expect(TokenType.KEYWORD, "JOIN");
      const joinTable = this.expect(TokenType.IDENTIFIER).value;
      this.expect(TokenType.KEYWORD, "ON");

      const leftColumn = this.parseColumnRef();
      this.expect(TokenType.OPERATOR, "=");
      const rightColumn = this.parseColumnRef();

      join = {
        type: "INNER",
        table: joinTable,
        on: { leftColumn, rightColumn },
      };
    }

    // Parse WHERE
    if (this.match(TokenType.KEYWORD, "WHERE")) {
      where = this.parseWhere();
    }

    return { type: "SELECT", columns, from, where, join };
  }

  /**
   * parses 'UPDATE' statements
   * @returns An AST for updating data in a table
   */
  private parseUpdate(): UpdateAST {
    this.expect(TokenType.KEYWORD, "UPDATE");
    const tableName = this.expect(TokenType.IDENTIFIER).value;
    this.expect(TokenType.KEYWORD, "SET");

    const set: ColumnToUpdate[] = [];

    while (true) {
      const column = this.expect(TokenType.IDENTIFIER).value;
      this.expect(TokenType.OPERATOR, "=");
      const value = this.parseValue();
      set.push({ column, value });

      if (!this.match(TokenType.COMMA)) break;
      this.advance();
    }

    let where: WhereClause | undefined;
    if (this.match(TokenType.KEYWORD, "WHERE")) {
      where = this.parseWhere();
    }

    return { type: "UPDATE", tableName, set, where };
  }

  /**
   * parses 'DELETE' statements
   * @returns An AST for deleting data from a table
   */
  private parseDelete(): DeleteAST {
    this.expect(TokenType.KEYWORD, "DELETE");
    this.expect(TokenType.KEYWORD, "FROM");
    const from = this.expect(TokenType.IDENTIFIER).value;

    let where: WhereClause | undefined;
    if (this.match(TokenType.KEYWORD, "WHERE")) {
      where = this.parseWhere();
    }

    return { type: "DELETE", from, where };
  }

  /**
   * Parses 'WHERE' clauses
   * @returns An AST representing the 'WHERE' clause
   */
  private parseWhere(): WhereClause {
    this.expect(TokenType.KEYWORD, "WHERE");
    const column = this.expect(TokenType.IDENTIFIER).value;
    const operator = this.expect(TokenType.OPERATOR)
      .value as WhereClause["operator"];
    const value = this.parseValue();

    return { column, operator, value };
  }

  /**
   * Identifies a column reference in the tokens
   * @returns The column reference
   */
  private parseColumnRef(): string {
    const parts: string[] = [];
    parts.push(this.expect(TokenType.IDENTIFIER).value);

    if (this.match(TokenType.DOT)) {
      this.advance();
      parts.push(this.expect(TokenType.IDENTIFIER).value);
    }

    return parts.join(".");
  }

  /**
   * Identifies a value in the tokens
   * @returns The value
   */
  private parseValue(): any {
    const token = this.peek();
    if (!token) throw new Error("Expected value");

    if (token.type === TokenType.STRING) {
      this.advance();
      return token.value;
    }

    if (token.type === TokenType.NUMBER) {
      this.advance();
      return parseInt(token.value, 10);
    }

    if (token.type === TokenType.KEYWORD) {
      if (token.value === "TRUE") {
        this.advance();
        return true;
      }
      if (token.value === "FALSE") {
        this.advance();
        return false;
      }
    }

    throw new Error(`Unexpected token: ${token.value}`);
  }
}
