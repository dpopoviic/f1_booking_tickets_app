import { useEffect, useState } from 'react'
import { raceService } from '#/api/raceService'
import type { Race } from '#/model/types'
import { RedBtn, Field, Input } from './SharedUI'
import { PlusIcon, EditIcon, TrashIcon } from './icons/Icons'
import { Modal, ConfirmDelete } from './Modal'

type TabProps = {
  showToast: (msg: string) => void
}

type RaceForm = {
  raceId?: number
  name: string
  location: string
  basePrice: number | string
  discountDeadline: string
}

type ModalState = {
  mode: 'add' | 'edit'
  data: RaceForm
} | null

function toDateInputValue(value?: string) {
  if (!value) {
    return ''
  }

  return value.includes('T') ? value.split('T')[0] : value
}

function formatDate(value?: string) {
  const normalized = toDateInputValue(value)
  return normalized || '-'
}

export function TabRaces({ showToast }: TabProps) {
  const [races, setRaces] = useState<Race[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<ModalState>(null)
  const [deleteTarget, setDeleteTarget] = useState<Race | null>(null)

  const loadRaces = async () => {
    setLoading(true)

    try {
      const data = await raceService.getAll()
      setRaces(data)
    } catch (error) {
      console.error('Failed to fetch races:', error)
      showToast('Failed to load races.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRaces()
  }, [])

  const openAdd = () =>
    setModal({
      mode: 'add',
      data: {
        name: '',
        location: '',
        basePrice: '',
        discountDeadline: '',
      },
    })

  const openEdit = (race: Race) =>
    setModal({
      mode: 'edit',
      data: {
        raceId: race.raceId,
        name: race.name,
        location: race.location,
        basePrice: race.basePrice,
        discountDeadline: toDateInputValue(race.discountDeadline),
      },
    })

  const handleSave = async () => {
    if (!modal) {
      return
    }

    if (!modal.data.name || !modal.data.location || !modal.data.basePrice) {
      return
    }

    try {
      if (modal.mode === 'add') {
        await raceService.create({
          name: modal.data.name,
          location: modal.data.location,
          basePrice: Number(modal.data.basePrice),
          discountDeadline: modal.data.discountDeadline || null,
        })
        showToast('Race added!')
      } else {
        await raceService.update({
          raceId: Number(modal.data.raceId),
          name: modal.data.name,
          location: modal.data.location,
          basePrice: Number(modal.data.basePrice),
          discountDeadline: modal.data.discountDeadline || null,
        })
        showToast('Race updated!')
      }

      setModal(null)
      await loadRaces()
    } catch (error) {
      console.error('Failed to save race:', error)
      showToast('Failed to save race.')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) {
      return
    }

    try {
      await raceService.delete(deleteTarget.raceId)
      setDeleteTarget(null)
      showToast('Race deleted.')
      await loadRaces()
    } catch (error) {
      console.error('Failed to delete race:', error)
      showToast('Failed to delete race.')
    }
  }

  const set =
    (k: keyof RaceForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setModal((p) =>
        p
          ? {
              ...p,
              data: { ...p.data, [k]: e.target.value },
            }
          : p,
      )

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <h2
          className="font-bold uppercase tracking-widest text-white text-xl"
          style={{ fontFamily: "'Barlow Condensed',sans-serif" }}
        >
          Races
        </h2>

        <RedBtn onClick={openAdd}>
          <PlusIcon /> Add Race
        </RedBtn>
      </div>

      {loading && <p className="text-neutral-400">Loading races...</p>}

      {!loading && (
        <>
          <div className="md:hidden space-y-3">
            {races.map((race) => (
              <div
                key={race.raceId}
                className="border border-neutral-800 rounded-lg p-4 bg-neutral-900/40"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-white">{race.name}</h3>

                  <div className="flex gap-3">
                    <button
                      onClick={() => openEdit(race)}
                      className="text-neutral-400 hover:text-white"
                    >
                      <EditIcon />
                    </button>

                    <button
                      onClick={() => setDeleteTarget(race)}
                      className="text-neutral-400 hover:text-red-400"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>

                <div className="text-sm text-neutral-400 space-y-1">
                  <p>
                    <span className="text-neutral-500">Location:</span>{' '}
                    {race.location}
                  </p>

                  <p>
                    <span className="text-neutral-500">Base Price:</span>{' '}
                    <span className="text-white font-semibold">€{race.basePrice}</span>
                  </p>

                  <p>
                    <span className="text-neutral-500">Start Date:</span>{' '}
                    {formatDate(race.startDate)}
                  </p>

                  <p>
                    <span className="text-neutral-500">Early Bird Until:</span>{' '}
                    {formatDate(race.discountDeadline)}
                  </p>
                </div>
              </div>
            ))}

            {races.length === 0 && (
              <p className="text-center text-neutral-500 py-6">No races added yet.</p>
            )}
          </div>

          <div className="hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-800">
                  {[
                    'Name',
                    'Location',
                    'Base Price',
                    'Start Date',
                    'Early Bird Until',
                    'Actions',
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-bold uppercase tracking-widest text-neutral-500 pb-3 pr-4"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {races.map((race) => (
                  <tr
                    key={race.raceId}
                    className="border-b border-neutral-800/60 hover:bg-neutral-800/20 transition-colors"
                  >
                    <td className="py-3.5 pr-4 font-semibold text-white">{race.name}</td>
                    <td className="py-3.5 pr-4 text-neutral-400">{race.location}</td>
                    <td className="py-3.5 pr-4 font-semibold text-white">€{race.basePrice}</td>
                    <td className="py-3.5 pr-4 text-neutral-400">{formatDate(race.startDate)}</td>
                    <td className="py-3.5 pr-4 text-neutral-400">
                      {formatDate(race.discountDeadline)}
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openEdit(race)}
                          className="text-neutral-500 hover:text-neutral-200"
                        >
                          <EditIcon />
                        </button>

                        <button
                          onClick={() => setDeleteTarget(race)}
                          className="text-neutral-500 hover:text-red-400"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {races.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-neutral-600 text-sm">
                      No races added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {modal && (
        <Modal
          title={modal.mode === 'add' ? 'Add Race' : 'Edit Race'}
          onClose={() => setModal(null)}
          onSave={handleSave}
        >
          <Field label="Name">
            <Input value={modal.data.name} onChange={set('name')} placeholder="Monaco Grand Prix" />
          </Field>

          <Field label="Location">
            <Input value={modal.data.location} onChange={set('location')} placeholder="Monaco" />
          </Field>

          <Field label="Base Price (EUR)">
            <Input
              type="number"
              value={modal.data.basePrice}
              onChange={set('basePrice')}
              placeholder="120"
            />
          </Field>

          <Field label="Early Bird Deadline (optional)">
            <Input
              type="date"
              value={modal.data.discountDeadline}
              onChange={set('discountDeadline')}
            />
          </Field>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDelete
          label={deleteTarget.name}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}
