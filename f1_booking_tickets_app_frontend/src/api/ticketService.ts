import { api } from './client'
import type {
  PurchaseTicketRequest,
  PurchaseTicketResponse,
  TicketDetails,
  ModifyTicketRequest,
  CancelTicketRequest,
} from '#/model/types'

export const ticketService = {
  purchase: async (data: PurchaseTicketRequest): Promise<PurchaseTicketResponse> => {
    return api.post<PurchaseTicketResponse>('/api/Ticket/purchase', data)
  },

  findByCodeAndEmail: async (ticketCode: string, email: string): Promise<TicketDetails> => {
    return api.get<TicketDetails>(
      `/api/Ticket?ticketCode=${encodeURIComponent(ticketCode)}&email=${encodeURIComponent(email)}`,
    )
  },

  addRaceDay: async (data: ModifyTicketRequest): Promise<TicketDetails> => {
    return api.post<TicketDetails>('/api/Ticket/add-day', data)
  },

  removeRaceDay: async (data: ModifyTicketRequest): Promise<TicketDetails> => {
    return api.post<TicketDetails>('/api/Ticket/remove-day', data)
  },

  cancel: async (data: CancelTicketRequest): Promise<void> => {
    return api.post<void>('/api/Ticket/cancel', data)
  },
}
