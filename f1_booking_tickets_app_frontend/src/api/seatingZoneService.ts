import { api } from './client'
import type { SeatingZone } from '#/model/types'

export type CreateSeatingZonePayload = {
  raceId: number
  name: string
  capacity: number
  priceMultiplier: number
}

export type UpdateSeatingZonePayload = {
  zoneId: number
  name: string
  capacity: number
  priceMultiplier: number
}

type SeatingZoneRaw = Partial<SeatingZone> & {
  zoneId?: number
  id?: number
}

export const seatingZoneService = {
  getByRaceId: async (raceId: number): Promise<SeatingZone[]> => {
    const data = await api.get<SeatingZoneRaw[]>(`/api/SeatingZone/race/${raceId}`)
    return data.map((z) => {
      const normalizedZoneId = Number(z.seatingZoneId ?? z.zoneId ?? z.id ?? 0)
      return {
        seatingZoneId: normalizedZoneId,
        raceId: Number(z.raceId ?? raceId),
        name: z.name ?? '',
        priceMultiplier: Number(z.priceMultiplier ?? 1),
        capacity: Number(z.capacity ?? 0),
      }
    })
  },

  getById: async (id: number): Promise<SeatingZone> => {
    return api.get<SeatingZone>(`/api/SeatingZone/${id}`)
  },

  create: async (payload: CreateSeatingZonePayload): Promise<SeatingZone> => {
    return api.post<SeatingZone>('/api/SeatingZone', {
      raceId: payload.raceId,
      name: payload.name,
      capacity: payload.capacity,
      priceMultiplier: payload.priceMultiplier,
    })
  },

  update: async (payload: UpdateSeatingZonePayload): Promise<SeatingZone> => {
    return api.put<SeatingZone>(`/api/SeatingZone/${payload.zoneId}`, {
      zoneId: payload.zoneId,
      name: payload.name,
      capacity: payload.capacity,
      priceMultiplier: payload.priceMultiplier,
    })
  },

  delete: async (zoneId: number): Promise<void> => {
    await api.delete<void>(`/api/SeatingZone/${zoneId}`)
  },
}
