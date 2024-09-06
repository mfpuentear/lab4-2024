import express from "express";

export const sumasRouter = express.Router();

const sumas = [
  //  { id: 1, a: 2, b: 5, resultado: 7 },
  //  { id: 2, a: 6, b: 81, resultado: 87 },
  //  { id: 5, a: 12, b: 55, resultado: 87 },
];
let sumasMaxId = 0;

// GET /sumas
sumasRouter.get("/", (req, res) => {
  res.send({ data: sumas });
});

// GET /sumas/:id
sumasRouter.get("/:id", (req, res) => {
  // Obtendo id de la ruta
  const id = req.params.id;

  // Busco la suma con id de la ruta
  const suma = sumas.find((suma) => suma.id == id);

  // Devuelvo la suma encontrada
  res.send({ data: suma });
});

// POST /sumas
sumasRouter.post("/", (req, res) => {
  const { a, b } = req.body;
  const suma = { id: ++sumasMaxId, a, b, resultado: a + b, fecha: new Date() };
  sumas.push(suma);
  res.status(201).send({ data: suma });
});
