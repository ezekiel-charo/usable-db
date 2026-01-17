import * as readline from "readline/promises";
import { executeQuery } from "../query/query";
import { formatTable } from "./utils";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export function repl() {
  rl.question("db> ").then((q) => {
    if (q == "exit") {
      rl.close();
      return;
    }

    const queryResult = executeQuery(q);

    console.log(queryResult.message);

    if (queryResult.success && queryResult.rows) {
      if (queryResult.rows) {
        console.log(formatTable(queryResult.rows));
      }
    }

    repl();
  });
}

repl();
