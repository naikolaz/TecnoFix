import type { Rol } from '../interfaces/auth'

export interface OpcionMenu {
  titulo: string
  descripcion: string
  ruta: string
  disponible: boolean
}

const cambiarContrasena: OpcionMenu = {
  titulo: 'Cambiar contraseña',
  descripcion: 'Actualiza tu contraseña de acceso.',
  ruta: '/cambiar-contrasena',
  disponible: true,
}

export const MENU_POR_ROL: Record<Rol, OpcionMenu[]> = {
  Administrador: [
    {
      titulo: 'Registrar técnico',
      descripcion: 'Crea la cuenta de un nuevo técnico del servicio.',
      ruta: '/tecnicos/registrar',
      disponible: true,
    },
    {
      titulo: 'Tipos de equipo',
      descripcion: 'Gestiona el catálogo de tipos de equipo.',
      ruta: '/tipos-equipo',
      disponible: false,
    },
    {
      titulo: 'Estadísticas',
      descripcion: 'Consulta las estadísticas de las órdenes.',
      ruta: '/estadisticas',
      disponible: false,
    },
    cambiarContrasena,
  ],
  Técnico: [
    {
      titulo: 'Órdenes de reparación',
      descripcion: 'Registra órdenes, diagnostica y actualiza su estado.',
      ruta: '/ordenes',
      disponible: false,
    },
    cambiarContrasena,
  ],
  Cliente: [
    {
      titulo: 'Mis órdenes',
      descripcion: 'Revisa el estado y el presupuesto de tus equipos.',
      ruta: '/mis-ordenes',
      disponible: false,
    },
    cambiarContrasena,
  ],
}
