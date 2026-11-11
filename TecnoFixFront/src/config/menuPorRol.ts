import type { Role } from '../interfaces/auth'

export interface MenuItem {
  title: string
  titulo: string
  description: string
  descripcion: string
  route: string
  ruta: string
  isAvailable: boolean
  disponible: boolean
}

export type OpcionMenu = MenuItem

export const MENU_BY_ROLE: Record<Role, MenuItem[]> = {
  Administrador: [
    {
      title: 'Registrar técnico',
      titulo: 'Registrar técnico',
      description: 'Crea la cuenta de un nuevo técnico del servicio.',
      descripcion: 'Crea la cuenta de un nuevo técnico del servicio.',
      route: '/tecnicos/registrar',
      ruta: '/tecnicos/registrar',
      isAvailable: true,
      disponible: true,
    },
    {
      title: 'Registrar orden',
      titulo: 'Registrar orden',
      description: 'Ingresa un nuevo equipo al taller para reparación.',
      descripcion: 'Ingresa un nuevo equipo al taller para reparación.',
      route: '/ordenes/nueva',
      ruta: '/ordenes/nueva',
      isAvailable: true,
      disponible: true,
    },
    {
      title: 'Tipos de equipo',
      titulo: 'Tipos de equipo',
      description: 'Gestiona el catálogo de tipos de equipo.',
      descripcion: 'Gestiona el catálogo de tipos de equipo.',
      route: '/tipos-equipo',
      ruta: '/tipos-equipo',
      isAvailable: false,
      disponible: false,
    },
    {
      title: 'Estadísticas',
      titulo: 'Estadísticas',
      description: 'Consulta las estadísticas de las órdenes.',
      descripcion: 'Consulta las estadísticas de las órdenes.',
      route: '/estadisticas',
      ruta: '/estadisticas',
      isAvailable: false,
      disponible: false,
    },
  ],
  Técnico: [
    {
      title: 'Registrar orden',
      titulo: 'Registrar orden',
      description: 'Ingresa un nuevo equipo al taller para reparación.',
      descripcion: 'Ingresa un nuevo equipo al taller para reparación.',
      route: '/ordenes/nueva',
      ruta: '/ordenes/nueva',
      isAvailable: true,
      disponible: true,
    },
    {
      title: 'Órdenes de reparación',
      titulo: 'Órdenes de reparación',
      description: 'Diagnostica y actualiza el estado de las órdenes existentes.',
      descripcion: 'Diagnostica y actualiza el estado de las órdenes existentes.',
      route: '/ordenes/diagnostico',
      ruta: '/ordenes/diagnostico',
      isAvailable: true,
      disponible: true,
    },
  ],
  Cliente: [
    {
      title: 'Mis órdenes',
      titulo: 'Mis órdenes',
      description: 'Revisa el estado y el presupuesto de tus equipos.',
      descripcion: 'Revisa el estado y el presupuesto de tus equipos.',
      route: '/mis-ordenes',
      ruta: '/mis-ordenes',
      isAvailable: false,
      disponible: false,
    },
  ],
}

export const MENU_POR_ROL = MENU_BY_ROLE
