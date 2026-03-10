import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  reportsService,
  type TicketsByRaceDayReport,
  type TicketsByPurchaseDateReport,
} from '#/api/reportsService'

export const Route = createFileRoute('/reports/')({ component: App })

function App() {
  const [byRaceDay, setByRaceDay] = useState<TicketsByRaceDayReport[]>([])
  const [byPurchaseDate, setByPurchaseDate] = useState<TicketsByPurchaseDateReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadReports = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const [raceDayData, purchaseDateData] = await Promise.all([
          reportsService.getByRaceDay(),
          reportsService.getByPurchaseDate(),
        ])

        setByRaceDay(raceDayData)
        setByPurchaseDate(purchaseDateData)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load reports'
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

    loadReports()
  }, [])

  if (isLoading) {
    return (
      <main className="bg-black min-h-screen px-6 py-8 text-white">
        <p className="text-center text-lg text-accent-sage">Loading reports...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="bg-black min-h-screen px-6 py-8 text-white">
        <p className="text-center text-lg text-accent-red">{error}</p>
      </main>
    )
  }

  return (
    <main className="bg-black min-h-screen px-6 py-8 text-white">
      <h1 className="text-3xl font-bold text-center mb-8">Live Reports</h1>

      <section className="max-w-5xl mx-auto grid gap-8 md:grid-cols-2">
        <div className="border border-accent-sage/30 rounded-lg p-4 bg-dark-surface/50">
          <h2 className="text-xl font-semibold mb-4 text-accent-sage">Tickets By Race Day</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-accent-sage/30 text-left">
                  <th className="py-2 pr-2">Race Day</th>
                  <th className="py-2 pr-2">Date</th>
                  <th className="py-2 text-right">Tickets</th>
                </tr>
              </thead>
              <tbody>
                {byRaceDay.map((item) => (
                  <tr key={item.id} className="border-b border-accent-sage/10">
                    <td className="py-2 pr-2">{item.raceDayName || `Race Day ${item.raceDayId}`}</td>
                    <td className="py-2 pr-2">{item.raceDayDate || '-'}</td>
                    <td className="py-2 text-right font-semibold">{item.ticketCount}</td>
                  </tr>
                ))}
                {byRaceDay.length === 0 && (
                  <tr>
                    <td className="py-3 text-center text-accent-sage" colSpan={3}>
                      No data yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border border-accent-sage/30 rounded-lg p-4 bg-dark-surface/50">
          <h2 className="text-xl font-semibold mb-4 text-accent-sage">Tickets By Purchase Date</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-accent-sage/30 text-left">
                  <th className="py-2 pr-2">Purchase Date</th>
                  <th className="py-2 text-right">Tickets</th>
                </tr>
              </thead>
              <tbody>
                {byPurchaseDate.map((item) => (
                  <tr key={item.id} className="border-b border-accent-sage/10">
                    <td className="py-2 pr-2">{item.purchaseDate}</td>
                    <td className="py-2 text-right font-semibold">{item.ticketCount}</td>
                  </tr>
                ))}
                {byPurchaseDate.length === 0 && (
                  <tr>
                    <td className="py-3 text-center text-accent-sage" colSpan={2}>
                      No data yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  )
}
