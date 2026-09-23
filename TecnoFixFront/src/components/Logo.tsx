interface LogoProps {
  tamano?: number
  claro?: boolean
}

function Logo({ tamano = 40, claro = false }: LogoProps) {
  return (
    <span className={`logo ${claro ? 'logo--claro' : ''}`}>
      <svg width={tamano} height={tamano} viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" className="logo__fondo" />
        <path
          d="M19.2 8.9a.9.9 0 0 0 0 1.3l1.6 1.6a.9.9 0 0 0 1.3 0l3.1-3.1a5.4 5.4 0 0 1-7.1 7.1l-6.2 6.2a1.9 1.9 0 0 1-2.7-2.7l6.2-6.2a5.4 5.4 0 0 1 7.1-7.1z"
          fill="none"
          className="logo__icono"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="logo__texto">
        Tecno<strong>Fix</strong>
      </span>
    </span>
  )
}

export default Logo
