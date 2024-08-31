const express = require("express");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  console.log("GET en /");
  res.send("Hola mundo! con GET");
});

app.post("/", (req, res) => {
  console.log("POST en /");
  res.send("Hola mundo! con POST");
});

app.get("/chau", (req, res) => {
  console.log("GET en /chau");
  res.send("Chau mundo!");
});

app.listen(port, () => {
  console.log(`La aplicacion esta funcionando en: ${port}`);
});
