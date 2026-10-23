import type { Rol } from '../interfaces/auth'

export interface OpcionMenu {
  titulo: string
  descripcion: string
  ruta: string
  disponible: boolean
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
      titulo: 'Registrar orden',
      descripcion: 'Ingresa un nuevo equipo al taller para reparación.',
      ruta: '/ordenes/nueva',
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
  ],
  Técnico: [
    {
      titulo: 'Registrar orden',
      descripcion: 'Ingresa un nuevo equipo al taller para reparación.',
      ruta: '/ordenes/nueva',
      disponible: true,
    },
    {
      titulo: 'Órdenes de reparación',
      descripcion: 'Diagnostica y actualiza el estado de las órdenes existentes.',
      ruta: '/ordenes',
      disponible: false,
    },
  ],
  Cliente: [
    {
      titulo: 'Mis órdenes',
      descripcion: 'Revisa el estado y el presupuesto de tus equipos.',
      ruta: '/mis-ordenes',
      disponible: false,
    },
  ],
}