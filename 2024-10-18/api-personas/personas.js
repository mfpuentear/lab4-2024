import express from "express";
import { db } from "./db.js";
import { body, param, query, validationResult } from "express-validator";

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

// middleware para verificar parametros de consultas empleando express-validator
const validarConsulta = () => [
  query("edad_gt").isInt({ min: 0 }).optional(),
  query("edad_lt").isInt({ min: 0 }).optional(),
  query("altura_gt").isFloat({ min: 0 }).optional(),
  query("altura_lt").isFloat({ min: 0 }).optional(),
];

// middleware para verificar id empleando express-validator
const validarId = () => param("id").isInt({ min: 1 });

// middleware para verificar datos de persona empleando express-validator
const validarPersona = () => [
  body("nombre").isAlpha().notEmpty().isLength({ max: 50 }),
  body("apellido").isAlpha().notEmpty().isLength({ max: 50 }),
  body("edad").isInt({ min: 1 }),
  body("altura").isFloat({ min: 1 }),
  body("peso").isDecimal(),
  body("fechaNacimiento").isISO8601(),
];

// GET /personas
// Consultar por todas las personas
router.get("/", validarConsulta(), async (req, res) => {
  // Enviar errores de validacion en caso de ocurrir alguno.
  const validacion = validationResult(req);
  if (!validacion.isEmpty()) {
    res.status(400).send({ errores: validacion.array() });
    return;
  }

  const filtros = [];
  const parametros = [];

  // edad_gt: edades mayores a
  const edad_gt = req.query.edad_gt;
  if (edad_gt != undefined) {
    filtros.push("edad > ?");
    parametros.push(edad_gt);
  }

  // edad_lt: edades menores a
  const edad_lt = req.query.edad_lt;
  if (edad_lt != undefined) {
    filtros.push("edad < ?");
    parametros.push(edad_lt);
  }

  // altura_gt: altura mayores a
  const altura_gt = req.query.altura_gt;
  if (altura_gt != undefined) {
    filtros.push("altura > ?");
    parametros.push(altura_gt);
  }

  // altura_lt: altura menores a
  const altura_lt = req.query.altura_lt;
  if (altura_lt != undefined) {
    filtros.push("altura < ?");
    parametros.push(altura_lt);
  }

  let sql = "select * from personas";

  if (filtros.length > 0) {
    sql += ` where ${filtros.join(" and ")}`;
  }

  const order_by = req.query.order_by;
  if (order_by == "apellido") {
    sql += " order by apellido";
  }

  console.log(sql);

  const [personas] = await db.execute(sql, parametros);
  res.send({ personas });
});

// GET /personas/:id
// Consultar por una persona
router.get("/:id", validarId(), async (req, res) => {
  // Enviar errores de validacion en caso de ocurrir alguno.
  const validacion = validationResult(req);
  if (!validacion.isEmpty()) {
    res.status(400).send({ errores: validacion.array() });
    return;
  }

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
router.post("/", validarPersona(), async (req, res) => {
  // Enviar errores de validacion en caso de ocurrir alguno.
  const validacion = validationResult(req);
  if (!validacion.isEmpty()) {
    res.status(400).send({ errores: validacion.array() });
    return;
  }
  const { nombre, apellido, altura, peso, edad, fechaNacimiento } = req.body;

  const [result] = await db.execute(
    "insert into personas (nombre, apellido, altura, peso, edad, fechaNacimiento) values (?,?,?,?,?,?)",
    [nombre, apellido, altura, peso, edad, fechaNacimiento]
  );
  res.status(201).send({
    persona: {
      id: result.insertId,
      nombre,
      apellido,
      altura,
      peso,
      edad,
      fechaNacimiento,
    },
  });
});

// PUT /personas/:id
// Modificar persona
router.put("/:id", validarId(), validarPersona(), async (req, res) => {
  // Enviar errores de validacion en caso de ocurrir alguno.
  const validacion = validationResult(req);
  if (!validacion.isEmpty()) {
    res.status(400).send({ errores: validacion.array() });
    return;
  }

  const id = Number(req.params.id);
  const { nombre, apellido, altura, peso, edad, fechaNacimiento } = req.body;

  await db.execute(
    "update personas set nombre=?, apellido=?, altura=?, peso=?, edad=?, fechaNacimiento=? where id=?",
    [nombre, apellido, altura, peso, edad, fechaNacimiento, id]
  );

  res.send("persona modificada");
});

// DELETE /personas/:id
// Quitar tarea
router.delete("/:id", validarId(), async (req, res) => {
  // Enviar errores de validacion en caso de ocurrir alguno.
  const validacion = validationResult(req);
  if (!validacion.isEmpty()) {
    res.status(400).send({ errores: validacion.array() });
    return;
  }

  const id = Number(req.params.id);

  await db.execute("delete from personas where id=?", [id]);

  res.send({ id });
});

export default router;
