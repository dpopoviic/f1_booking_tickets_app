import { api } from './client'

export interface ExchangeRateResponse {
  from: string
  to: string
  rate: number
}

export const currencyService = {
  getExchangeRate: async (from: string, to: string): Promise<ExchangeRateResponse> => {
    return api.get<ExchangeRateResponse>(
      `/api/Currency/exchange-rate?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
    )
  },
}
