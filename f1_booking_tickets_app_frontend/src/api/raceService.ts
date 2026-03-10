import { ApiError, api } from './client'
import type { Race, RaceDetails } from '#/model/types'

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
}
