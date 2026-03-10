import { portalApi } from './client'

export type TicketsByRaceDayReport = {
  id: number
  raceDayId: number
  raceDayName: string
  raceDayDate: string
  ticketCount: number
}

export type TicketsByPurchaseDateReport = {
  id: number
  purchaseDate: string
  ticketCount: number
}

export const reportsService = {
  getByRaceDay: async (): Promise<TicketsByRaceDayReport[]> => {
    return portalApi.get<TicketsByRaceDayReport[]>('/api/Reports/by-race-day')
  },

  getByPurchaseDate: async (): Promise<TicketsByPurchaseDateReport[]> => {
    return portalApi.get<TicketsByPurchaseDateReport[]>('/api/Reports/by-purchase-date')
  },
}
