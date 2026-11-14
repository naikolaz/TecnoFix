export interface OrderHistoryEntry {
  id: number
  action: string
  date: string
  newStatus: string | null
  userId: number | null
  userName: string | null
  userRole: string | null
}

export type OrderLogDto = OrderHistoryEntry
