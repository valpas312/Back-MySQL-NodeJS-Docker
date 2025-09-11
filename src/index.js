import express from "express";
import pool from "./db.js";
import cors from "cors";

// Importar rutas
import usersRouter from "./routes/users.js";
import teammatesRouter from "./routes/teammates.js";

const app = express();

app.use(cors());
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

// CRUD operations for "teammates"
app.use("/teammates", teammatesRouter);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});