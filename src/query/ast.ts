export type ASTNode =
  | CreateTableAST
  | InsertAST
  | SelectAST
  | UpdateAST
  | DeleteAST;

export interface CreateTableAST {
  type: "CREATE_TABLE";
  tableName: string;
  columns: {
    name: string;
    dataType: "INTEGER" | "TEXT" | "BOOLEAN";
    isPrimaryKey?: boolean;
  }[];
}

export interface InsertAST {
  type: "INSERT";
  tableName: string;
  columns: string[];
  values: any[][];
}

export interface SelectAST {
  type: "SELECT";
  columns: string[]; // ['*'] or ['name', 'age']
  from: string;
  where?: WhereClause;
  join?: JoinClause;
}

export interface UpdateAST {
  type: "UPDATE";
  tableName: string;
  set: { column: string; value: any }[];
  where?: WhereClause;
}

export interface DeleteAST {
  type: "DELETE";
  from: string;
  where?: WhereClause;
}

export interface WhereClause {
  column: string;
  operator: "=" | "!=" | ">" | "<" | ">=" | "<=";
  value: any;
}

export interface JoinClause {
  type: "INNER";
  table: string;
  on: {
    leftColumn: string;
    rightColumn: string;
  };
}
