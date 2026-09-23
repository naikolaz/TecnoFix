interface MensajeErrorProps {
  mensaje?: string
  id?: string
}

function MensajeError({ mensaje, id }: MensajeErrorProps) {
  if (!mensaje) return null

  return (
    <p className="mensaje-error" id={id} role="alert">
      {mensaje}
    </p>
  )
}

export default MensajeError
