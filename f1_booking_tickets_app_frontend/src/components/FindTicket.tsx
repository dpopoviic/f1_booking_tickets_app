import { useState } from 'react'
import { SearchIcon } from './icons/Icons'
import { ticketService } from '#/api/ticketService'
import type { TicketDetails } from '#/model/types'
import { ApiError } from '#/api/client'

type FindTicketProps = {
  onFound: (ticket: TicketDetails) => void
}

export default function FindTicket({ onFound }: FindTicketProps) {
  const [accessCode, setAccessCode] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFind = async () => {
    if (!accessCode.trim() || !email.trim()) {
      setError('Please enter both access code and email.')
      return
    }
    setLoading(true)
    setError('')

    try {
      const ticket = await ticketService.findByCodeAndEmail(
        accessCode.trim(),
        email.trim(),
      )
      onFound(ticket)
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setError('No ticket found. Please check your access code and email.')
      } else {
        setError('Failed to find ticket. Please try again.')
        console.error('Error finding ticket:', err)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm w-full">
      <h1
        className="text-4xl font-extrabold uppercase tracking-wide mb-1.5 text-white"
        style={{ fontFamily: "'Barlow Condensed',sans-serif" }}
      >
        Manage Your Ticket
      </h1>
      <p className="text-sm text-accent-sage mb-8">
        Enter your access code and email to view and modify your ticket.
      </p>

      <div className="border border-neutral-800 rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm text-neutral-400 mb-1.5">
            Access Code
          </label>
          <input
            type="text"
            placeholder="XXXXXXXX"
            value={accessCode}
            onChange={(e) => {
              setAccessCode(e.target.value)
              setError('')
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleFind()}
            className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-4 py-3 text-sm text-neutral-100 outline-none focus:border-neutral-500 transition-colors placeholder:text-neutral-600 tracking-widest font-mono"
          />
        </div>
        <div>
          <label className="block text-sm text-neutral-400 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError('')
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleFind()}
            className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-4 py-3 text-sm text-neutral-100 outline-none focus:border-neutral-500 transition-colors placeholder:text-neutral-600"
          />
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <button
          onClick={handleFind}
          disabled={loading}
          className="w-full cursor-pointer flex items-center justify-center gap-2 py-3 rounded-md text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60"
          style={{ backgroundColor: '#E8102A' }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = '#b50d22'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#E8102A'
          }}
        >
          {loading ? (
            <svg
              className="animate-spin"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <circle
                cx="8"
                cy="8"
                r="6"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
              />
              <path
                d="M8 2a6 6 0 016 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <SearchIcon />
          )}
          {loading ? 'Searching...' : 'Find Ticket'}
        </button>
      </div>
    </div>
  )
}
