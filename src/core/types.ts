export type TableRow = Record<string, any>;

export type WhereFn = (r: TableRow) => boolean;

export interface TableColumn {
  name: string;
  dataType: "INTEGER" | "TEXT" | "BOOLEAN";
}

export interface TableSchema {
  columns: Record<string, TableColumn>;
  primaryKey?: string;
}

export interface ColumnToUpdate {
  column: string;
  value: any;
}

export interface QueryResult {
  success: boolean;
  rows?: any[];
  rowsAffected?: number;
  message?: string;
}
