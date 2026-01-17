import { Table } from "./table";
import { TableSchema } from "./types";

export class Database {
  private tables: Record<string, Table> = {};

  constructor(public readonly name: string) {}

  getTable(tableName: string): Table {
    if (this.tables[tableName]) {
      return this.tables[tableName];
    }

    throw new Error(`Relation "${tableName}" does not exist`);
  }

  createTable(tableName: string, schema: TableSchema): void {
    const table = new Table(tableName, schema);
    this.tables[tableName] = table;
  }

  dropTable(tableName: string): void {
    if (this.getTable(tableName)) {
      delete this.tables[tableName];
    }
  }
}
