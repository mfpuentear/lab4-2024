import { Route, Routes } from "react-router-dom";
import { AboutPage } from "./AboutPage";
import { HomePage } from "./HomePage";
import { Layout } from "./Layout";
import { LoginPage } from "./LoginPage";
import { PerfilPage } from "./PerfilPage";
import { SinRuta } from "./SinRuta";
import { TareasPage } from "./TareasPage";
import { UsuariosPage } from "./UsuariosPage";
import { AuthPage } from "./Auth";

function App() {
  return (
    <>
      <h1>Aplicacion</h1>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <AuthPage>
                <HomePage />
              </AuthPage>
            }
          />
          <Route path="/acerca-de" element={<AboutPage />} />
          <Route
            path="/perfil"
            element={
              <AuthPage>
                <PerfilPage />
              </AuthPage>
            }
          />
          <Route
            path="/tareas"
            element={
              <AuthPage>
                <TareasPage />
              </AuthPage>
            }
          />
          <Route
            path="/usuarios"
            element={
              <AuthPage>
                <UsuariosPage />
              </AuthPage>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<SinRuta />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
