import { Link } from 'react-router-dom'
import { MENU_POR_ROL } from '../config/menuPorRol'
import { useAuth } from '../context/useAuth'

function InicioPage() {
  const { usuario } = useAuth()
  if (!usuario) return null

  const opciones = MENU_POR_ROL[usuario.rol]

  return (
    <section className="inicio">
      <h1>Hola, {usuario.nombreCompleto}</h1>
      <p className="texto-suave">
        Ingresaste como <strong>{usuario.rol}</strong>. Estas son las opciones disponibles para tu rol.
      </p>

      <div className="grilla-opciones">
        {opciones.map((opcion) =>
          opcion.disponible ? (
            <Link key={opcion.ruta} to={opcion.ruta} className="tarjeta-opcion">
              <h2>{opcion.titulo}</h2>
              <p>{opcion.descripcion}</p>
            </Link>
          ) : (
            <div
              key={opcion.ruta}
              className="tarjeta-opcion tarjeta-opcion--inactiva"
              title="Esta funcionalidad estará disponible en una próxima iteración"
            >
              <h2>{opcion.titulo}</h2>
              <p>{opcion.descripcion}</p>
              <span className="etiqueta-proximamente">Próximamente</span>
            </div>
          ),
        )}
      </div>
    </section>
  )
}

export default InicioPage
