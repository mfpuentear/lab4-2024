import { useEffect, useState } from "react";
import { useAuth } from "./Auth";
import { ListadoTareas, NuevaTarea } from "./Tareas";

export const TareasPage = () => {
  const { sesion } = useAuth();
  const [tareas, setTareas] = useState([]);

  const getTareas = async () => {
    const response = await fetch("http://localhost:3000/tareas/", {
      headers: { Authorization: `Bearer ${sesion.token}` },
    });
    if (response.ok) {
      const { tareas } = await response.json();
      setTareas(tareas);
    }
  };

  useEffect(() => {
    getTareas();
  }, []);

  return (
    <>
      <h2>Tareas</h2>
      <ListadoTareas tareas={tareas} />
      <NuevaTarea onNuevaTarea={getTareas} />
    </>
  );
};
