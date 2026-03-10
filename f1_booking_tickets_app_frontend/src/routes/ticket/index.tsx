import { createFileRoute } from '@tanstack/react-router'
import ManageTicket from '#/components/ManageTicket'
import FindTicket from '#/components/FindTicket'
import { useState } from 'react'
import type { TicketDetails } from '#/model/types'

export const Route = createFileRoute('/ticket/')({ component: App })

function App() {
  const [ticket, setTicket] = useState<TicketDetails | null>(null)

  return (
    <>
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: '#111' }}
      >
        <div
          className={`flex-1 px-6 py-10 ${!ticket ? 'flex items-start justify-center' : ''}`}
          style={!ticket ? { paddingTop: 80 } : {}}
        >
          {!ticket ? (
            <FindTicket onFound={setTicket} />
          ) : (
            <ManageTicket ticket={ticket} onBack={() => setTicket(null)} />
          )}
        </div>
      </div>
    </>
  )
}
