import type { InputHTMLAttributes, ReactNode } from 'react'
import MensajeError from './MensajeError'
import Tooltip from './Tooltip'

interface CampoFormularioProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  etiqueta: string
  ayuda?: string
  error?: string
  accion?: ReactNode
}

function CampoFormulario({ id, etiqueta, ayuda, error, accion, ...propsInput }: CampoFormularioProps) {
  const idError = `${id}-error`

  return (
    <div className="campo">
      <div className="campo__encabezado">
        <label htmlFor={id}>{etiqueta}</label>
        {ayuda && <Tooltip texto={ayuda} />}
      </div>
      <div className={`campo__control ${error ? 'campo__control--error' : ''}`}>
        <input
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? idError : undefined}
          {...propsInput}
        />
        {accion}
      </div>
      <MensajeError mensaje={error} id={idError} />
    </div>
  )
}

export default CampoFormulario
