import { AuthRol } from "./Auth";

export const PerfilPage = () => {
  return (
    <>
      <p>Mi perfil</p>
      <AuthRol rol="admin">
        <p>Soy admin!</p>
      </AuthRol>
      <AuthRol rol="user">
        <p>Soy usuario!</p>
      </AuthRol>
    </>
  );
};
