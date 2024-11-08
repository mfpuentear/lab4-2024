import express from "express";
import { db } from "./db.js";

const router = express.Router();

// SQL para crear la tabla
/*
CREATE TABLE `tareas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tarea` varchar(45) NOT NULL,
  `completada` tinyint NOT NULL,
  `persona_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tareas_personas_idx` (`persona_id`),
  CONSTRAINT `fk_tareas_personas` FOREIGN KEY (`persona_id`) REFERENCES `personas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
*/

// GET /tareas
router.get("/", async (req, res) => {
  const [tareas] = await db.execute("select * from tareas");
  res.send({ tareas });
});

// GET /tareas/:id
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

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

// GET /tareas/:id/persona
router.get("/:id/persona", async (req, res) => {
  const id = Number(req.params.id);

  // Ejecuto consulta con parametros
  const sql =
    "select p.id, p.nombre, p.apellido \
     from personas p \
     join tareas t on p.id = t.persona_id \
     where t.id=?";
  const [personas] = await db.execute(sql, [id]);

  res.send({ persona: personas[0] });
});

// POST /tareas (body: tarea, completada y personaId)
// PUT /tareas/:id/ (body: tarea y completada)
// DELETE /tareas/:id

export default router;
