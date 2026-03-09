import BuyTicket from '#/components/BuyTicket'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/purchase/')({ component: App })

function App() {
  return (
    <main className="bg-black">
      <BuyTicket />
    </main>
  )
}
