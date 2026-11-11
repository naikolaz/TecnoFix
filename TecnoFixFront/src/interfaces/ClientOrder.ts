export interface Budget {
  diagnosis: string
  laborCost: number
  partsCost: number
  totalCost: number
}

export interface ClientOrder {
  id: number
  deviceType: string
  brandAndModel: string
  serialNumber: string | null
  issueDescription: string
  accessories: string | null
  status: string
  createdAt: string
  canDecideBudget: boolean
  budget: Budget | null
}
