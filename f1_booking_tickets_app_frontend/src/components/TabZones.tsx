import { useEffect, useState } from 'react'
import { raceService } from '#/api/raceService'
import { seatingZoneService } from '#/api/seatingZoneService'
import type { Race, SeatingZone } from '#/model/types'
import { RedBtn, Field, Input } from './SharedUI'
import { PlusIcon, EditIcon, TrashIcon } from './icons/Icons'
import { Modal, ConfirmDelete } from './Modal'

type ZoneForm = {
  seatingZoneId?: number
  name: string
  capacity: number | string
  priceMultiplier: number | string
}

type ModalState = {
  mode: 'add' | 'edit'
  data: ZoneForm
} | null

type TabProps = {
  showToast: (msg: string) => void
}

export function TabZones({ showToast }: TabProps) {
  const [races, setRaces] = useState<Race[]>([])
  const [selectedRaceId, setSelectedRaceId] = useState<number | null>(null)
  const [zones, setZones] = useState<SeatingZone[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<ModalState>(null)
  const [deleteTarget, setDeleteTarget] = useState<SeatingZone | null>(null)

  const loadRaces = async () => {
    try {
      const data = await raceService.getAll()
      setRaces(data)

      if (data.length === 0) {
        setSelectedRaceId(null)
        setZones([])
        return
      }

      setSelectedRaceId((current) => {
        if (current && data.some((r) => r.raceId === current)) return current
        return data[0].raceId
      })
    } catch (error) {
      console.error('Failed to fetch races:', error)
      showToast('Failed to load races.')
    }
  }

  const loadZones = async (raceId: number) => {
    setLoading(true)
    try {
      const data = await seatingZoneService.getByRaceId(raceId)
      setZones(data)
    } catch (error) {
      console.error('Failed to fetch zones:', error)
      setZones([])
      showToast('Failed to load zones.')
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
      setZones([])
      return
    }
    loadZones(selectedRaceId)
  }, [selectedRaceId])

  const openAdd = () =>
    setModal({
      mode: 'add',
      data: { name: '', capacity: '', priceMultiplier: '' },
    })

  const openEdit = (z: SeatingZone) =>
    setModal({
      mode: 'edit',
      data: {
        seatingZoneId: z.seatingZoneId,
        name: z.name,
        capacity: z.capacity,
        priceMultiplier: z.priceMultiplier,
      },
    })

  const handleSave = async () => {
    if (!modal || !selectedRaceId) return
    if (!modal.data.name) return

    try {
      if (modal.mode === 'add') {
        await seatingZoneService.create({
          raceId: selectedRaceId,
          name: modal.data.name,
          capacity: Number(modal.data.capacity),
          priceMultiplier: Number(modal.data.priceMultiplier),
        })
        showToast('Zone added!')
      } else {
        await seatingZoneService.update({
          zoneId: Number(modal.data.seatingZoneId),
          name: modal.data.name,
          capacity: Number(modal.data.capacity),
          priceMultiplier: Number(modal.data.priceMultiplier),
        })
        showToast('Zone updated!')
      }

      setModal(null)
      await loadZones(selectedRaceId)
    } catch (error) {
      console.error('Failed to save zone:', error)
      showToast('Failed to save zone.')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget || !selectedRaceId) return

    try {
      await seatingZoneService.delete(deleteTarget.seatingZoneId)
      setDeleteTarget(null)
      showToast('Zone deleted.')
      await loadZones(selectedRaceId)
    } catch (error) {
      console.error('Failed to delete zone:', error)
      showToast('Failed to delete zone.')
    }
  }

  const set =
    (k: keyof ZoneForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
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
          Seating Zones
        </h2>

        <RedBtn onClick={openAdd}>
          <PlusIcon /> Add Zone
        </RedBtn>
      </div>

      {/* Race selector */}
      <div className="mb-5">
        <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1.5">
          Select Race
        </label>
        <select
          value={selectedRaceId ?? ''}
          onChange={(e) => setSelectedRaceId(Number(e.target.value) || null)}
          className="w-full sm:w-64 bg-neutral-900 border border-neutral-700 text-white text-sm rounded-md px-3 py-2 focus:outline-none focus:border-neutral-500"
        >
          {races.length === 0 && <option value="">No races available</option>}
          {races.map((r) => (
            <option key={r.raceId} value={r.raceId}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-neutral-400">Loading zones...</p>}

      {!loading && (
        <>
          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {zones.map((z) => (
              <div
                key={z.seatingZoneId}
                className="border border-neutral-800 rounded-lg p-4 bg-neutral-900/40"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-white">{z.name}</h3>

                  <div className="flex gap-3">
                    <button
                      onClick={() => openEdit(z)}
                      className="text-neutral-400 hover:text-white"
                    >
                      <EditIcon />
                    </button>

                    <button
                      onClick={() => setDeleteTarget(z)}
                      className="text-neutral-400 hover:text-red-400"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>

                <div className="text-sm text-neutral-400 space-y-1">
                  <p>
                    <span className="text-neutral-500">Capacity:</span> {z.capacity}
                  </p>

                  <p>
                    <span className="text-neutral-500">Price Multiplier:</span>{' '}
                    <span className="text-white font-semibold">x{z.priceMultiplier}</span>
                  </p>
                </div>
              </div>
            ))}

            {zones.length === 0 && (
              <p className="text-center text-neutral-500 py-6">
                No zones added yet.
              </p>
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-800">
                  {['Name', 'Capacity', 'Price Multiplier', 'Actions'].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left text-xs font-bold uppercase tracking-widest text-neutral-500 pb-3 pr-4"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>

              <tbody>
                {zones.map((z) => (
                  <tr
                    key={z.seatingZoneId}
                    className="border-b border-neutral-800/60 hover:bg-neutral-800/20 transition-colors"
                  >
                    <td className="py-3.5 pr-4 font-semibold text-white">
                      {z.name}
                    </td>

                    <td className="py-3.5 pr-4 text-neutral-400">
                      {z.capacity}
                    </td>

                    <td className="py-3.5 pr-4 font-semibold text-white">
                      x{z.priceMultiplier}
                    </td>

                    <td className="py-3.5">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openEdit(z)}
                          className="text-neutral-500 hover:text-neutral-200"
                        >
                          <EditIcon />
                        </button>

                        <button
                          onClick={() => setDeleteTarget(z)}
                          className="text-neutral-500 hover:text-red-400"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {zones.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-8 text-center text-neutral-600 text-sm"
                    >
                      No zones added yet.
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
          title={modal.mode === 'add' ? 'Add Zone' : 'Edit Zone'}
          onClose={() => setModal(null)}
          onSave={handleSave}
        >
          <Field label="Name">
            <Input
              value={modal.data.name}
              onChange={set('name')}
              placeholder="VIP Grandstand"
            />
          </Field>

          <Field label="Capacity">
            <Input
              type="number"
              value={modal.data.capacity}
              onChange={set('capacity')}
              placeholder="100"
            />
          </Field>

          <Field label="Price Multiplier">
            <Input
              type="number"
              value={modal.data.priceMultiplier}
              onChange={set('priceMultiplier')}
              placeholder="1.5"
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
