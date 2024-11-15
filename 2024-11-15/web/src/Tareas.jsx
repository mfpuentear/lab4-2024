import { useState } from "react";
import { useAuth } from "./Auth";
import { Persona, SeleccionarPersona } from "./Personas";

export const ListadoTareas = ({ tareas }) => {
  return (
    <>
      <h3>Listado</h3>
      <ul>
        {tareas.map((tarea) => (
          <li key={tarea.id}>
            {tarea.tarea} {tarea.completada ? "✔️" : "❌"}. Realizada por:{" "}
            <Persona personaId={tarea.persona_id} />
          </li>
        ))}
      </ul>
    </>
  );
};

export const NuevaTarea = ({ onNuevaTarea }) => {
  const { sesion } = useAuth();
  const [tarea, setTarea] = useState("");
  const [completada, setCompletada] = useState(false);
  const [personaId, setPersonaId] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/tareas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sesion.token}`,
      },
      body: JSON.stringify({ tarea, completada, personaId }),
    });
    if (response.ok) {
      setTarea("");
      setCompletada(false);
      setPersonaId(0);
      onNuevaTarea();
    }
  };

  return (
    <>
      <h3>Nueva tarea</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="tarea">Tarea:</label>
          <input
            id="tarea"
            value={tarea}
            onChange={(e) => setTarea(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="completada">Completada:</label>
          <input
            type="checkbox"
            id="completada"
            checked={completada}
            onChange={() => setCompletada(!completada)}
          />
        </div>
        <SeleccionarPersona personaId={personaId} onChange={setPersonaId} />
        <p>id selecionado: {personaId}</p>
        <button type="submit">Crear</button>
      </form>
    </>
  );
};
