import { useId, type ReactNode } from 'react'

interface TooltipProps {
  texto: string
  children?: ReactNode
}

function Tooltip({ texto, children }: TooltipProps) {
  const id = useId()

  return (
    <span className="tooltip">
      <span className="tooltip__disparador" tabIndex={0} aria-describedby={id}>
        {children ?? '?'}
      </span>
      <span role="tooltip" id={id} className="tooltip__texto">
        {texto}
      </span>
    </span>
  )
}

export default Tooltip
