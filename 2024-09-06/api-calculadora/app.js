import express from "express";
import sumasRouter from "./sumas.js";
import { divisionesRouter } from "./divisiones.js";

const app = express();
const port = 3000;

// interpretar JSON en body
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hola mundo!");
});

app.use("/sumas", sumasRouter);
app.use("/divisiones", divisionesRouter);

app.listen(port, () => {
  console.log(`La aplicacion esta funcionando en: ${port}`);
});
