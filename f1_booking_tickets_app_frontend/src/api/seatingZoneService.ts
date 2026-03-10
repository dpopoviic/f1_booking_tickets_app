import { api } from './client'
import type { SeatingZone } from '#/model/types'

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
}
