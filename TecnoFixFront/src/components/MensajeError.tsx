export interface ErrorMessageProps {
  message?: string
  mensaje?: string
  id?: string
}

function ErrorMessage({ message, mensaje, id }: ErrorMessageProps) {
  const displayMessage = message ?? mensaje
  if (!displayMessage) return null

  return (
    <p className="mensaje-error" id={id} role="alert">
      {displayMessage}
    </p>
  )
}

export default ErrorMessage
