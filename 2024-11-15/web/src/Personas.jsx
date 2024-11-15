import { useEffect, useState } from "react";
import { useAuth } from "./Auth";

export const Persona = ({ personaId }) => {
  const { sesion } = useAuth();
  const [persona, setPersona] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/personas/${personaId}`, {
      headers: { Authorization: `Bearer ${sesion.token}` },
    })
      .then((response) => response.json())
      .then(({ persona }) => setPersona(persona));
  }, [personaId, sesion.token]);

  if (persona == null) {
    return null;
  }

  return (
    <span>
      {persona.apellido}, {persona.nombre}
    </span>
  );
};

export const SeleccionarPersona = ({ personaId, onChange }) => {
  const { sesion } = useAuth();
  const [personas, setPersonas] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/personas/", {
      headers: { Authorization: `Bearer ${sesion.token}` },
    })
      .then((response) => response.json())
      .then(({ personas }) => setPersonas(personas));
  }, [sesion.token]);

  const handleChange = (event) => {
    onChange(parseInt(event.target.value));
  };

  return (
    <>
      <label htmlFor="personas">Persona:</label>
      <select id="personas" value={personaId} onChange={handleChange}>
        <option value="0">Seleccionar...</option>
        {personas.map((persona) => (
          <option key={persona.id} value={persona.id}>
            {persona.apellido}, {persona.nombre}
          </option>
        ))}
      </select>
    </>
  );
};
