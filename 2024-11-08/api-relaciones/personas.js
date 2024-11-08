import express from "express";
import { db } from "./db.js";

const router = express.Router();

// SQL para crear la tabla
/*
CREATE TABLE `personas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `apellido` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
*/

// GET /personas
router.get("/", async (req, res) => {
  const [personas] = await db.execute("select * from personas");
  res.send({ personas });
});

// GET /personas/:id
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  // Ejecuto consulta con parametros
  const sql = "select * from personas where id=?";
  const [personas] = await db.execute(sql, [id]);

  // Si no hay personas enviar un 204 (sin contenido)
  if (personas.length === 0) {
    res.status(204).send();
  } else {
    res.send({ persona: personas[0] });
  }
});

// GET /personas/:id/tareas
router.get("/:id/tareas", async (req, res) => {
  const id = Number(req.params.id);

  // Ejecuto consulta con parametros
  const sql = "select id, tarea, completada from tareas where persona_id=?";
  const [tareas] = await db.execute(sql, [id]);

  // Si no hay tareas enviar un 204 (sin contenido)
  res.send({ tareas });
});

// GET /personas/:id/materias
router.get("/:id/materias", async (req, res) => {
  const id = Number(req.params.id);

  // Ejecuto consulta con parametros
  const sql =
    "select m.id, m.nombre \
     from materias m \
     join personas_materias pm on m.id = pm.materia_id \
     where pm.persona_id=?";
  const [materias] = await db.execute(sql, [id]);

  res.send({ materias });
});

// POST /personas/:id/tareas (body: tarea y completada)

// POST /personas/:id/materias (body: materiaId)

export default router;
