import { useEffect, useState } from "react";
import { useAuth } from "./Auth";

export const ListadoUsuarios = () => {
  const { sesion } = useAuth();
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/usuarios/", {
      headers: { Authorization: `Bearer ${sesion.token}` },
    })
      .then((response) => response.json())
      .then(({ usuarios }) => setUsuarios(usuarios));
  }, [sesion.token]);

  return (
    <>
      <h3>Listado</h3>
      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario.id}>
            {usuario.username} {usuario.rol}
          </li>
        ))}
      </ul>
    </>
  );
};
