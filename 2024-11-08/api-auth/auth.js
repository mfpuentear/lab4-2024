import express from "express";
import { db } from "./db.js";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Strategy, ExtractJwt } from "passport-jwt";
import passport from "passport";

const router = express.Router();

export function authConfig() {
  // Opciones de configuracion de passport-jwt
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  // Creo estrategia jwt
  passport.use(
    new Strategy(jwtOptions, async (payload, next) => {
      // Si llegamos a este punto es porque el token es valido
      console.log("en strategy", payload);

      /* Con base de datos */
      /*
      // Obtengo informacion extra de la DB (opcional)
      const [usuarios] = await db.execute(
        "SELECT username FROM usuarios WHERE username = ?",
        [payload.username]
      );

      // Si hay al menos un usuario reenviarlo
      if (usuarios.length > 0) {
        next(null, usuarios[0]);
      } else {
        next(null, false);
      }
      */

      /* Sin base de datos */
      next(null, payload);
    })
  );
}

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
    const payload = { username, rol: "user", dato: 123 };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    // Enviar jwt
    res.send({ token });
  }
);

export default router;
