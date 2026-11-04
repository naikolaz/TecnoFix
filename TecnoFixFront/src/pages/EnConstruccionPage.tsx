import { Link } from 'react-router-dom'
import Logo from '../components/Logo'

interface UnderConstructionPageProps {
  title?: string
  titulo?: string
  requirement?: string
  requerimiento?: string
  isPublic?: boolean
  publica?: boolean
}

function EnConstruccionPage({ 
  title, 
  titulo = 'En construcción', 
  requirement, 
  requerimiento = '', 
  isPublic, 
  publica = false 
}: UnderConstructionPageProps) {
  const displayTitle = title ?? titulo
  const displayRequirement = requirement ?? requerimiento
  const showPublic = isPublic ?? publica

  return (
    <section className={`en-construccion ${showPublic ? 'en-construccion--publica' : ''}`}>
      {showPublic && <Logo />}
      <h1>{displayTitle}</h1>
      <p className="texto-suave">Vista pendiente de integración ({displayRequirement}).</p>
      <Link to={showPublic ? '/login' : '/inicio'} className="boton boton--primario">
        Volver
      </Link>
    </section>
  )
}

export default EnConstruccionPage
