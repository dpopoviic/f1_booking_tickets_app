import { useState } from 'react'

export const SEATING_ZONES = [
  {
    seatingZoneId: 1,
    name: 'VIP Grandstand',
    description: 'Premium view, hospitality included',
    capacity: 99,
    priceModifier: 50,
  },
  {
    seatingZoneId: 2,
    name: 'General Admission',
    description: 'Great atmosphere',
    capacity: 499,
    priceModifier: 0,
  },
]

type SelectZoneProps = {
  selectedZone: (typeof SEATING_ZONES)[number] | null
  setSelectedZone: (zone: (typeof SEATING_ZONES)[number]) => void
}

export default function SelectTicket({
  selectedZone,
  setSelectedZone,
}: SelectZoneProps) {
  const [errors, setErrors] = useState('')
  return (
    <section className="max-w-5xl mx-auto p-6 bg-transparent rounded-lg">
      <h2
        className="text-4xl font-extrabold uppercase tracking-wide mb-1 text-white"
        style={{ fontFamily: "'Barlow Condensed',sans-serif" }}
      >
        Seating Zone
      </h2>
      <p className="text-md text-accent-sage mb-4">
        Choose your preferred seating area.
      </p>
      {errors && !selectedZone && (
        <p className="text-xs text-red-500 mb-3">{errors}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SEATING_ZONES.map((z) => {
          const active = selectedZone?.seatingZoneId === z.seatingZoneId
          return (
            <div
              key={z.seatingZoneId}
              onClick={() => {
                setSelectedZone(z)
                setErrors('Please select a seating type to proceed.')
              }}
              className={`border rounded-lg p-4 cursor-pointer transition-all duration-200
                      ${active ? 'border-accent-red bg-accent-red/10' : 'border-accent-sage/30 hover:accent-sage/50'}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg text-white font-semibold">
                  {z.name}
                </span>
                <span
                  className={`text-sm font-semibold px-2 py-0.5 rounded ${z.capacity < 100 ? 'bg-accent-red/10 text-accent-red' : 'bg-green-500/10 text-green-500'}`}
                >
                  {z.capacity} seats
                </span>
              </div>
              <div className="text-md text-accent-sage text-accent-sagemb-3">
                {z.description}
              </div>
              <div className="flex justify-between items-center border-t border-accent-sage/30 pt-2.5">
                <span className="text-sm text-accent-sage">Price modifier</span>
                <span
                  className={`text-md font-bold ${z.priceModifier === 0 ? 'text-accent-sage' : 'text-accent-red'}`}
                >
                  {z.priceModifier === 0 ? '+€0' : `+€${z.priceModifier}`}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
