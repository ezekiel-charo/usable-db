import { executeQuery } from "../query/query";
import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

app.post("/api/query", (req, res) => {
  const result = executeQuery(req.body.sql);
  res.json(result);
});

// Start the server and listen for incoming requests
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
