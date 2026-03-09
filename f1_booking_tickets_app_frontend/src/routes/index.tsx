import HeroSection from '#/components/HeroSection'
import RaceDaySection from '#/components/RaceDaySection'
import GetTicketSection from '#/components/GetTicketSection'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="bg-dark-surface min-h-screen">
      <HeroSection />
      <RaceDaySection />
      <GetTicketSection />
    </main>
  )
}
