import { Router } from "express";
import pool from "../db.js";

const router = Router();

// 📌 POST: agregar compañero
router.post("/", async (req, res) => {
  const { user_id, teammate_id } = req.body;

  if (!user_id || !teammate_id) {
    return res
      .status(400)
      .json({ error: "user_id y teammate_id son requeridos" });
  }

  try {
    // Validar que ambos existan en USERS
    const [users] = await pool.query("SELECT id FROM USERS WHERE id IN (?, ?)", [
      user_id,
      teammate_id,
    ]);

    if (users.length < 2) {
      return res
        .status(400)
        .json({ error: "Ambos usuarios deben existir para crear la relación" });
    }

    // Insertar relación
    const [result] = await pool.query(
      "INSERT INTO USERS_TEAMMATES (user_id, teammate_id) VALUES (?, ?)",
      [user_id, teammate_id]
    );

    res.json({ message: "Relación creada ✅", relationId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 GET: obtener todos los compañeros de un usuario
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.username, u.email 
       FROM USERS_TEAMMATES ut
       JOIN USERS u ON ut.teammate_id = u.id
       WHERE ut.user_id = ?`,
      [req.params.id]
    );
    if (rows.length <= 0) {
      return res.status(404).json({ message: "No hay compañeros" });
    }
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
