import { Table } from "./core/table";
import { TableSchema, UpdateColumn } from "./core/types";

const tableSchema: TableSchema = {
  columns: {
    id: { name: "id", type: "INTEGER" },
    title: { name: "title", type: "TEXT" },
    author: { name: "author", type: "TEXT" },
  },
  primaryKey: "id",
};

const table = new Table("books", tableSchema);

table.insert(
  ["id", "title", "author"],
  [
    [1, "Pride & Prejudice", "Jane Austen"],
    [2, "Harry Porter", "J.K. Rowling"],
    [3, "The Lord of the Rings", "J.R.R. Tolkien"],
    [4, "The Alchemist", "Paulo Coelho"],
    [5, "The Great Gatsby", "F. Scott Fitzgerald"],
    [6, "The Hobbit", "J.R.R. Tolkien"],
    [7, "The Da Vinci Code", "Dan Brown"],
    [8, "The Catcher in the Rye", "J.D. Salinger"],
    [9, "Gone with the Wind", "Margaret Mitchell"],
    [10, "Animal Farm", "George Orwell"],
  ]
);

console.log("Select *: \n", table.select(Object.keys(table.schema.columns)));

console.log(
  "Update title where author is J.R.R. Tolkien:",
  table.update(
    [{ name: "title", value: "Other title" }],
    (r) => r["author"] === "J.R.R. Tolkien"
  ),
  "rows affected"
);

console.log(
  "Select * where  where author is J.R.R. Tolkien: \n",
  table.select(
    Object.keys(table.schema.columns),
    (r) => r["author"] === "J.R.R. Tolkien"
  )
);

console.log("Select * \n", table.select(Object.keys(table.schema.columns)));

console.log(
  "Delete where id is 1: \n",
  table.delete((r) => r["id"] === 1),
  "rows affected"
);

console.log(
  "Select * where id is 1: \n",
  table.select(Object.keys(table.schema.columns), (r) => r["id"] === 1)
);

console.log("Select * \n", table.select(Object.keys(table.schema.columns)));

console.log("Delete all rows: \n", table.delete(), "rows affected");

console.log("Select * \n", table.select(Object.keys(table.schema.columns)));
