import express from "express";
import cors from "cors";
import { conectarDB } from "./db.js";
import authRouter, { authConfig } from "./auth.js";
import usuariosRouter from "./usuarios.js";
import personasRouter from "./personas.js";
import tareasRouter from "./tareas.js";
import materiasRouter from "./materias.js";

// Conectar a DB
conectarDB();
console.log("Conectado a base de datos");

const app = express();
const port = 3000;

// interpretar JSON en body
app.use(express.json());

// Habilito cors
app.use(cors());

// Configuro passport
authConfig();

app.get("/", (_, res) => {
  res.send("Hola mundo!");
});

app.use("/auth", authRouter);
app.use("/usuarios", usuariosRouter);
app.use("/personas", personasRouter);
app.use("/tareas", tareasRouter);
app.use("/materias", materiasRouter);

app.listen(port, () => {
  console.log(`La aplicacion esta funcionando en: ${port}`);
});
