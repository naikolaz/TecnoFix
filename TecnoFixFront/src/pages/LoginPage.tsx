import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import CampoFormulario from '../components/CampoFormulario'
import Logo from '../components/Logo'
import MensajeError from '../components/MensajeError'
import { LOGIN_MESSAGES } from '../config/constantes'
import { useAuth } from '../context/useAuth'
import { login } from '../services/authService'
import { getErrorMessage } from '../utils/errores'
import { isValidEmail, isEmpty } from '../utils/validaciones'
import './LoginPage.css'

interface LoginFormErrors {
  email?: string
  password?: string
  general?: string
}

const validateLoginForm = (email: string, password: string): LoginFormErrors => {
  const errors: LoginFormErrors = {}

  if (isEmpty(email)) errors.email = LOGIN_MESSAGES.emptyEmail
  else if (!isValidEmail(email)) errors.email = LOGIN_MESSAGES.invalidEmail

  if (isEmpty(password)) errors.password = LOGIN_MESSAGES.emptyPassword

  return errors
}

function LoginPage() {
  const { isAuthenticated, saveSession } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const destination = (location.state as { desde?: string } | null)?.desde ?? '/inicio'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<LoginFormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  if (isAuthenticated) return <Navigate to={destination} replace />

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationErrors = validateLoginForm(email, password)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setIsLoading(true)
    try {
      const response = await login({ email, password })
      saveSession(response)
      navigate(destination, { replace: true })
    } catch (error) {
      setErrors({ general: getErrorMessage(error) })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login">
      <section className="login__marca">
        <Logo tamano={56} claro />
        <h1>Servicio técnico de equipos electrónicos y computacionales</h1>
        <p>Revise en línea el estado de sus reparaciones, desde la recepción hasta la entrega.</p>
      </section>

      <section className="login__panel">
        <form className="login__tarjeta" onSubmit={handleSubmit} noValidate>
          <h2>Iniciar sesión</h2>
          <p className="login__subtitulo">Ingrese con su correo electrónico y contraseña.</p>

          <CampoFormulario
            id="email"
            etiqueta="Correo electrónico"
            type="email"
            autoComplete="email"
            placeholder="usuario@correo.cl"
            ayuda="Use el correo con el que se registró en TecnoFix, por ejemplo usuario@correo.cl."
            value={email}
            error={errors.email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <CampoFormulario
            id="password"
            etiqueta="Contraseña"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            ayuda="Si es nuevo, use la contraseña temporal que recibió por correo al registrarse."
            value={password}
            error={errors.password}
            onChange={(e) => setPassword(e.target.value)}
            accion={
              <button
                type="button"
                className="campo__boton-ver"
                onClick={() => setShowPassword((prev) => !prev)}
                title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? 'Ocultar' : 'Ver'}
              </button>
            }
          />

          <MensajeError mensaje={errors.general} />

          <button type="submit" className="boton boton--primario boton--bloque" disabled={isLoading}>
            {isLoading ? 'Ingresando…' : 'Ingresar'}
          </button>

          <p className="login__registro">
            ¿Es cliente nuevo? <Link to="/registro">Regístrese aquí</Link>
          </p>
        </form>
      </section>
    </div>
  )
}

export default LoginPage
