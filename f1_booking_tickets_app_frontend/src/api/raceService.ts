import { api } from './client'
import type { Race, RaceDetails } from '#/model/types'

export const raceService = {
  getAll: async (): Promise<Race[]> => {
    return api.get<Race[]>('/api/Race')
  },

  getById: async (id: number): Promise<RaceDetails> => {
    return api.get<RaceDetails>(`/api/Race/${id}`)
  },
}
