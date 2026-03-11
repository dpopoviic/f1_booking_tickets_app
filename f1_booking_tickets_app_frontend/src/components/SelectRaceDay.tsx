import type { RaceDay } from '#/model/types'

type SelectDayProps = {
  raceDays: RaceDay[]
  selectedDayIds: number[]
  onToggleDay: (day: RaceDay) => void
  currency: string
  exchangeRate: number
  loading?: boolean
}

const formatPrice = (amount: number, currency: string) => {
  const formattedAmount = amount.toFixed(2)

  if (currency === 'EUR') {
    return `€${formattedAmount}`
  }

  return `${currency} ${formattedAmount}`
}

export default function SelectRaceDay({
  raceDays,
  selectedDayIds,
  onToggleDay,
  currency,
  exchangeRate,
  loading = false,
}: SelectDayProps) {
  if (loading) {
    return (
      <section className="max-w-5xl mx-auto p-6 bg-transparent rounded-lg">
        <h2
          className="text-4xl font-extrabold uppercase tracking-wide mb-1 text-white"
          style={{ fontFamily: "'Barlow Condensed',sans-serif" }}
        >
          Select Race Days
        </h2>
        <p className="text-md text-accent-sage mb-4">Loading race days...</p>
        <div className="animate-pulse space-y-3">
          <div className="h-20 bg-neutral-800 rounded-lg" />
          <div className="h-20 bg-neutral-800 rounded-lg" />
        </div>
      </section>
    )
  }

  if (raceDays.length === 0) {
    return (
      <section className="max-w-5xl mx-auto p-6 bg-transparent rounded-lg">
        <h2
          className="text-4xl font-extrabold uppercase tracking-wide mb-1 text-white"
          style={{ fontFamily: "'Barlow Condensed',sans-serif" }}
        >
          Select Race Days
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
        Select Race Days
      </h2>
      <p className="text-md text-accent-sage mb-4">
        Choose one or more race days.
      </p>
      <div className="space-y-3">
        {raceDays.map((d) => {
          const active = selectedDayIds.includes(d.raceDayId)
          const dateStr = new Date(d.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
          const convertedDayPrice = d.dayPrice * exchangeRate

          return (
            <div
              key={d.raceDayId}
              onClick={() => onToggleDay(d)}
              className={`flex items-center justify-between px-5 py-4 border rounded-lg cursor-pointer transition-all duration-200
                      ${active ? 'border-accent-red bg-accent-red/10' : 'border-accent-sage/30  hover:border-accent-sage/50'}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${active ? 'border-transparent' : 'border-accent-sage/30'}`}
                  style={active ? { backgroundColor: '#E8102A' } : {}}
                >
                  {active && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
                <div>
                  <div className="text-lg font-semibold text-white">
                    {d.name}
                  </div>
                  <div className="text-md text-accent-sage">
                    {d.description}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-md font-bold text-white">
                  {formatPrice(convertedDayPrice, currency)}
                </div>
                <div className="text-xs text-accent-sage">{dateStr}</div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
