export interface Race {
  raceId: number
  name: string
  location: string
  basePrice: number
}

export interface RaceDetails extends Race {
  discountDeadline?: string
  raceDays: RaceDay[]
  seatingZones: SeatingZone[]
}

export interface RaceDay {
  raceDayId: number
  raceId: number
  date: string
  name: string
  description: string
  dayPrice: number
  capacity: number
}

export interface SeatingZone {
  seatingZoneId: number
  raceId: number
  name: string
  priceMultiplier: number
  capacity: number
}

export interface PurchaseTicketItem {
  raceDayId: number
  zoneId: number
}

export interface PurchaseTicketRequest {
  firstName: string
  lastName: string
  address: string
  country: string
  phoneNumber: string
  email: string
  emailConfirmation: string
  currencyCode: string
  promoCode?: string
  items: PurchaseTicketItem[]
}

export interface PurchaseTicketResponse {
  ticketCode: string
  generatedPromoCode: string
  totalPrice: number
  currency: string
  discountApplied: number
}

export interface TicketRaceDayItem {
  raceDayId: number
  raceDayName: string
  date: string
  zoneId: number
  zoneName: string
  price: number
}

export interface TicketDetails {
  ticketCode: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  address: string
  country: string
  isActive: boolean
  totalPrice: number
  purchaseDate: string
  discountApplied: number
  currencyCode: string
  generatedPromoCode: string
  usedPromoCode?: string
  items: TicketRaceDayItem[]
}

export interface ModifyTicketRequest {
  ticketCode: string
  email: string
  raceDayId: number
  zoneId: number
}

export interface CancelTicketRequest {
  ticketCode: string
  email: string
}

export interface ValidatePromoRequest {
  code: string
}

export interface ValidatePromoResponse {
  isValid: boolean
  discountPercentage?: number
  message?: string
}

export interface Currency {
  currencyId: number
  name: string
  code: string
}

export const SUPPORTED_CURRENCIES = [
  { code: 'EUR', name: 'Euro' },
  { code: 'USD', name: 'US Dollar' },
  { code: 'GBP', name: 'British Pound' },
] as const
