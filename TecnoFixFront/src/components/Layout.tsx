import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { MENU_POR_ROL } from '../config/menuPorRol';
import Logo from './Logo';

export default function Layout() {
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    cerrarSesion();
    navigate('/login');
  };

  const rolUsuario = usuario?.rol || 'Cliente';
  
  // Buscar las opciones asociadas al rol de forma flexible
  const claveRol = (Object.keys(MENU_POR_ROL).find(
    (key) => key.toLowerCase() === rolUsuario.toLowerCase()
  ) || 'Cliente') as keyof typeof MENU_POR_ROL;

  const menuOpciones = MENU_POR_ROL[claveRol] || [];
  const opcionesVisibles = menuOpciones.filter((opcion) => opcion.disponible);

  return (
    <div className="layout">
      <header className="barra">
        <Link to="/inicio" className="barra__marca">
          <Logo />
        </Link>

        <nav className="barra__menu">
          {opcionesVisibles.map((opcion, index) => (
            <Link key={index} to={opcion.ruta}>
              {opcion.titulo}
            </Link>
          ))}
        </nav>

        <div className="barra__usuario">
          <span className="barra__nombre">{usuario?.email}</span>
          <span className="insignia-rol">{rolUsuario}</span>
          <button type="button" onClick={handleLogout} className="boton boton--claro">
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="contenido">
        <Outlet />
      </main>
    </div>
  );
}