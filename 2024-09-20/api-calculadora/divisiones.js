import express from "express";

export const divisionesRouter = express.Router();

const divisiones = [
  //  { id: 1, a: 2, b: 2, resultado: 1 },
  //  { id: 2, a: 4, b: 3, resultado: 0.75 },
];
let divisionesMaxId = 0;

// GET /divisiones
divisionesRouter.get("/", (req, res) => {
  res.send({ data: divisiones });
});

// GET /divisiones/:id
divisionesRouter.get("/:id", (req, res) => {
  // Obtendo id de la ruta
  const id = req.params.id;

  // Busco la suma con id de la ruta
  const division = divisiones.find((division) => division.id == id);

  // Devuelvo la suma encontrada
  res.send({ data: division });
});

// POST /divisiones
divisionesRouter.post("/", (req, res) => {
  // Obtengo a y b
  const { a, b } = req.body;

  // Verifico que b sea distinto de 0
  if (b === 0) {
    res.status(400).send({ mensaje: "Division por cero" });
    return;
  }

  // Creo objeto division y lo agrego al arreglo y al cliente
  const division = {
    id: ++divisionesMaxId,
    a,
    b,
    resultado: a / b,
    fecha: new Date(),
  };
  divisiones.push(division);
  res.status(201).send({ data: division });
});
