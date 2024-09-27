import express from "express";
import cors from "cors";
import tareasRouter from "./tareas.js";
import { conectarDB } from "./db.js";

// Conectar a DB
conectarDB();
console.log("Conectado a base de datos");

const app = express();
const port = 3000;

// interpretar JSON en body
app.use(express.json());

// Habilito cors
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hola mundo!");
});

app.use("/tareas", tareasRouter);

app.listen(port, () => {
  console.log(`La aplicacion esta funcionando en: ${port}`);
});
