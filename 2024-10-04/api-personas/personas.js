import express from "express";
import { db } from "./db.js";

const router = express.Router();

// SQL para crear la tabla
/*
CREATE TABLE `personas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `altura` float NOT NULL,
  `peso` decimal(6,3) NOT NULL,
  `edad` int NOT NULL,
  `fechaNacimiento` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
*/

// middleware para verificar id
const validarId = (req, res, next) => {
  const id = Number(req.params.id);

  // Verificar que id sea un numero
  if (isNaN(id)) {
    return res.status(400).send({ mensaje: "id no es un numero" });
  }

  // Verificar que id sea un entero
  if (!Number.isInteger(id)) {
    return res.status(400).send({ mensaje: "id no es un numero entero" });
  }

  // Verificar que id sea un positivo
  if (id <= 0) {
    return res.status(400).send({ mensaje: "id no es un numero positivo" });
  }

  next();
};

// middleware para verificar datos de persona
const validarPersona = (req, res, next) => {
  // Validar nombre
  const nombre = req.body.nombre;

  // Validar que nombre este presente
  if (nombre == undefined) {
    return res.status(400).send({ mensaje: "El nombre es requerido" });
  }
  // Validar que nombre sea un string
  if (typeof nombre !== "string") {
    return res.status(400).send({ mensaje: "El nombre no es un texto" });
  }
  // Validar que nombre tenga entre 1 y 50 caracteres
  if (nombre.length < 1 || nombre.length > 50) {
    return res
      .status(400)
      .send({ mensaje: "El nombre tiene que tener entre 1 y 50 caracteres" });
  }

  // Validar apellido
  // Validar edad
  // Validar altura
  // Validar peso
  // Validar fecha de nacimiento

  next();
};

// GET /personas
// Consultar por todas las personas
router.get("/", async (req, res) => {
  const [personas] = await db.execute("select * from personas");
  res.send({ personas });
});

// GET /personas/:id
// Consultar por una persona
router.get("/:id", validarId, async (req, res) => {
  const id = Number(req.params.id);

  // Ejecuto consulta con parametros
  const sql = "select * from personas where id=?";
  const [personas] = await db.execute(sql, [id]);

  // Si no hay tareas enviar un 204 (sin contenido)
  if (personas.length === 0) {
    res.status(204).send();
  } else {
    res.send({ persona: personas[0] });
  }
});

// POST /personas/
// Crear nueva persona
router.post("/", validarPersona, async (req, res) => {
  /*
  const [result] = await db.execute(
    "insert into personas (descripcion, completada) values (?,?)",
    [descripcion, completada]
  );
  res
    .status(201)
    .send({ persona: { id: result.insertId, descripcion, completada } });
    */
  res.send("persona creada");
});

// PUT /personas/:id
// Modificar persona
router.put("/:id", validarId, async (req, res) => {
  const id = Number(req.params.id);
  const descripcion = req.body.descripcion;
  const completada = req.body.completada;

  await db.execute(
    "update personas set descripcion=?, completada=? where id=?",
    [descripcion, completada, id]
  );

  res.send({ persona: { id: parseInt(id), descripcion, completada } });
});

// DELETE /personas/:id
// Quitar tarea
router.delete("/:id", validarId, async (req, res) => {
  const id = Number(req.params.id);

  await db.execute("delete from personas where id=?", [id]);

  res.send({ id });
});

export default router;
