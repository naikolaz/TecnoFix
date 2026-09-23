import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import RutaProtegida from './components/RutaProtegida'
import EnConstruccionPage from './pages/EnConstruccionPage'
import InicioPage from './pages/InicioPage'
import LoginPage from './pages/LoginPage'
import RegistroCliente from './components/RegistroCliente';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* ¡Aquí integramos tu componente! */}
      <Route
        path="/registro"
        element={<RegistroCliente />}
      />

      <Route element={<RutaProtegida />}>
        <Route element={<Layout />}>
          <Route path="/inicio" element={<InicioPage />} />
          <Route
            path="/cambiar-contrasena"
            element={<EnConstruccionPage titulo="Cambiar contraseña" requerimiento="USU-004" />}
          />
        </Route>
      </Route>

      <Route element={<RutaProtegida rolesPermitidos={['Administrador']} />}>
        <Route element={<Layout />}>
          <Route
            path="/tecnicos/registrar"
            element={<EnConstruccionPage titulo="Registrar técnico" requerimiento="USU-003" />}
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/inicio" replace />} />
    </Routes>
  )
}

export default App