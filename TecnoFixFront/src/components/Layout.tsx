import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { MENU_BY_ROLE } from '../config/menuPorRol';
import Logo from './Logo';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userRole = user?.role || 'Cliente';
  
  // Find menu options for user role
  const roleKey = (Object.keys(MENU_BY_ROLE).find(
    (key) => key.toLowerCase() === userRole.toLowerCase()
  ) || 'Cliente') as keyof typeof MENU_BY_ROLE;

  const menuOptions = MENU_BY_ROLE[roleKey] || [];
  const visibleOptions = menuOptions.filter((option) => option.isAvailable);

  return (
    <div className="layout">
      <header className="barra">
        <Link to="/inicio" className="barra__marca">
          <Logo />
        </Link>

        <nav className="barra__menu">
          {visibleOptions.map((option, index) => (
            <Link key={index} to={option.route}>
              {option.title}
            </Link>
          ))}
        </nav>

        <div className="barra__usuario">
          <span className="barra__nombre">{user?.fullName || user?.email}</span>
          <span className="insignia-rol">{userRole}</span>
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
