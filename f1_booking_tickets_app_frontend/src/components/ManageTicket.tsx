import { useState } from 'react'
import type { TicketDetails } from '#/model/types'
import { ticketService } from '#/api/ticketService'
import {
  CopiedIcon,
  CopyIcon,
  PlusIcon,
  CalendarIcon,
  PinIcon,
  TrashIcon,
} from '#/components/icons/Icons'

type ManageTicketProps = {
  ticket: TicketDetails
  onBack: () => void
}

export default function ManageTicket({ ticket, onBack }: ManageTicketProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const [cancelled, setCancelled] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [currentTicket, setCurrentTicket] = useState(ticket)
  const [cancelling, setCancelling] = useState(false)

  const copy = (val: string, key: string) => {
    navigator.clipboard.writeText(val).then(() => {
      setCopied(key)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  const currencyPrefix = currentTicket.currencyCode === 'EUR' ? '€' : currentTicket.currencyCode

  const handleCancel = async () => {
    setCancelling(true)
    try {
      await ticketService.cancel({
        ticketCode: currentTicket.ticketCode,
        email: currentTicket.email,
      })
      setCancelled(true)
      setShowConfirm(false)
      setCurrentTicket((t) => ({ ...t, isActive: false }))
    } catch (error) {
      console.error('Error cancelling ticket:', error)
      alert('Failed to cancel ticket. Please try again.')
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto w-full">
      <h1
        className="text-4xl text-white font-extrabold uppercase tracking-wide mb-1.5"
        style={{ fontFamily: "'Barlow Condensed',sans-serif" }}
      >
        Manage Your Ticket
      </h1>
      <p className="text-sm text-accent-sage mb-8">
        Enter your access code and email to view and modify your ticket.
      </p>

      <div className="border border-accent-sage/30 rounded-lg p-5 mb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent-sage mb-1">
              Ticket Code
            </p>
            <p className="text-sm font-mono text-white">
              {currentTicket.ticketCode}
            </p>
          </div>
          <span
            className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded border ${currentTicket.isActive ? 'border-green-700 text-green-400' : 'border-neutral-700 text-neutral-500'}`}
          >
            {currentTicket.isActive ? 'Active' : 'Cancelled'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent-sage mb-1">
              Customer
            </p>
            <p className="text-base text-white font-semibold">
              {currentTicket.firstName} {currentTicket.lastName}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent-sage mb-1">
              Email
            </p>
            <p className="text-base text-white font-semibold">
              {currentTicket.email}
            </p>
          </div>
        </div>

        <div className="bg-white/5 border border-accent-sage/30 rounded-md px-4 py-3 mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent-sage mb-1">
              Access Code
            </p>
            <p className="text-xl font-bold font-mono tracking-widest text-white">
              {currentTicket.ticketCode}
            </p>
          </div>
          <button
            onClick={() => copy(currentTicket.ticketCode, 'access')}
            className="text-accent-sage hover:text-neutral-200 transition-colors p-1"
          >
            {copied === 'access' ? <CopiedIcon /> : <CopyIcon />}
          </button>
        </div>

        {currentTicket.generatedPromoCode && (
          <div className="border border-accent-red/50 bg-red-950/20 rounded-md px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-accent-sage mb-1">
                Your Promo Code
              </p>
              {currentTicket.discountApplied > 0 && (
                <p className="text-xs text-green-400 mb-1">
                  Discount applied: {currencyPrefix}{' '}
                  {currentTicket.discountApplied.toFixed(2)}
                </p>
              )}
              <p className="text-xl font-bold font-mono tracking-widest text-accent-red">
                {currentTicket.generatedPromoCode}
              </p>
            </div>
            <button
              onClick={() => copy(currentTicket.generatedPromoCode, 'promo')}
              className="accent-sage hover:text-neutral-200 transition-colors p-1"
            >
              {copied === 'promo' ? <CopiedIcon /> : <CopyIcon />}
            </button>
          </div>
        )}
      </div>

      <div className="border border-accent-sage/30 rounded-lg p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-lg text-white font-extrabold uppercase tracking-widest"
            style={{ fontFamily: "'Barlow Condensed',sans-serif" }}
          >
            Race Days
          </h2>
          {currentTicket.isActive && (
            <button
              className="flex cursor-pointer items-center gap-1.5 px-3 py-1.5 border rounded-md text-xs font-semibold transition-colors"
              style={{ borderColor: '#E8102A', color: '#E8102A' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(232,16,42,0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <PlusIcon /> Add Day
            </button>
          )}
        </div>

        <div className="space-y-3">
          {currentTicket.items.map((rd, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 border-b border-neutral-800 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-accent-red/40 border border-accent-red/40 flex items-center justify-center shrink-0">
                  <CalendarIcon />
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">{rd.raceDayName}</p>
                  <p className="flex items-center gap-1 text-xs text-accent-sage mt-0.5">
                    <PinIcon /> {rd.zoneName}
                  </p>
                </div>
              </div>
              <p className="text-md text-white font-bold">
                {currencyPrefix} {rd.price.toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="h-px bg-neutral-800 mt-3 mb-4" />
        <div className="flex justify-between items-baseline">
          <span className="text-lg font-bold accent-sage text-white">
            Total
          </span>
          <span
            className="text-2xl font-extrabold text-white"
            style={{ fontFamily: "'Barlow Condensed',sans-serif" }}
          >
            {currencyPrefix} {currentTicket.totalPrice.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="px-5 py-3 cursor-pointer border border-white rounded-md text-sm font-semibold text-neutral-100 bg-transparent hover:border-neutral-500 transition-colors"
        >
          Search Another Ticket
        </button>

        {currentTicket.isActive && !cancelled && (
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center cursor-pointer gap-2 px-5 py-3 border border-accent-red/60 rounded-md text-sm font-semibold text-accent-red bg-transparent hover:bg-red-950/30 transition-colors"
          >
            <TrashIcon /> Cancel Ticket
          </button>
        )}

        {cancelled && (
          <span className="text-sm text-neutral-500 italic">
            Ticket has been cancelled.
          </span>
        )}
      </div>

      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
        >
          <div
            className="border border-neutral-700 rounded-xl p-6 max-w-sm w-full"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            <h3
              className="text-lg font-bold uppercase tracking-wide mb-2"
              style={{ fontFamily: "'Barlow Condensed',sans-serif" }}
            >
              Cancel Ticket?
            </h3>
            <p className="text-sm text-neutral-400 mb-6">
              This action cannot be undone. Your ticket will be permanently
              cancelled.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={cancelling}
                className="flex-1 py-2.5 border border-neutral-700 rounded-md text-sm font-semibold text-neutral-100 hover:border-neutral-500 transition-colors disabled:opacity-50"
              >
                Keep Ticket
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 py-2.5 rounded-md text-sm font-semibold text-white transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#E8102A' }}
                onMouseEnter={(e) =>
                  !cancelling && (e.currentTarget.style.backgroundColor = '#b50d22')
                }
                onMouseLeave={(e) =>
                  !cancelling && (e.currentTarget.style.backgroundColor = '#E8102A')
                }
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
