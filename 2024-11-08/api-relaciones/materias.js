import express from "express";
import { db } from "./db.js";

const router = express.Router();

// SQL para crear la tabla
/*
CREATE TABLE `materias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `personas_materias` (
  `persona_id` int NOT NULL,
  `materia_id` int NOT NULL,
  PRIMARY KEY (`persona_id`,`materia_id`),
  KEY `fk_personas_materias_materias_idx` (`materia_id`),
  CONSTRAINT `fk_personas_materias_materias` FOREIGN KEY (`materia_id`) REFERENCES `materias` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_personas_materias_personas` FOREIGN KEY (`persona_id`) REFERENCES `personas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
*/

// GET /materas
router.get("/", async (req, res) => {
  const [materias] = await db.execute("select * from materias");
  res.send({ materias });
});

// GET /materias/:id
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  // Ejecuto consulta con parametros
  const sql = "select * from materias where id=?";
  const [materias] = await db.execute(sql, [id]);

  // Si no hay materias enviar un 204 (sin contenido)
  if (materias.length === 0) {
    res.status(204).send();
  } else {
    res.send({ materia: materias[0] });
  }
});

// GET /materias/:id/personas
router.get("/:id/personas", async (req, res) => {
  const id = Number(req.params.id);

  // Ejecuto consulta con parametros
  const sql =
    "select p.id, p.nombre, p.apellido \
     from personas p \
     join personas_materias pm on p.id = pm.persona_id \
     where pm.materia_id=?";
  const [personas] = await db.execute(sql, [id]);

  res.send({ personas });
});

// POST /materias/:id/personas (body: personaId)

export default router;
