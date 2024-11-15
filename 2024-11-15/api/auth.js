import express from "express";
import { db } from "./db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Strategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import { verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";

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
      next(null, payload);
    })
  );
}

export const validarJwt = passport.authenticate("jwt", {
  session: false,
});

export const validarRol = (rol) => (req, res, next) => {
  if (req.user.rol !== rol) {
    return res
      .status(400)
      .send({ mensaje: "No esta autorizado para realizar esta accion" });
  }
  next();
};

const validarLogin = [
  body("username").isAlphanumeric().notEmpty().isLength({ max: 25 }),
  body("password").isStrongPassword({
    minLength: 8, // Minino de 8 caracteres (letras y numeros)
    minLowercase: 1, // Al menos una letra minuscula
    minUppercase: 1, // Al menos una letra mayusculas
    minNumbers: 1, // Al menos un numero
    minSymbols: 0, // Sin simbolos
  }),
];

router.post("/login", validarLogin, verificarValidaciones, async (req, res) => {
  const { username, password } = req.body;

  // Obtener usuario
  const [usuarios] = await db.execute(
    "select * from usuarios where username=?",
    [username]
  );

  if (usuarios.length === 0) {
    return res.status(400).send({ error: "Usuario o contraseña inválida" });
  }

  // Verificar contraseña
  const passwordComparada = await bcrypt.compare(
    password,
    usuarios[0].password
  );
  if (!passwordComparada) {
    return res.status(400).send({ error: "Usuario o contraseña inválida" });
  }

  // Crear jwt
  const payload = { username: usuarios[0].username, rol: usuarios[0].rol };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });

  // Enviar jwt
  res.send({ username: usuarios[0].username, rol: usuarios[0].rol, token });
});

export default router;
