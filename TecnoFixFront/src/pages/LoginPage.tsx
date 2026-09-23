import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import CampoFormulario from '../components/CampoFormulario'
import Logo from '../components/Logo'
import MensajeError from '../components/MensajeError'
import { MENSAJES_LOGIN } from '../config/constantes'
import { useAuth } from '../context/useAuth'
import { iniciarSesion } from '../services/authService'
import { obtenerMensajeError } from '../utils/errores'
import { esEmailValido, estaVacio } from '../utils/validaciones'
import './LoginPage.css'

interface ErroresLogin {
  email?: string
  password?: string
  general?: string
}

const validarFormulario = (email: string, password: string): ErroresLogin => {
  const errores: ErroresLogin = {}

  if (estaVacio(email)) errores.email = MENSAJES_LOGIN.emailVacio
  else if (!esEmailValido(email)) errores.email = MENSAJES_LOGIN.emailInvalido

  if (estaVacio(password)) errores.password = MENSAJES_LOGIN.passwordVacia

  return errores
}

function LoginPage() {
  const { estaAutenticado, guardarSesion } = useAuth()
  const navegar = useNavigate()
  const ubicacion = useLocation()
  const destino = (ubicacion.state as { desde?: string } | null)?.desde ?? '/inicio'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [errores, setErrores] = useState<ErroresLogin>({})
  const [cargando, setCargando] = useState(false)

  if (estaAutenticado) return <Navigate to={destino} replace />

  const manejarEnvio = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()

    const erroresValidacion = validarFormulario(email, password)
    setErrores(erroresValidacion)
    if (Object.keys(erroresValidacion).length > 0) return

    setCargando(true)
    try {
      const respuesta = await iniciarSesion({ email, password })
      guardarSesion(respuesta)
      navegar(destino, { replace: true })
    } catch (error) {
      setErrores({ general: obtenerMensajeError(error) })
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="login">
      <section className="login__marca">
        <Logo tamano={56} claro />
        <h1>Servicio técnico de equipos electrónicos y computacionales</h1>
        <p>Revisa en línea el estado de tus reparaciones, desde la recepción hasta la entrega.</p>
      </section>

      <section className="login__panel">
        <form className="login__tarjeta" onSubmit={manejarEnvio} noValidate>
          <h2>Iniciar sesión</h2>
          <p className="login__subtitulo">Ingresa con tu correo electrónico y contraseña.</p>

          <CampoFormulario
            id="email"
            etiqueta="Correo electrónico"
            type="email"
            autoComplete="email"
            placeholder="usuario@correo.cl"
            ayuda="Usa el correo con el que te registraste en TecnoFix, por ejemplo usuario@correo.cl."
            value={email}
            error={errores.email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <CampoFormulario
            id="password"
            etiqueta="Contraseña"
            type={mostrarPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            ayuda="Si eres nuevo, usa la contraseña temporal que te llegó por correo al registrarte."
            value={password}
            error={errores.password}
            onChange={(e) => setPassword(e.target.value)}
            accion={
              <button
                type="button"
                className="campo__boton-ver"
                onClick={() => setMostrarPassword((valor) => !valor)}
                title={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {mostrarPassword ? 'Ocultar' : 'Ver'}
              </button>
            }
          />

          <MensajeError mensaje={errores.general} />

          <button type="submit" className="boton boton--primario boton--bloque" disabled={cargando}>
            {cargando ? 'Ingresando…' : 'Ingresar'}
          </button>

          <p className="login__registro">
            ¿Eres cliente nuevo? <Link to="/registro">Regístrate aquí</Link>
          </p>
        </form>
      </section>
    </div>
  )
}

export default LoginPage
