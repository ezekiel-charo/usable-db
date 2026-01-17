export enum TokenType {
  KEYWORD = "KEYWORD",
  IDENTIFIER = "IDENTIFIER",
  NUMBER = "NUMBER",
  STRING = "STRING",
  OPERATOR = "OPERATOR",
  COMMA = "COMMA",
  LPAREN = "LPAREN",
  RPAREN = "RPAREN",
  SEMICOLON = "SEMICOLON",
  ASTERISK = "ASTERISK",
  DOT = "DOT",
}

export interface Token {
  type: TokenType;
  value: string;
}

const KEYWORDS = new Set([
  "SELECT",
  "FROM",
  "WHERE",
  "INSERT",
  "INTO",
  "VALUES",
  "UPDATE",
  "SET",
  "DELETE",
  "CREATE",
  "TABLE",
  "PRIMARY",
  "KEY",
  "INTEGER",
  "TEXT",
  "BOOLEAN",
  "AND",
  "OR",
  "INNER",
  "JOIN",
  "ON",
]);

const OPERATORS = new Set(["=", "!=", ">", "<", ">=", "<="]);

/**
 * Converts a SQL statement into an array of tokens
 * @param sql The SQL statement to be tokenized
 * @returns An array of tokens
 */
export function tokenize(sql: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < sql.length) {
    const char = sql[i]!;

    // Skip whitespace
    if (/\s/.test(char)) {
      i++;
      continue;
    }

    // String literals (single or double quotes)
    if (char === "'" || char === '"') {
      const quote = char;
      let value = "";
      i++; // Skip opening quote

      while (i < sql.length && sql[i] !== quote) {
        value += sql[i];
        i++;
      }
      i++; // Skip closing quote

      tokens.push({ type: TokenType.STRING, value });
      continue;
    }

    // Numbers
    if (/\d/.test(char)) {
      let value = "";
      while (i < sql.length && /\d/.test(sql[i]!)) {
        value += sql[i];
        i++;
      }
      tokens.push({ type: TokenType.NUMBER, value });
      continue;
    }

    // Operators (check two-char first)
    if (i + 1 < sql.length) {
      const twoChar = sql[i]! + sql[i + 1];
      if (OPERATORS.has(twoChar)) {
        tokens.push({ type: TokenType.OPERATOR, value: twoChar });
        i += 2;
        continue;
      }
    }

    if (OPERATORS.has(char)) {
      tokens.push({ type: TokenType.OPERATOR, value: char });
      i++;
      continue;
    }

    // Special characters
    if (char === ",") {
      tokens.push({ type: TokenType.COMMA, value: char });
      i++;
      continue;
    }

    if (char === "(") {
      tokens.push({ type: TokenType.LPAREN, value: char });
      i++;
      continue;
    }

    if (char === ")") {
      tokens.push({ type: TokenType.RPAREN, value: char });
      i++;
      continue;
    }

    if (char === ";") {
      tokens.push({ type: TokenType.SEMICOLON, value: char });
      i++;
      continue;
    }

    if (char === "*") {
      tokens.push({ type: TokenType.ASTERISK, value: char });
      i++;
      continue;
    }

    if (char === ".") {
      tokens.push({ type: TokenType.DOT, value: char });
      i++;
      continue;
    }

    // Identifiers and keywords
    if (/[a-zA-Z_]/.test(char)) {
      let value = "";
      while (i < sql.length && /[a-zA-Z0-9_]/.test(sql[i]!)) {
        value += sql[i];
        i++;
      }

      const upper = value.toUpperCase();
      if (KEYWORDS.has(upper)) {
        tokens.push({ type: TokenType.KEYWORD, value: upper });
      } else {
        tokens.push({ type: TokenType.IDENTIFIER, value });
      }
      continue;
    }

    throw new Error(`Unexpected character: ${char}`);
  }

  return tokens;
}
