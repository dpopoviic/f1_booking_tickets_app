import HeroSection from '#/components/HeroSection'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="bg-dark-surface min-h-screen">
      <HeroSection />
    </main>
  )
}
