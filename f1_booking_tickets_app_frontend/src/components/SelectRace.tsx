import { useEffect, useState } from 'react'
import type { Race } from '#/model/types'
import { raceService } from '#/api/raceService'

type SelectRaceProps = {
  selectedRace: Race | null
  setSelectedRace: (race: Race | null) => void
  currency: string
  exchangeRate: number
}

const formatPrice = (amount: number, currency: string) => {
  const formattedAmount = amount.toFixed(2)

  if (currency === 'EUR') {
    return `€${formattedAmount}`
  }

  return `${currency} ${formattedAmount}`
}

export default function SelectRace({
  selectedRace,
  setSelectedRace,
  currency,
  exchangeRate,
}: SelectRaceProps) {
  const [races, setRaces] = useState<Race[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        setLoading(true)
        const data = await raceService.getAll()
        setRaces(data)
        // Auto-select first race if only one exists
        if (data.length === 1) {
          setSelectedRace(data[0])
        }
      } catch (err) {
        setError('Failed to load races. Please try again.')
        console.error('Error fetching races:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchRaces()
  }, [setSelectedRace])

  if (loading) {
    return (
      <section className="max-w-5xl mx-auto p-6 bg-transparent rounded-lg">
        <h2
          className="text-4xl font-extrabold uppercase tracking-wide mb-1 text-white"
          style={{ fontFamily: "'Barlow Condensed',sans-serif" }}
        >
          Select Race
        </h2>
        <p className="text-md text-accent-sage mb-4">Loading races...</p>
        <div className="animate-pulse space-y-3">
          <div className="h-20 bg-neutral-800 rounded-lg" />
          <div className="h-20 bg-neutral-800 rounded-lg" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="max-w-5xl mx-auto p-6 bg-transparent rounded-lg">
        <h2
          className="text-4xl font-extrabold uppercase tracking-wide mb-1 text-white"
          style={{ fontFamily: "'Barlow Condensed',sans-serif" }}
        >
          Select Race
        </h2>
        <p className="text-red-500 text-sm">{error}</p>
      </section>
    )
  }

  if (races.length === 0) {
    return (
      <section className="max-w-5xl mx-auto p-6 bg-transparent rounded-lg">
        <h2
          className="text-4xl font-extrabold uppercase tracking-wide mb-1 text-white"
          style={{ fontFamily: "'Barlow Condensed',sans-serif" }}
        >
          Select Race
        </h2>
        <p className="text-accent-sage text-sm">No races available at the moment.</p>
      </section>
    )
  }

  return (
    <section className="max-w-5xl mx-auto p-6 bg-transparent rounded-lg">
      <h2
        className="text-4xl font-extrabold uppercase tracking-wide mb-1 text-white"
        style={{ fontFamily: "'Barlow Condensed',sans-serif" }}
      >
        Select Race
      </h2>
      <p className="text-md text-accent-sage mb-4">
        Choose the Grand Prix you want to attend.
      </p>

      <div className="space-y-3">
        {races.map((race) => {
          const active = selectedRace?.raceId === race.raceId
          const convertedBasePrice = race.basePrice * exchangeRate

          return (
            <div
              key={race.raceId}
              onClick={() => setSelectedRace(race)}
              className={`flex items-center justify-between px-5 py-4 border rounded-lg cursor-pointer transition-all duration-200
                ${active ? 'border-accent-red bg-accent-red/10' : 'border-accent-sage/30 hover:border-accent-sage/50'}`}
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
                    {race.name}
                  </div>
                  <div className="text-md text-accent-sage">{race.location}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-md font-bold text-white">
                  from {formatPrice(convertedBasePrice, currency)}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
