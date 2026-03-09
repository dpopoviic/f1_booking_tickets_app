import { useState } from 'react'

export const RACE_DAYS = [
  {
    raceDayId: 1,
    date: 'May 23, 2025',
    name: 'Practice Day',
    description: 'Practice sessions',
    dayPrice: 80,
  },
  {
    raceDayId: 2,
    date: 'May 24, 2025',
    name: 'Qualifying Day',
    description: 'Qualifying sessions',
    dayPrice: 180,
  },
  {
    raceDayId: 3,
    date: 'May 25, 2025',
    name: 'Race Day',
    description: 'Formula 1 Grand Prix',
    dayPrice: 320,
  },
]

type SelectDayProps = {
  selectedDay: (typeof RACE_DAYS)[number] | null
  setSelectedDay: (day: (typeof RACE_DAYS)[number]) => void
}
export default function SelectRaceDay({
  selectedDay,
  setSelectedDay,
}: SelectDayProps) {
  const [errors, setErrors] = useState('')
  return (
    <section className="max-w-5xl mx-auto p-6 bg-transparent rounded-lg">
      <h2
        className="text-4xl font-extrabold uppercase tracking-wide mb-1 text-white"
        style={{ fontFamily: "'Barlow Condensed',sans-serif" }}
      >
        Select Race Day
      </h2>
      <p className="text-md text-accent-sage 500 mb-4">
        Choose the day you want to attend.
      </p>
      {errors != '' && <p className="text-xs text-red-500 mb-3">{errors}</p>}
      <div className="space-y-3">
        {RACE_DAYS.map((d) => {
          const active = selectedDay?.raceDayId === d.raceDayId
          return (
            <div
              key={d.raceDayId}
              onClick={() => {
                setSelectedDay(d)
                setErrors('Please select a race day to proceed.')
              }}
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
                  €{d.dayPrice}
                </div>
                <div className="text-xs text-accent-sage">{d.date}</div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
