import type { SeatingZone } from '#/model/types'

type SelectZoneProps = {
  zones: SeatingZone[]
  selectedZone: SeatingZone | null
  setSelectedZone: (zone: SeatingZone) => void
  loading?: boolean
}

export default function SelectSeat({
  zones,
  selectedZone,
  setSelectedZone,
  loading = false,
}: SelectZoneProps) {
  if (loading) {
    return (
      <section className="max-w-5xl mx-auto p-6 bg-transparent rounded-lg">
        <h2
          className="text-4xl font-extrabold uppercase tracking-wide mb-1 text-white"
          style={{ fontFamily: "'Barlow Condensed',sans-serif" }}
        >
          Seating Zone
        </h2>
        <p className="text-md text-accent-sage mb-4">Loading zones...</p>
        <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="h-32 bg-neutral-800 rounded-lg" />
          <div className="h-32 bg-neutral-800 rounded-lg" />
        </div>
      </section>
    )
  }

  if (zones.length === 0) {
    return (
      <section className="max-w-5xl mx-auto p-6 bg-transparent rounded-lg">
        <h2
          className="text-4xl font-extrabold uppercase tracking-wide mb-1 text-white"
          style={{ fontFamily: "'Barlow Condensed',sans-serif" }}
        >
          Seating Zone
        </h2>
        <p className="text-md text-accent-sage mb-4">
          Please select a race first.
        </p>
      </section>
    )
  }

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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {zones.map((z) => {
          const active = selectedZone?.seatingZoneId === z.seatingZoneId
          const priceModifier = z.priceMultiplier > 1 
            ? `×${z.priceMultiplier}` 
            : z.priceMultiplier === 1 
              ? '×1' 
              : `×${z.priceMultiplier}`
          return (
            <div
              key={z.seatingZoneId}
              onClick={() => setSelectedZone(z)}
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
              <div className="text-md text-accent-sage mb-3">
                {z.name}
              </div>
              <div className="flex justify-between items-center border-t border-accent-sage/30 pt-2.5">
                <span className="text-sm text-accent-sage">Price multiplier</span>
                <span
                  className={`text-md font-bold ${z.priceMultiplier === 1 ? 'text-accent-sage' : 'text-accent-red'}`}
                >
                  {priceModifier}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
