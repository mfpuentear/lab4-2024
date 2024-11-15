import { AuthRol } from "./Auth";
import { ListadoUsuarios } from "./Usuarios";

export const UsuariosPage = () => {
  return (
    <>
      <h2>Usuarios</h2>
      <AuthRol rol="user">
        <p>No tiene permitido ver este listado</p>
      </AuthRol>
      <AuthRol rol="admin">
        <ListadoUsuarios />
      </AuthRol>
    </>
  );
};
