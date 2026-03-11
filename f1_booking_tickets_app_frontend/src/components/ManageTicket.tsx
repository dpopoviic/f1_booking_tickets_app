import { useState } from 'react'
import type { TicketDetails, RaceDay, SeatingZone } from '#/model/types'
import { ticketService } from '#/api/ticketService'
import { raceDayService } from '#/api/raceDayService'
import { seatingZoneService } from '#/api/seatingZoneService'
import {
  CopiedIcon,
  CopyIcon,
  PlusIcon,
  CalendarIcon,
  PinIcon,
  TrashIcon,
  XIcon,
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

  const [showAddDay, setShowAddDay] = useState(false)
  const [addDayLoading, setAddDayLoading] = useState(false)
  const [availableRaceDays, setAvailableRaceDays] = useState<RaceDay[]>([])
  const [zones, setZones] = useState<SeatingZone[]>([])
  const [selectedRaceDayId, setSelectedRaceDayId] = useState<number>(0)
  const [selectedZoneId, setSelectedZoneId] = useState<number>(0)
  const [addingDay, setAddingDay] = useState(false)
  const [addDayError, setAddDayError] = useState<string | null>(null)

  const [confirmRemoveDayId, setConfirmRemoveDayId] = useState<number | null>(null)
  const [removingDayId, setRemovingDayId] = useState<number | null>(null)

  const [error, setError] = useState<string | null>(null)

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

  const handleOpenAddDay = async () => {
    setShowAddDay(true)
    setAddDayLoading(true)
    setAddDayError(null)
    try {
      const firstRaceDay = await raceDayService.getById(currentTicket.items[0].raceDayId)
      const raceId = firstRaceDay.raceId

      const [days, zoneList] = await Promise.all([
        raceDayService.getByRaceId(raceId),
        seatingZoneService.getByRaceId(raceId),
      ])

      const existingDayIds = new Set(currentTicket.items.map((i) => i.raceDayId))
      const available = days.filter((d) => !existingDayIds.has(d.raceDayId))

      setAvailableRaceDays(available)
      setZones(zoneList)
      if (available.length > 0) setSelectedRaceDayId(available[0].raceDayId)
      if (zoneList.length > 0) setSelectedZoneId(zoneList[0].seatingZoneId)
    } catch {
      setAddDayError('Failed to load available race days.')
    } finally {
      setAddDayLoading(false)
    }
  }

  const handleAddDay = async () => {
    if (!selectedRaceDayId || !selectedZoneId) return
    setAddingDay(true)
    setAddDayError(null)
    try {
      const updated = await ticketService.addRaceDay({
        ticketCode: currentTicket.ticketCode,
        email: currentTicket.email,
        raceDayId: selectedRaceDayId,
        zoneId: selectedZoneId,
      })
      setCurrentTicket(updated)
      setShowAddDay(false)
    } catch (err: any) {
      setAddDayError(err?.message || 'Failed to add race day.')
    } finally {
      setAddingDay(false)
    }
  }

  const handleRemoveDay = async (raceDayId: number) => {
    const item = currentTicket.items.find((i) => i.raceDayId === raceDayId)
    if (!item) return
    setRemovingDayId(raceDayId)
    setError(null)
    try {
      const updated = await ticketService.removeRaceDay({
        ticketCode: currentTicket.ticketCode,
        email: currentTicket.email,
        raceDayId,
        zoneId: item.zoneId,
      })
      setCurrentTicket(updated)
      setConfirmRemoveDayId(null)
    } catch (err: any) {
      setError(err?.message || 'Failed to remove race day.')
      setConfirmRemoveDayId(null)
    } finally {
      setRemovingDayId(null)
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
        View and modify your ticket details below.
      </p>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-md border border-red-700/60 bg-red-950/30 text-sm text-red-400 flex items-center justify-between">
          {error}
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300 ml-3">
            <XIcon />
          </button>
        </div>
      )}

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
              onClick={handleOpenAddDay}
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
          {currentTicket.items.map((rd) => (
            <div
              key={rd.raceDayId}
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
              <div className="flex items-center gap-3">
                <p className="text-md text-white font-bold">
                  {currencyPrefix} {rd.price.toFixed(2)}
                </p>
                {currentTicket.isActive && currentTicket.items.length > 1 && (
                  <>
                    {confirmRemoveDayId === rd.raceDayId ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleRemoveDay(rd.raceDayId)}
                          disabled={removingDayId === rd.raceDayId}
                          className="px-2 py-1 text-xs font-semibold rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                        >
                          {removingDayId === rd.raceDayId ? '...' : 'Yes'}
                        </button>
                        <button
                          onClick={() => setConfirmRemoveDayId(null)}
                          disabled={removingDayId === rd.raceDayId}
                          className="px-2 py-1 text-xs font-semibold rounded border border-neutral-600 text-neutral-300 hover:border-neutral-400 disabled:opacity-50 transition-colors"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmRemoveDayId(rd.raceDayId)}
                        className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                        title="Remove day"
                      >
                        <TrashIcon />
                      </button>
                    )}
                  </>
                )}
              </div>
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

      {showAddDay && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
        >
          <div
            className="border border-neutral-700 rounded-xl p-6 max-w-md w-full"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            <div className="flex items-center justify-between mb-5">
              <h3
                className="text-lg font-bold uppercase tracking-wide text-white"
                style={{ fontFamily: "'Barlow Condensed',sans-serif" }}
              >
                Add Race Day
              </h3>
              <button
                onClick={() => setShowAddDay(false)}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <XIcon />
              </button>
            </div>

            {addDayLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-6 h-6 border-2 border-neutral-600 border-t-white rounded-full animate-spin" />
              </div>
            ) : addDayError && availableRaceDays.length === 0 ? (
              <p className="text-sm text-red-400 py-4">{addDayError}</p>
            ) : availableRaceDays.length === 0 ? (
              <p className="text-sm text-neutral-400 py-6">
                All available race days are already on your ticket.
              </p>
            ) : (
              <>
                {addDayError && (
                  <div className="mb-4 px-3 py-2 rounded border border-red-700/60 bg-red-950/30 text-sm text-red-400">
                    {addDayError}
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1.5">
                    Race Day
                  </label>
                  <select
                    value={selectedRaceDayId}
                    onChange={(e) => setSelectedRaceDayId(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-neutral-500 transition-colors"
                  >
                    {availableRaceDays.map((d) => (
                      <option key={d.raceDayId} value={d.raceDayId}>
                        {d.name} — {new Date(d.date).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1.5">
                    Seating Zone
                  </label>
                  <select
                    value={selectedZoneId}
                    onChange={(e) => setSelectedZoneId(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-neutral-500 transition-colors"
                  >
                    {zones.map((z) => (
                      <option key={z.seatingZoneId} value={z.seatingZoneId}>
                        {z.name} (×{z.priceMultiplier})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddDay(false)}
                    disabled={addingDay}
                    className="flex-1 py-2.5 border border-neutral-700 rounded-md text-sm font-semibold text-neutral-100 hover:border-neutral-500 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddDay}
                    disabled={addingDay}
                    className="flex-1 py-2.5 rounded-md text-sm font-semibold text-white transition-colors disabled:opacity-50"
                    style={{ backgroundColor: '#E8102A' }}
                    onMouseEnter={(e) =>
                      !addingDay && (e.currentTarget.style.backgroundColor = '#b50d22')
                    }
                    onMouseLeave={(e) =>
                      !addingDay && (e.currentTarget.style.backgroundColor = '#E8102A')
                    }
                  >
                    {addingDay ? 'Adding...' : 'Add Day'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
