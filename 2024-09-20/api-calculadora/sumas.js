import express from "express";

const router = express.Router();

let sumas = [
  { id: 1, a: 2, b: 5, resultado: 7 },
  { id: 2, a: 6, b: 81, resultado: 87 },
  { id: 5, a: 12, b: 55, resultado: 87 },
];
let sumasMaxId = 0;

// GET /sumas
router.get("/", (req, res) => {
  res.send({ sumas });
});

// GET /sumas/:id
router.get("/:id", (req, res) => {
  // Obtendo id de la ruta
  const id = req.params.id;

  // Busco la suma con id de la ruta
  const suma = sumas.find((suma) => suma.id == id);

  // Devuelvo la suma encontrada
  res.send({ suma });
});

// POST /sumas
router.post("/", (req, res) => {
  const { a, b } = req.body;
  const suma = { id: ++sumasMaxId, a, b, resultado: a + b, fecha: new Date() };
  sumas.push(suma);
  res.status(201).send({ suma });
});

// PUT /sumas/:id
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { a, b } = req.body;
  // Con find
  /*
  const suma = sumas.find((suma) => suma.id === id);
  suma.a = a;
  suma.b = b;
  suma.resultado = a + b;
  suma.fecha = new Date();
  */
  const sumaModificada = { id, a, b, resultado: a + b, fecha: new Date() };
  // con forEach
  /*
  sumas.forEach((suma, index) => {
    if (suma.id === id) {
      sumas[index] = sumaModificada;
    }
  });
  */
  // con map
  sumas = sumas.map((suma) => (suma.id === id ? sumaModificada : suma));
  res.status(200).send({ suma: sumaModificada });
});

// DELETE /sumas/:id
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  sumas = sumas.filter((suma) => suma.id !== id);
  res.status(200).send({ id });
});

export default router;
