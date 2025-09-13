import { Router } from "express";
import pool from "../db.js";

const router = Router();

//Create a new user
router.post("/", async (req, res) => {
  const { username, email, rol } = req.body;

  if (!username || !email || !rol) {
    return res.status(400).json({ error: "username, rol e email son requeridos" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO USERS (username, email, rol) VALUES (?, ?, ?)",
      [username, email, rol]
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
    if (rows.length <= 0) {
      return res.status(404).json({ message: "No hay usuarios" });
    }
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Get a user by email
router.get("/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM USERS WHERE email = ?", [
      email,
    ]);
    if (rows.length <= 0)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Update a user by id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { username, email, rol, status } = req.body;
  try {
    const [result] = await pool.query(
      "UPDATE USERS SET username = IFNULL(?, username), email = IFNULL(?, email), rol = IFNULL(?, rol), status = IFNULL(?, status) WHERE id = ?",
      [username, email, rol, status, id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Usuario no encontrado", id });
    const [rows] = await pool.query("SELECT * FROM USERS WHERE id = ?", [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;