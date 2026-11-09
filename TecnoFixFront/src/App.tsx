import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import RutaProtegida from './components/RutaProtegida'
import InicioPage from './pages/InicioPage'
import LoginPage from './pages/LoginPage'
import RegistroCliente from './components/RegistroCliente';
import RegistrarTecnicoPage from './pages/RegistrarTecnicoPage';
import { RegistrarOrdenPage } from './pages/RegistrarOrderPage';

function App() {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegistroCliente />} />

      {/* Rutas Autenticadas (Cualquier usuario logueado) */}
      <Route element={<RutaProtegida />}>
        <Route element={<Layout />}>
          <Route path="/inicio" element={<InicioPage />} />
        </Route>
      </Route>

      {/* Rutas para Administrador y Técnico (Registro de Órdenes) */}
      <Route element={<RutaProtegida rolesPermitidos={['Administrador', 'Técnico']} />}>
        <Route element={<Layout />}>
          <Route path="/ordenes/nueva" element={<RegistrarOrdenPage />} />
        </Route>
      </Route>

      {/* Rutas Exclusivas de Administrador */}
      <Route element={<RutaProtegida rolesPermitidos={['Administrador']} />}>
        <Route element={<Layout />}>
          <Route path="/tecnicos/registrar" element={<RegistrarTecnicoPage />} />
        </Route>
      </Route>

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/inicio" replace />} />
    </Routes>
  )
}

export default App