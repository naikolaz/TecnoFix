import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { MENU_POR_ROL } from '../config/menuPorRol'
import { useAuth } from '../context/useAuth'
import Logo from './Logo'

function Layout() {
  const { usuario, cerrarSesion } = useAuth()
  const navegar = useNavigate()

  if (!usuario) return null

  const opciones = MENU_POR_ROL[usuario.rol].filter((opcion) => opcion.disponible)

  const salir = () => {
    cerrarSesion()
    navegar('/login', { replace: true })
  }

  return (
    <div className="layout">
      <header className="barra">
        <NavLink to="/inicio" className="barra__marca">
          <Logo tamano={34} claro />
        </NavLink>
        <nav className="barra__menu" aria-label="Menú principal">
          <NavLink to="/inicio" end>
            Inicio
          </NavLink>
          {opciones.map((opcion) => (
            <NavLink key={opcion.ruta} to={opcion.ruta}>
              {opcion.titulo}
            </NavLink>
          ))}
        </nav>
        <div className="barra__usuario">
          <span className="barra__nombre">{usuario.nombreCompleto}</span>
          <span className="insignia-rol">{usuario.rol}</span>
          <button type="button" className="boton boton--claro" onClick={salir} title="Cerrar la sesión actual">
            Cerrar sesión
          </button>
        </div>
      </header>
      <main className="contenido">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
