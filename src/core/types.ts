export type TableRow = Record<string, any>;

export type WhereFn = (r: TableRow) => boolean;

export interface TableColumn {
  name: string;
  type: "INTEGER" | "TEXT" | "BOOLEAN";
}

export interface TableSchema {
  columns: Record<string, TableColumn>;
  primaryKey?: string;
}

export interface UpdateColumn {
  name: string;
  value: any;
}

export interface QueryResult {
  success: boolean;
  rows?: any[];
  rowsAffected?: number;
  message?: string;
}
