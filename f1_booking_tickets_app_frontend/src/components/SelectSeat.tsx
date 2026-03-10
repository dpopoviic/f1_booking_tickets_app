import type { RaceDay, SeatingZone } from '#/model/types'

type SelectZoneProps = {
  raceDays: RaceDay[]
  selectedDayIds: number[]
  zones: SeatingZone[]
  zoneByDayId: Record<number, number | undefined>
  onSelectZoneForDay: (raceDayId: number, zone: SeatingZone) => void
  loading?: boolean
}

export default function SelectSeat({
  raceDays,
  selectedDayIds,
  zones,
  zoneByDayId,
  onSelectZoneForDay,
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

  if (selectedDayIds.length === 0) {
    return (
      <section className="max-w-5xl mx-auto p-6 bg-transparent rounded-lg">
        <h2
          className="text-4xl font-extrabold uppercase tracking-wide mb-1 text-white"
          style={{ fontFamily: "'Barlow Condensed',sans-serif" }}
        >
          Seating Zone
        </h2>
        <p className="text-md text-accent-sage mb-4">
          Select at least one race day first.
        </p>
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
          No seating zones are available for this race.
        </p>
      </section>
    )
  }

  const selectedDays = raceDays.filter((day) => selectedDayIds.includes(day.raceDayId))

  return (
    <section className="max-w-5xl mx-auto p-6 bg-transparent rounded-lg">
      <h2
        className="text-4xl font-extrabold uppercase tracking-wide mb-1 text-white"
        style={{ fontFamily: "'Barlow Condensed',sans-serif" }}
      >
        Seating Zone
      </h2>
      <p className="text-md text-accent-sage mb-4">
        Choose one seating zone for each selected day.
      </p>

      <div className="space-y-5">
        {selectedDays.map((day) => (
          <div key={day.raceDayId} className="border border-accent-sage/20 rounded-lg p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <p className="text-white font-semibold text-lg">{day.name}</p>
              <p className="text-sm text-accent-sage">
                {new Date(day.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {zones.map((z) => {
                const active = zoneByDayId[day.raceDayId] === z.seatingZoneId
                const priceModifier = z.priceMultiplier > 1
                  ? `x${z.priceMultiplier}`
                  : z.priceMultiplier === 1
                    ? 'x1'
                    : `x${z.priceMultiplier}`

                return (
            <div
              key={`${day.raceDayId}-${z.seatingZoneId}`}
              onClick={() => onSelectZoneForDay(day.raceDayId, z)}
              className={`border rounded-lg p-4 cursor-pointer transition-all duration-200
                      ${active ? 'border-accent-red bg-accent-red/10' : 'border-accent-sage/30 hover:border-accent-sage/50'}`}
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
          </div>
        ))}
      </div>
    </section>
  )
}
