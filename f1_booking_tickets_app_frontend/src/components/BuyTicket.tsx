'use client'

import { useState, useEffect } from 'react'
import PromoCode from './PromoCode'
import SelectRaceDay from './SelectRaceDay'
import SelectSeat from './SelectSeat'
import SelectRace from './SelectRace'
import YourInfo, { type FormState, type FieldKey } from './YourInfo'
import FinishPurchase from './FinishPurchase'
import type { Race, RaceDay, SeatingZone, PurchaseTicketResponse } from '#/model/types'
import { raceDayService } from '#/api/raceDayService'
import { seatingZoneService } from '#/api/seatingZoneService'
import { ticketService } from '#/api/ticketService'

type AppliedPromo = {
  code: string
  discountPercentage: number
} | null

export default function BuyTicket() {
  // Race selection
  const [selectedRace, setSelectedRace] = useState<Race | null>(null)
  
  // Race days and zones for selected race
  const [raceDays, setRaceDays] = useState<RaceDay[]>([])
  const [zones, setZones] = useState<SeatingZone[]>([])
  const [loadingData, setLoadingData] = useState(false)
  
  // User selections
  const [selectedDay, setSelectedDay] = useState<RaceDay | null>(null)
  const [selectedZone, setSelectedZone] = useState<SeatingZone | null>(null)
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo>(null)
  const [currency, setCurrency] = useState('EUR')
  
  // Form data
  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    address: '',
    postalCode: '',
    city: '',
    country: '',
    email: '',
    emailConfirmation: '',
    phoneNumber: '',
  })

  // Purchase state
  const [purchasing, setPurchasing] = useState(false)
  const [purchaseResult, setPurchaseResult] = useState<PurchaseTicketResponse | null>(null)

  // Fetch race days and zones when race is selected
  useEffect(() => {
    if (!selectedRace) {
      setRaceDays([])
      setZones([])
      setSelectedDay(null)
      setSelectedZone(null)
      return
    }

    const fetchData = async () => {
      setLoadingData(true)
      setSelectedDay(null)
      setSelectedZone(null)
      
      try {
        const [daysData, zonesData] = await Promise.all([
          raceDayService.getByRaceId(selectedRace.raceId),
          seatingZoneService.getByRaceId(selectedRace.raceId),
        ])
        setRaceDays(daysData)
        setZones(zonesData)
      } catch (error) {
        console.error('Error fetching race data:', error)
        setRaceDays([])
        setZones([])
      } finally {
        setLoadingData(false)
      }
    }

    fetchData()
  }, [selectedRace])

  const handleSubmit = async () => {
    if (!selectedRace || !selectedDay || !selectedZone) {
      alert('Please select race, day and seating zone!')
      return
    }

    // Validate form
    for (const key in form) {
      const typedKey = key as FieldKey
      if (!form[typedKey]) {
        alert(`Please fill in ${typedKey.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
        return
      }
    }

    if (form.email.trim().toLowerCase() !== form.emailConfirmation.trim().toLowerCase()) {
      alert('Email and confirm email must match.')
      return
    }

    const raceDayId = Number(selectedDay.raceDayId)
    const zoneId = Number((selectedZone as SeatingZone & { zoneId?: number }).zoneId ?? selectedZone.seatingZoneId)
    const normalizedCurrency = (currency || 'EUR').trim().toUpperCase()

    if (!Number.isFinite(raceDayId) || !Number.isFinite(zoneId)) {
      alert('Race day or seating zone is invalid. Please reselect and try again.')
      return
    }

    setPurchasing(true)

    try {
      const result = await ticketService.purchase({
        firstName: form.firstName,
        lastName: form.lastName,
        address: form.address,
        country: form.country,
        phoneNumber: form.phoneNumber,
        email: form.email,
        emailConfirmation: form.emailConfirmation,
        currencyCode: normalizedCurrency,
        promoCode: appliedPromo?.code,
        items: [
          {
            raceDayId,
            zoneId,
          },
        ],
      })

      setPurchaseResult(result)
    } catch (error) {
      console.error('Error purchasing ticket:', error)
      alert('Failed to complete purchase. Please try again.')
    } finally {
      setPurchasing(false)
    }
  }

  // Show success screen after purchase
  if (purchaseResult) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1
            className="text-4xl font-extrabold uppercase tracking-wide mb-2 text-white"
            style={{ fontFamily: "'Barlow Condensed',sans-serif" }}
          >
            Purchase Complete!
          </h1>
          <p className="text-accent-sage">
            Your ticket has been confirmed. Check your email for details.
          </p>
        </div>

        <div className="bg-neutral-900 border border-accent-sage/30 rounded-lg p-6 mb-6">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-widest text-accent-sage mb-1">
              Ticket Code
            </p>
            <p className="text-2xl font-bold font-mono tracking-widest text-white">
              {purchaseResult.ticketCode}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-accent-sage mb-1">
                Total Paid
              </p>
              <p className="text-lg font-semibold text-white">
                {purchaseResult.currency === 'EUR' ? '€' : purchaseResult.currency}
                {purchaseResult.totalPrice.toFixed(2)}
              </p>
            </div>
            {purchaseResult.discountApplied > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-accent-sage mb-1">
                  Discount Applied
                </p>
                <p className="text-lg font-semibold text-green-500">
                  {purchaseResult.currency === 'EUR' ? '€' : purchaseResult.currency}
                  {purchaseResult.discountApplied.toFixed(2)}
                </p>
              </div>
            )}
          </div>

          {purchaseResult.generatedPromoCode && (
            <div className="mt-4 pt-4 border-t border-accent-sage/30">
              <p className="text-xs font-bold uppercase tracking-widest text-accent-sage mb-1">
                Your Promo Code (Share with friends!)
              </p>
              <p className="text-xl font-bold font-mono tracking-widest text-accent-red">
                {purchaseResult.generatedPromoCode}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 border border-accent-sage text-white rounded-md text-sm font-semibold hover:border-accent-sage/50 transition-colors"
        >
          Buy Another Ticket
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <SelectRace
        selectedRace={selectedRace}
        setSelectedRace={setSelectedRace}
      />
      <SelectRaceDay
        raceDays={raceDays}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        loading={loadingData}
      />
      <SelectSeat
        zones={zones}
        selectedZone={selectedZone}
        setSelectedZone={setSelectedZone}
        loading={loadingData}
      />
      <YourInfo
        form={form}
        setForm={setForm}
        currency={currency}
        setCurrency={setCurrency}
      />
      <PromoCode
        appliedPromo={appliedPromo}
        setAppliedPromo={setAppliedPromo}
      />
      <FinishPurchase
        race={selectedRace}
        selectedDay={selectedDay}
        selectedZone={selectedZone}
        appliedPromo={appliedPromo}
        currency={currency}
        handleSubmit={handleSubmit}
        loading={purchasing}
      />
    </div>
  )
}
