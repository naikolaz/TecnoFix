import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { MENU_POR_ROL } from '../config/menuPorRol';

export default function InicioPage() {
  const { usuario } = useAuth();

  const obtenerNombreRol = () => {
    if (usuario?.rol) return usuario.rol;
    const roleId = (usuario as any)?.idRole || usuario?.id;
    if (roleId === 1) return 'Administrador';
    if (roleId === 2) return 'Técnico';
    return 'Cliente';
  };

  const nombreRol = obtenerNombreRol() as keyof typeof MENU_POR_ROL;
  const opciones = MENU_POR_ROL[nombreRol] || [];

  return (
    <div className="inicio">
      <h1>Bienvenido, {usuario?.email}</h1>
      <p className="texto-suave">
        Rol asignado: <span className="insignia-rol">{nombreRol}</span>
      </p>

      <div className="grilla-opciones">
        {opciones.map((opcion, index) =>
          opcion.disponible ? (
            <Link key={index} to={opcion.ruta} className="tarjeta-opcion">
              <h2>{opcion.titulo}</h2>
              <p>{opcion.descripcion}</p>
            </Link>
          ) : (
            <div key={index} className="tarjeta-opcion tarjeta-opcion--inactiva">
              <h2>{opcion.titulo}</h2>
              <p>{opcion.descripcion}</p>
              <span className="etiqueta-proximamente">Próximamente</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}