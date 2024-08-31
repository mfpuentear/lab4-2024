import express from "express";

const app = express();
const port = 3000;

// interpretar JSON en body
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hola mundo!");
});

const nombres = ["pepe", "pedro", "maria", "cacho"];

// Obtener todos los elementos del arreglo nombres
// GET /nombres
app.get("/nombres", (req, res) => {
  res.send({ data: nombres });
});

// Obtener un elemento del arreglo por indice
// GET /nombres/:indice
// "indice" es un parametro de ruta y se accede desde req.params.indice
app.get("/nombres/:indice", (req, res) => {
  const indice = parseInt(req.params.indice);
  res.send({ data: nombres[indice] });
});

// Crear un nuevo elemento al arreglo
// POST /nombres
app.post("/nombres", (req, res) => {
  const nombre = req.body.nombre;
  nombres.push(nombre);
  res.send({ data: nombre });
});

app.listen(port, () => {
  console.log(`La aplicacion esta funcionando en: ${port}`);
});
