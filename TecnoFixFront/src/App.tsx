import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import RutaProtegida from './components/RutaProtegida'
import InicioPage from './pages/InicioPage'
import LoginPage from './pages/LoginPage'
import RegistroCliente from './components/RegistroCliente';
import RegistrarTecnicoPage from './pages/RegistrarTecnicoPage';
import MyOrdersPage from './pages/MyOrdersPage'
import { RegistrarOrdenPage } from './pages/RegistrarOrderPage';
import { DiagnosticoOrderPage } from './pages/DiagnosticoOrderPage';

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
          <Route path="/ordenes/diagnostico" element={<DiagnosticoOrderPage />} />
        </Route>
      </Route>

      {/* Rutas Exclusivas de Administrador */}
      <Route element={<RutaProtegida rolesPermitidos={['Administrador']} />}>
        <Route element={<Layout />}>
          <Route path="/tecnicos/registrar" element={<RegistrarTecnicoPage />} />
        </Route>
      </Route>

      {/* Rutas Exclusivas de Cliente */}
      <Route element={<RutaProtegida rolesPermitidos={['Cliente']} />}>
        <Route element={<Layout />}>
          <Route path="/mis-ordenes" element={<MyOrdersPage />} />
        </Route>
      </Route>

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/inicio" replace />} />
    </Routes>
  )
}

export default App