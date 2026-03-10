import { api } from './client'
import type { ValidatePromoResponse } from '#/model/types'

export const promoService = {
  validate: async (code: string): Promise<ValidatePromoResponse> => {
    return api.post<ValidatePromoResponse>('/api/PromoCode/validate', { code })
  },
}
