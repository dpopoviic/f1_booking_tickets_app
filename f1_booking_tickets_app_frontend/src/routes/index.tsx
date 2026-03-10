import HeroSection from '#/components/HeroSection'
import RaceDaySection from '#/components/RaceDaySection'
import GetTicketSection from '#/components/GetTicketSection'
import { raceService } from '#/api/raceService'
import type { RaceDay, RaceDetails } from '#/model/types'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const [nextRace, setNextRace] = useState<RaceDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const fetchNextRace = async () => {
      try {
        setLoading(true)
        const race = await raceService.getNextUpcoming()

        if (!active) {
          return
        }

        setNextRace(race)
        setError('')
      } catch (err) {
        if (!active) {
          return
        }

        console.error('Error fetching next upcoming race:', err)
        setError('Failed to load upcoming race information. Please try again.')
        setNextRace(null)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchNextRace()

    return () => {
      active = false
    }
  }, [])

  const raceDays = useMemo<RaceDay[]>(() => {
    const days = nextRace?.raceDays ?? []
    return [...days].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )
  }, [nextRace])

  return (
    <main className="bg-dark-surface min-h-screen">
      <HeroSection
        race={nextRace}
        raceDays={raceDays}
        loading={loading}
        error={error}
      />
      <RaceDaySection
        raceDays={raceDays}
        raceName={nextRace?.name}
        loading={loading}
        error={error}
      />
      <GetTicketSection />
    </main>
  )
}
