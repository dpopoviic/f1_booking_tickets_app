import { ApiError, api } from './client'
import type { Race, RaceDetails } from '#/model/types'

export type CreateRacePayload = {
  name: string
  location: string
  basePrice: number
  discountDeadline?: string | null
}

export type UpdateRacePayload = CreateRacePayload & {
  raceId: number
}

export const raceService = {
  getAll: async (): Promise<Race[]> => {
    return api.get<Race[]>('/api/Race')
  },

  getById: async (id: number): Promise<RaceDetails> => {
    return api.get<RaceDetails>(`/api/Race/${id}`)
  },

  getNextUpcoming: async (): Promise<RaceDetails | null> => {
    try {
      return await api.get<RaceDetails>('/api/Race/next-upcoming')
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null
      }

      throw error
    }
  },

  create: async (payload: CreateRacePayload): Promise<RaceDetails> => {
    return api.post<RaceDetails>('/api/Race', {
      name: payload.name,
      location: payload.location,
      basePrice: payload.basePrice,
      discountDeadline: payload.discountDeadline || null,
    })
  },

  update: async (payload: UpdateRacePayload): Promise<RaceDetails> => {
    return api.put<RaceDetails>(`/api/Race/${payload.raceId}`, {
      raceId: payload.raceId,
      name: payload.name,
      location: payload.location,
      basePrice: payload.basePrice,
      discountDeadline: payload.discountDeadline || null,
    })
  },

  delete: async (id: number): Promise<void> => {
    await api.delete<void>(`/api/Race/${id}`)
  },
}
