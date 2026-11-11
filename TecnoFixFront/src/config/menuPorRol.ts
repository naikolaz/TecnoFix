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
      description: 'Cree la cuenta de un nuevo técnico del servicio.',
      descripcion: 'Cree la cuenta de un nuevo técnico del servicio.',
      route: '/tecnicos/registrar',
      ruta: '/tecnicos/registrar',
      isAvailable: true,
      disponible: true,
    },
    {
      title: 'Registrar orden',
      titulo: 'Registrar orden',
      description: 'Ingrese un nuevo equipo al taller para reparación.',
      descripcion: 'Ingrese un nuevo equipo al taller para reparación.',
      route: '/ordenes/nueva',
      ruta: '/ordenes/nueva',
      isAvailable: true,
      disponible: true,
    },
    {
      title: 'Tipos de equipo',
      titulo: 'Tipos de equipo',
      description: 'Gestione el catálogo de tipos de equipo.',
      descripcion: 'Gestione el catálogo de tipos de equipo.',
      route: '/tipos-equipo',
      ruta: '/tipos-equipo',
      isAvailable: false,
      disponible: false,
    },
    {
      title: 'Estadísticas',
      titulo: 'Estadísticas',
      description: 'Consulte las estadísticas de las órdenes.',
      descripcion: 'Consulte las estadísticas de las órdenes.',
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
      description: 'Ingrese un nuevo equipo al taller para reparación.',
      descripcion: 'Ingrese un nuevo equipo al taller para reparación.',
      route: '/ordenes/nueva',
      ruta: '/ordenes/nueva',
      isAvailable: true,
      disponible: true,
    },
    {
      title: 'Órdenes de reparación',
      titulo: 'Órdenes de reparación',
      description: 'Diagnostique y actualice el estado de las órdenes existentes.',
      descripcion: 'Diagnostique y actualice el estado de las órdenes existentes.',
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
      description: 'Revise el estado y el presupuesto de sus equipos.',
      descripcion: 'Revise el estado y el presupuesto de sus equipos.',
      route: '/mis-ordenes',
      ruta: '/mis-ordenes',
      isAvailable: true,
      disponible: true,
    },
  ],
}

export const MENU_POR_ROL = MENU_BY_ROLE
