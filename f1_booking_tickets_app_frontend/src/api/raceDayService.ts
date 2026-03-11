import { api } from './client'
import type { RaceDay } from '#/model/types'

export type CreateRaceDayPayload = {
  raceId: number
  date: string
  name: string
  description: string
  dayPrice: number
  capacity: number
}

export type UpdateRaceDayPayload = {
  raceDayId: number
  date: string
  name: string
  description: string
  dayPrice: number
  capacity: number
}

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

  create: async (payload: CreateRaceDayPayload): Promise<RaceDay> => {
    return api.post<RaceDay>('/api/RaceDay', {
      raceId: payload.raceId,
      date: payload.date,
      name: payload.name,
      description: payload.description,
      dayPrice: payload.dayPrice,
      capacity: payload.capacity,
    })
  },

  update: async (payload: UpdateRaceDayPayload): Promise<RaceDay> => {
    return api.put<RaceDay>(`/api/RaceDay/${payload.raceDayId}`, {
      raceDayId: payload.raceDayId,
      date: payload.date,
      name: payload.name,
      description: payload.description,
      dayPrice: payload.dayPrice,
      capacity: payload.capacity,
    })
  },

  delete: async (raceDayId: number): Promise<void> => {
    await api.delete<void>(`/api/RaceDay/${raceDayId}`)
  },
}
