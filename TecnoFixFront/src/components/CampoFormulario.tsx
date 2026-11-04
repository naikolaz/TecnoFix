import type { InputHTMLAttributes, ReactNode } from 'react'
import MensajeError from './MensajeError'
import Tooltip from './Tooltip'

export interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label?: string
  etiqueta?: string
  helpText?: string
  ayuda?: string
  error?: string
  action?: ReactNode
  accion?: ReactNode
}

function FormField({ id, label, etiqueta, helpText, ayuda, error, action, accion, ...inputProps }: FormFieldProps) {
  const errorId = `${id}-error`
  const displayLabel = label ?? etiqueta ?? ''
  const displayHelp = helpText ?? ayuda
  const displayAction = action ?? accion

  return (
    <div className="campo">
      <div className="campo__encabezado">
        <label htmlFor={id}>{displayLabel}</label>
        {displayHelp && <Tooltip texto={displayHelp} />}
      </div>
      <div className={`campo__control ${error ? 'campo__control--error' : ''}`}>
        <input
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          {...inputProps}
        />
        {displayAction}
      </div>
      <MensajeError mensaje={error} id={errorId} />
    </div>
  )
}

export default FormField
