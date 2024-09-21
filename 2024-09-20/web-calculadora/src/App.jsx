import { useEffect, useState } from "react";

function App() {
  const [sumas, setSumas] = useState([]);
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [sumaId, setSumaId] = useState(0);

  const getSumas = async () => {
    const response = await fetch("http://localhost:3000/sumas");
    if (response.ok) {
      const { sumas } = await response.json();
      setSumas(sumas);
    }
  };

  // Obtenemos listado de sumas cuando se carga por primera vez el componente
  useEffect(() => {
    getSumas();
  }, []);

  // Se agrega una nueva suma
  const handleSubmit = async (e) => {
    e.preventDefault();
    // POST localhost:3000/sumas (body: a, b)
    const response = await fetch("http://localhost:3000/sumas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ a, b }),
    });
    if (response.ok) {
      // Pedir todas las sumas a la api
      // getSumas();

      // Agregar la suma creada devuelta por la api
      const { suma } = await response.json();
      setSumas([...sumas, suma]);
      setA(0);
      setB(0);
    }
  };

  const modificarSuma = (suma) => {
    setSumaId(suma.id);
    setA(suma.a);
    setB(suma.b);
  };

  const modificarSumaApi = async () => {
    const response = await fetch(`http://localhost:3000/sumas/${sumaId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ a, b }),
    });
    if (response.ok) {
      // Pedir todas las sumas a la api
      // getSumas();

      // Modificar la suma devuelta por la api
      const { suma } = await response.json();
      setSumas(sumas.map((s) => (s.id == suma.id ? suma : s)));

      setA(0);
      setB(0);
      setSumaId(0);
    }
  };

  const quitarSuma = async (id) => {
    if (confirm("¿Desea quitar suma?")) {
      const response = await fetch(`http://localhost:3000/sumas/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Pedir todas las sumas a la api
        // getSumas();

        // Quitamos la suma de sumas
        setSumas(sumas.filter((suma) => suma.id !== id));
      }
    }
  };

  return (
    <>
      <h1>Sumas</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="a">a</label>
          <input
            type="number"
            id="a"
            value={a}
            onChange={(e) => setA(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="b">b</label>
          <input
            type="number"
            id="b"
            value={b}
            onChange={(e) => setB(parseFloat(e.target.value))}
          />
        </div>
        {sumaId === 0 && <button type="submit">Agregar</button>}
      </form>
      {sumaId !== 0 && (
        <>
          <button onClick={() => modificarSumaApi()}>Modificar</button>
          <button
            onClick={() => {
              setSumaId(0);
              setA(0);
              setB(0);
            }}
          >
            Cancelar
          </button>
        </>
      )}
      <ul>
        {sumas.map((suma) => (
          <li key={suma.id}>
            {`${suma.id}: ${suma.a} + ${suma.b} = ${suma.resultado} `}
            <button onClick={() => modificarSuma(suma)} disabled={sumaId !== 0}>
              E
            </button>
            <button onClick={() => quitarSuma(suma.id)} disabled={sumaId !== 0}>
              X
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
