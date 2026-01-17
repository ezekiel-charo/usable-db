import { Database } from "../core/database";
import {
  QueryResult,
  TableColumn,
  TableRow,
  TableSchema,
  WhereFn,
} from "../core/types";
import { AST, WhereClause } from "./ast";
import { Parser } from "./parser";
import { tokenize } from "./tokenizer";

const database = new Database("books");

function parseQuery(sql: string): AST {
  const tokens = tokenize(sql);
  const parser = new Parser(tokens);
  return parser.parse();
}

function generateWhereFn(whereClause?: WhereClause): WhereFn {
  return (row: TableRow) => {
    if (!whereClause) {
      return true;
    }

    switch (whereClause.operator) {
      case "=":
        return row[whereClause.column] === whereClause.value;
      case "!=":
        return row[whereClause.column] !== whereClause.value;
      case "<":
        return row[whereClause.column] < whereClause.value;
      case ">":
        return row[whereClause.column] > whereClause.value;
      case "<=":
        return row[whereClause.column] <= whereClause.value;
      case ">=":
        return row[whereClause.column] >= whereClause.value;
      default:
        return true;
    }
  };
}

export function executeQuery(sql: string): QueryResult | undefined {
  let ast;

  try {
    ast = parseQuery(sql);
  } catch (e) {
    return {
      success: false,
      message: `ERROR: invalid or unsupported syntax`,
    };
  }

  try {
    switch (ast.type) {
      case "CREATE_TABLE":
        const columns: Record<string, TableColumn> = {};
        let primaryKey;

        // Create columns and set primary key column name
        ast.columns.forEach((column) => {
          const { name, dataType } = column;
          columns[column.name] = { name, dataType };

          if (column.isPrimaryKey) {
            primaryKey = column.name;
          }
        });

        const tableSchema: TableSchema = { columns, primaryKey };
        database.createTable(ast.tableName, tableSchema);
        return { success: true, message: "RESULT OK" };

      case "INSERT":
        const tableToInsertInto = database.getTable(ast.tableName);
        tableToInsertInto.insert(ast.columns, ast.values);
        return { success: true, message: "RESULT OK" };

      case "UPDATE":
        const tableToUpdate = database.getTable(ast.tableName);
        const rowsUpdated = tableToUpdate.update(
          ast.set,
          generateWhereFn(ast.where)
        );
        return {
          success: true,
          message: `RESULT OK: ${rowsUpdated} rows updated`,
        };

      case "DELETE":
        const tableToDeleteFrom = database.getTable(ast.from);
        const rowsDeleted = tableToDeleteFrom.delete(
          generateWhereFn(ast.where)
        );
        return {
          success: true,
          message: `RESULT OK: ${rowsDeleted} rows deleted`,
        };

      case "SELECT":
        const tableToSelectFrom = database.getTable(ast.from);
        const resultRows = tableToSelectFrom.select(
          ast.columns,
          generateWhereFn(ast.where)
        );
        return {
          success: true,
          message: `RESULT OK`,
          rows: resultRows,
        };
    }
  } catch (e) {
    return {
      success: false,
      message: `ERROR: ${(e as Error).message}`,
    };
  }
}
