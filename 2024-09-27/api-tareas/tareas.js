import express from "express";
import { db } from "./db.js";

const router = express.Router();

// SQL para crear la tabla
/*
CREATE TABLE `tareas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(50) NOT NULL,
  `completada` tinyint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `descripcion_UNIQUE` (`descripcion`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
*/

// GET /tareas
// Consultar por todas las tareas
router.get("/", async (req, res) => {
  const [tareas] = await db.execute("select * from tareas");
  res.send({ tareas });
});

// GET /tareas/:id
// Consultar por una tarea
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  // Ejecuto consulta con parametros
  const sql = "select * from tareas where id=?";
  const [tareas] = await db.execute(sql, [id]);

  // Si no hay tareas enviar un 204 (sin contenido)
  if (tareas.length === 0) {
    res.status(204).send();
  } else {
    res.send({ tarea: tareas[0] });
  }
});

// POST /tareas/
// Crear nueva tarea
router.post("/", async (req, res) => {
  const descripcion = req.body.descripcion;
  const completada = req.body.completada;

  const [result] = await db.execute(
    "insert into tareas (descripcion, completada) values (?,?)",
    [descripcion, completada]
  );
  res
    .status(201)
    .send({ tarea: { id: result.insertId, descripcion, completada } });
});

// PUT /tareas/:id
// Modificar tarea
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const descripcion = req.body.descripcion;
  const completada = req.body.completada;

  await db.execute("update tareas set descripcion=?, completada=? where id=?", [
    descripcion,
    completada,
    id,
  ]);

  res.send({ tarea: { id: parseInt(id), descripcion, completada } });
});

// DELETE /tareas/:id
// Quitar tarea
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  await db.execute("delete from tareas where id=?", [id]);

  res.send({ id: parseInt(id) });
});

export default router;
