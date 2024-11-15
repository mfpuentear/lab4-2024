import express from "express";
import { db } from "./db.js";
import bcrypt from "bcrypt";
import { validarJwt, validarRol } from "./auth.js";
import { verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";

const router = express.Router();

// SQL para crear la tabla
/*
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(25) NOT NULL,
  `password` varchar(150) NOT NULL,
  `rol` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `password_UNIQUE` (`password`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
*/

// GET /usuarios
// Consultar por todos los usuarios
router.get("/", validarJwt, validarRol("admin"), async (req, res) => {
  const [usuarios] = await db.execute("select id, username, rol from usuarios");
  res.send({ usuarios });
});

const validarUsuario = [
  body("username").isAlphanumeric().notEmpty().isLength({ max: 25 }),
  body("password").isStrongPassword({
    minLength: 8, // Minino de 8 caracteres (letras y numeros)
    minLowercase: 1, // Al menos una letra minuscula
    minUppercase: 1, // Al menos una letra mayusculas
    minNumbers: 1, // Al menos un numero
    minSymbols: 0, // Sin simbolos
  }),
  body("rol").isAlpha().notEmpty().isLength({ max: 45 }),
];

// POST /usuarios
// Crear nuevo usuario
router.post(
  "/",
  validarJwt,
  validarRol("admin"),
  validarUsuario,
  verificarValidaciones,
  async (req, res) => {
    const { username, password, rol } = req.body;

    // Crear hash de la contraseña
    const passwordHashed = await bcrypt.hash(password, 10);

    // Inserta en DB
    const [result] = await db.execute(
      "insert into usuarios (username, password, rol) values (?,?,?)",
      [username, passwordHashed, rol]
    );
    res.status(201).send({ usuario: { id: result.insertId, username, rol } });
  }
);

export default router;
