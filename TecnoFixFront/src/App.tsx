import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import RutaProtegida from './components/RutaProtegida'
import InicioPage from './pages/InicioPage'
import LoginPage from './pages/LoginPage'
import RegistroCliente from './components/RegistroCliente';
import RegistrarTecnicoPage from './pages/RegistrarTecnicoPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route
        path="/registro"
        element={<RegistroCliente />}
      />
      

      <Route element={<RutaProtegida />}>
        <Route element={<Layout />}>
          <Route path="/inicio" element={<InicioPage />} />
        </Route>
      </Route>

      {/* Ruta protegida que verifica que el rol sea Administrador */}
      <Route element={<RutaProtegida rolesPermitidos={['Administrador']} />}>
        <Route element={<Layout />}>
          {/* 2. Reemplazamos la página en construcción por tu formulario real */}
          <Route
            path="/tecnicos/registrar"
            element={<RegistrarTecnicoPage />}
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/inicio" replace />} />
    </Routes>
  )
}

export default App