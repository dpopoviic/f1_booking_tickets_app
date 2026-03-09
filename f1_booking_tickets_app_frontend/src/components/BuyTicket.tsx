'use client'

import { useState } from 'react'
import PromoCode, { VALID_PROMOS } from './PromoCode'
import SelectRaceDay, { RACE_DAYS } from './SelectRaceDay'
import SelectSeat, { SEATING_ZONES } from './SelectSeat'
import YourInfo, { type FormState, type FieldKey } from './YourInfo'
import FinishPurchase from './FinishPurchase'

export default function BuyTicket() {
  const [selectedDay, setSelectedDay] = useState<
    (typeof RACE_DAYS)[number] | null
  >(null)
  const [selectedZone, setSelectedZone] = useState<
    (typeof SEATING_ZONES)[number] | null
  >(null)
  const [appliedPromo, setAppliedPromo] = useState<
    (typeof VALID_PROMOS)[number] | null
  >(null)
  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    address: '',
    postalCode: '',
    city: '',
    country: '',
    email: '',
    phoneNumber: '',
  })

  const calculateTotalPrice = () => {
    if (selectedDay && selectedZone) {
      const basePrice = selectedDay.dayPrice + selectedZone.priceModifier
      const discount = appliedPromo
        ? (basePrice * appliedPromo.discountPercentage) / 100
        : 0
      return basePrice - discount
    }
    return 0
  }

  const handleSubmit = () => {
    if (!selectedDay || !selectedZone) return alert('Select day and seat!')

    for (const key in form) {
      const typedKey = key as FieldKey
      if (!form[typedKey]) return alert(`Fill ${typedKey}`)
    }

    const ticket = {
      TicketId: crypto.randomUUID(),
      isActive: true,
      TotalPrice: calculateTotalPrice(),
      PurchaseDate: new Date().toISOString(),
      DiscountApplied: appliedPromo?.discountPercentage || 0,
      Email: form.email,
      Country: form.country,
      PhoneNumber: form.phoneNumber || '',
      Address: form.address,
      LastName: form.lastName,
      FirstName: form.firstName,
      TicketCode: '',
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
    }

    console.log('Ticket Created:', ticket)
    alert('Purchase complete! Check console for ticket object.')
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <SelectRaceDay
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
      />
      <SelectSeat
        selectedZone={selectedZone}
        setSelectedZone={setSelectedZone}
      />
      <YourInfo form={form} setForm={setForm} />
      <PromoCode
        appliedPromo={appliedPromo}
        setAppliedPromo={setAppliedPromo}
      />
      <FinishPurchase
        selectedDay={selectedDay}
        selectedZone={selectedZone}
        appliedPromo={appliedPromo}
        handleSubmit={handleSubmit}
      />
    </div>
  )
}
