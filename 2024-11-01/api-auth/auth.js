import express from "express";
import { db } from "./db.js";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/login",
  body("username").isAlphanumeric().notEmpty().isLength({ max: 25 }),
  body("password").isStrongPassword({
    minLength: 8, // Minino de 8 caracteres (letras y numeros)
    minLowercase: 1, // Al menos una letra minuscula
    minUppercase: 1, // Al menos una letra mayusculas
    minNumbers: 1, // Al menos un numero
    minSymbols: 0, // Sin simbolos
  }),
  async (req, res) => {
    // Enviar errores de validacion en caso de ocurrir alguno.
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
      res.status(400).send({ errores: validacion.array() });
      return;
    }

    const { username, password } = req.body;

    // Obtener usuario
    const [usuarios] = await db.execute(
      "select * from usuarios where username=?",
      [username]
    );

    if (usuarios.length === 0) {
      res.status(400).send({ error: "Usuario o contraseña inválida" });
      return;
    }

    // Verificar contraseña
    const passwordComparada = await bcrypt.compare(
      password,
      usuarios[0].password
    );
    if (!passwordComparada) {
      res.status(400).send({ error: "Usuario o contraseña inválida" });
      return;
    }

    // Crear jwt
    const payload = { username, rol: "admin", dato: 123 };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    // Enviar jwt
    res.send({ token });
  }
);

export default router;
