import { tokenize } from "./query/tokenizer";

const q =
  "SELECT authors.name, books.title FROM authors JOIN books ON authors.id = books.author_id;";

console.log(tokenize(q));
