import { api } from './client'
import type { RaceDay } from '#/model/types'

type RaceDayRaw = Partial<RaceDay> & {
  id?: number
}

export const raceDayService = {
  getByRaceId: async (raceId: number): Promise<RaceDay[]> => {
    const data = await api.get<RaceDayRaw[]>(`/api/RaceDay/race/${raceId}`)
    return data.map((d) => ({
      raceDayId: Number(d.raceDayId ?? d.id ?? 0),
      raceId: Number(d.raceId ?? raceId),
      date: d.date ?? '',
      name: d.name ?? '',
      description: d.description ?? '',
      dayPrice: Number(d.dayPrice ?? 0),
      capacity: Number(d.capacity ?? 0),
    }))
  },

  getById: async (id: number): Promise<RaceDay> => {
    return api.get<RaceDay>(`/api/RaceDay/${id}`)
  },
}
