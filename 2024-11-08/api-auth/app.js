import express from "express";
import cors from "cors";
import { conectarDB } from "./db.js";
import usuariosRouter from "./usuarios.js";
import authRouter, { authConfig } from "./auth.js";
import personasRouter from "./personas.js";

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

app.use("/usuarios", usuariosRouter);
app.use("/auth", authRouter);
app.use("/personas", personasRouter);

app.listen(port, () => {
  console.log(`La aplicacion esta funcionando en: ${port}`);
});
