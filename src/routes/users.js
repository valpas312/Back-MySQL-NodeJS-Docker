import { Router } from "express";
import pool from "../db.js";

const router = Router();

//Create a new user
router.post("/", (req, res) => {
  const { name, email } = req.body;
  const sql = "INSERT INTO users (name, email) VALUES (?, ?)";
  pool.query(sql, [name, email], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Usuario Creado", id: result.insertId, name, email });
  });
});

//Get all users
router.get("/", (req, res) => {
  const sql = "SELECT * FROM users";
  pool.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
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