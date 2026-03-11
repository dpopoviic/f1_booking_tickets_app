import { useEffect, useState } from 'react'
import { raceService } from '#/api/raceService'
import { raceDayService } from '#/api/raceDayService'
import type { Race, RaceDay } from '#/model/types'
import { RedBtn, Field, Input } from './SharedUI'
import { PlusIcon, EditIcon, TrashIcon } from './icons/Icons'
import { Modal, ConfirmDelete } from './Modal'

type RaceDayForm = {
  raceDayId?: number
  name: string
  date: string
  dayPrice: number | string
  capacity: number | string
  description: string
}

type ModalState = {
  mode: 'add' | 'edit'
  data: RaceDayForm
} | null

type TabProps = {
  showToast: (msg: string) => void
}

function toDateInputValue(value: string) {
  return value.includes('T') ? value.split('T')[0] : value
}

export default function TabRaceDays({ showToast }: TabProps) {
  const [races, setRaces] = useState<Race[]>([])
  const [selectedRaceId, setSelectedRaceId] = useState<number | null>(null)
  const [days, setDays] = useState<RaceDay[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<ModalState>(null)
  const [deleteTarget, setDeleteTarget] = useState<RaceDay | null>(null)

  const loadRaces = async () => {
    try {
      const data = await raceService.getAll()
      setRaces(data)

      if (data.length === 0) {
        setSelectedRaceId(null)
        setDays([])
        return
      }

      setSelectedRaceId((current) => {
        if (current && data.some((race) => race.raceId === current)) {
          return current
        }

        return data[0].raceId
      })
    } catch (error) {
      console.error('Failed to fetch races:', error)
      showToast('Failed to load races.')
    }
  }

  const loadDays = async (raceId: number) => {
    setLoading(true)

    try {
      const data = await raceDayService.getByRaceId(raceId)
      setDays(data)
    } catch (error) {
      console.error('Failed to fetch race days:', error)
      setDays([])
      showToast('Failed to load race days.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRaces()
  }, [])

  useEffect(() => {
    if (!selectedRaceId) {
      setLoading(false)
      setDays([])
      return
    }

    loadDays(selectedRaceId)
  }, [selectedRaceId])

  const openAdd = () =>
    setModal({
      mode: 'add',
      data: { name: '', date: '', dayPrice: '', capacity: '', description: '' },
    })

  const openEdit = (d: RaceDay) =>
    setModal({
      mode: 'edit',
      data: {
        raceDayId: d.raceDayId,
        name: d.name,
        date: toDateInputValue(d.date),
        dayPrice: d.dayPrice,
        capacity: d.capacity,
        description: d.description,
      },
    })

  const handleSave = async () => {
    if (!modal) return
    if (!selectedRaceId || !modal.data.name || !modal.data.date) return

    try {
      if (modal.mode === 'add') {
        await raceDayService.create({
          raceId: selectedRaceId,
          name: modal.data.name,
          date: modal.data.date,
          dayPrice: Number(modal.data.dayPrice),
          capacity: Number(modal.data.capacity),
          description: modal.data.description,
        })
        showToast('Race day added!')
      } else {
        await raceDayService.update({
          raceDayId: Number(modal.data.raceDayId),
          name: modal.data.name,
          date: modal.data.date,
          dayPrice: Number(modal.data.dayPrice),
          capacity: Number(modal.data.capacity),
          description: modal.data.description,
        })
        showToast('Race day updated!')
      }

      setModal(null)
      await loadDays(selectedRaceId)
      await loadRaces()
    } catch (error) {
      console.error('Failed to save race day:', error)
      showToast('Failed to save race day.')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      await raceDayService.delete(deleteTarget.raceDayId)
      setDeleteTarget(null)
      showToast('Race day deleted.')

      if (selectedRaceId) {
        await loadDays(selectedRaceId)
        await loadRaces()
      }
    } catch (error) {
      console.error('Failed to delete race day:', error)
      showToast('Failed to delete race day.')
    }
  }

  const set =
    (k: keyof RaceDayForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
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
          Race Days
        </h2>

        <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-3">
          <select
            value={selectedRaceId ?? ''}
            onChange={(e) => setSelectedRaceId(Number(e.target.value) || null)}
            className="bg-neutral-900 border border-neutral-700 rounded-md px-3.5 py-2.5 text-sm text-neutral-100 outline-none focus:border-neutral-500 transition-colors"
          >
            {races.map((race) => (
              <option key={race.raceId} value={race.raceId}>
                {race.name}
              </option>
            ))}
          </select>

          <RedBtn onClick={openAdd}>
            <PlusIcon /> Add Race Day
          </RedBtn>
        </div>
      </div>

      {!selectedRaceId && (
        <p className="text-neutral-500 py-6">Create a race first to manage race days.</p>
      )}

      {loading && selectedRaceId && <p className="text-neutral-400">Loading race days...</p>}

      {selectedRaceId && !loading && (
        <>
          <div className="md:hidden space-y-3">
            {days.map((d) => (
              <div
                key={d.raceDayId}
                className="border border-neutral-800 rounded-lg p-4 bg-neutral-900/40"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-white">{d.name}</h3>

                  <div className="flex gap-3">
                    <button
                      onClick={() => openEdit(d)}
                      className="text-neutral-400 hover:text-white"
                    >
                      <EditIcon />
                    </button>

                    <button
                      onClick={() => setDeleteTarget(d)}
                      className="text-neutral-400 hover:text-red-400"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>

                <div className="text-sm text-neutral-400 space-y-1">
                  <p>
                    <span className="text-neutral-500">Date:</span> {toDateInputValue(d.date)}
                  </p>

                  <p>
                    <span className="text-neutral-500">Base Price:</span>{' '}
                    <span className="text-white font-semibold">EUR {d.dayPrice}</span>
                  </p>

                  <p>
                    <span className="text-neutral-500">Capacity:</span> {d.capacity}
                  </p>

                  <p className="text-neutral-500">{d.description}</p>
                </div>
              </div>
            ))}

            {days.length === 0 && (
              <p className="text-center text-neutral-500 py-6">No race days added yet.</p>
            )}
          </div>

          <div className="hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-800">
                  {['Name', 'Date', 'Base Price', 'Capacity', 'Description', 'Actions'].map((h) => (
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
                {days.map((d) => (
                  <tr
                    key={d.raceDayId}
                    className="border-b border-neutral-800/60 hover:bg-neutral-800/20 transition-colors"
                  >
                    <td className="py-3.5 pr-4 font-semibold text-white">{d.name}</td>
                    <td className="py-3.5 pr-4 text-neutral-400">{toDateInputValue(d.date)}</td>
                    <td className="py-3.5 pr-4 font-semibold text-white">EUR {d.dayPrice}</td>
                    <td className="py-3.5 pr-4 text-neutral-400">{d.capacity}</td>
                    <td className="py-3.5 pr-4 text-neutral-400">{d.description}</td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openEdit(d)}
                          className="text-neutral-500 hover:text-neutral-200"
                        >
                          <EditIcon />
                        </button>

                        <button
                          onClick={() => setDeleteTarget(d)}
                          className="text-neutral-500 hover:text-red-400"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {days.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-neutral-600 text-sm">
                      No race days added yet.
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
          title={modal.mode === 'add' ? 'Add Race Day' : 'Edit Race Day'}
          onClose={() => setModal(null)}
          onSave={handleSave}
        >
          <Field label="Name">
            <Input
              value={modal.data.name}
              onChange={set('name')}
              placeholder="Practice Day"
            />
          </Field>

          <Field label="Date">
            <Input type="date" value={modal.data.date} onChange={set('date')} />
          </Field>

          <Field label="Base Price (EUR)">
            <Input
              type="number"
              value={modal.data.dayPrice}
              onChange={set('dayPrice')}
              placeholder="120"
            />
          </Field>

          <Field label="Capacity">
            <Input
              type="number"
              value={modal.data.capacity}
              onChange={set('capacity')}
              placeholder="1000"
            />
          </Field>

          <Field label="Description">
            <Input
              value={modal.data.description}
              onChange={set('description')}
              placeholder="Practice sessions"
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
