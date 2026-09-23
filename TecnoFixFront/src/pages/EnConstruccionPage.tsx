import { Link } from 'react-router-dom'
import Logo from '../components/Logo'

interface EnConstruccionPageProps {
  titulo: string
  requerimiento: string
  publica?: boolean
}

function EnConstruccionPage({ titulo, requerimiento, publica = false }: EnConstruccionPageProps) {
  return (
    <section className={`en-construccion ${publica ? 'en-construccion--publica' : ''}`}>
      {publica && <Logo />}
      <h1>{titulo}</h1>
      <p className="texto-suave">Vista pendiente de integración ({requerimiento}).</p>
      <Link to={publica ? '/login' : '/inicio'} className="boton boton--primario">
        Volver
      </Link>
    </section>
  )
}

export default EnConstruccionPage
