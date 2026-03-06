import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ticket/')({ component: App })

function App() {
  return (
    <main className="bg-black">
      <h1 className="text-3xl font-bold text-center">
        Welcome to the Formula 1 Tickets App!
      </h1>
      <p className="text-center mt-4 text-gray-400">TICKET</p>
    </main>
  )
}
