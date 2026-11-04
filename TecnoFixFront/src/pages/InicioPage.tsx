import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { MENU_BY_ROLE } from '../config/menuPorRol';

export default function InicioPage() {
  const { user } = useAuth();

  const getRoleName = () => {
    if (user?.role) return user.role;
    const roleId = (user as any)?.idRole;
    if (roleId === 1) return 'Administrador';
    if (roleId === 2) return 'Cliente';
    if (roleId === 3) return 'Técnico';
    return 'Cliente';
  };

  const roleName = getRoleName() as keyof typeof MENU_BY_ROLE;
  const options = MENU_BY_ROLE[roleName] || [];

  return (
    <div className="inicio">
      <h1>Bienvenido, {user?.fullName || user?.email}</h1>
      <p className="texto-suave">
        Rol asignado: <span className="insignia-rol">{roleName}</span>
      </p>

      <div className="grilla-opciones">
        {options.map((option, index) =>
          option.isAvailable ? (
            <Link key={index} to={option.route} className="tarjeta-opcion">
              <h2>{option.title}</h2>
              <p>{option.description}</p>
            </Link>
          ) : (
            <div key={index} className="tarjeta-opcion tarjeta-opcion--inactiva">
              <h2>{option.title}</h2>
              <p>{option.description}</p>
              <span className="etiqueta-proximamente">Próximamente</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
