import { Router } from "express";
import pool from "../db.js";

const router = Router();

//Create a new user
router.post("/", async (req, res) => {
  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({ error: "username y email son requeridos" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO USERS (username, email) VALUES (?, ?)",
      [username, email]
    );

    res.json({
      message: "Usuario creado ✅",
      userId: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Get all users
router.get("/", async (req, res) => {
 try {
    const [rows] = await pool.query("SELECT * FROM USERS");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Get a user by ID
router.get("/:id", (req, res) => {
  const sql = "SELECT * FROM users WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(result[0]);
  });
});

//Update a user by ID
router.put("/:id", (req, res) => {
  const { name, email } = req.body;
  const sql = "UPDATE users SET name=?, email=?, WHERE id=?";
  db.query(sql, [name, email, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Usuario actualizado" });
  });
});

//Delete a user by ID
router.delete("/:id", (req, res) => {
  const sql = "DELETE FROM users WHERE id=?";
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Usuario eliminado" });
  });
});

export default router;
