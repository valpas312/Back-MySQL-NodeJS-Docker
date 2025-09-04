import express from "express";
import usersRouter from "./routes/users.js";
import pool from "./db.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/ping", async (req, res) => {
  const result = await pool.query("SELECT CURDATE() as date");
  res.json(result[0]);
});

// CRUD operations for "users"
app.use("/users", usersRouter);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});