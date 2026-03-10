import { useState } from 'react'
import { RedBtn, Field, Input } from './SharedUI'
import { PlusIcon, EditIcon, TrashIcon } from './icons/Icons'
import { Modal, ConfirmDelete } from './Modal'

type RaceDay = {
  id: number
  name: string
  date: string
  basePrice: number
  description: string
}

type RaceDayForm = {
  id?: number
  name: string
  date: string
  basePrice: number | string
  description: string
}

type ModalState = {
  mode: 'add' | 'edit'
  data: RaceDayForm
} | null

type TabProps = {
  showToast: (msg: string) => void
}

const INIT_RACE_DAYS: RaceDay[] = [
  {
    id: 1,
    name: 'Practice Day',
    date: '2025-05-23',
    basePrice: 120,
    description: 'Practice sessions',
  },
  {
    id: 2,
    name: 'Qualifying Day',
    date: '2025-05-24',
    basePrice: 180,
    description: 'Qualifying sessions',
  },
]

export default function TabRaceDays({ showToast }: TabProps) {
  const [days, setDays] = useState<RaceDay[]>(INIT_RACE_DAYS)
  const [modal, setModal] = useState<ModalState>(null)
  const [deleteTarget, setDeleteTarget] = useState<RaceDay | null>(null)

  const openAdd = () =>
    setModal({
      mode: 'add',
      data: { name: '', date: '', basePrice: '', description: '' },
    })

  const openEdit = (d: RaceDay) =>
    setModal({
      mode: 'edit',
      data: { ...d },
    })

  const handleSave = () => {
    if (!modal) return
    if (!modal.data.name || !modal.data.date) return

    if (modal.mode === 'add') {
      const newDay: RaceDay = {
        id: Date.now(),
        name: modal.data.name,
        date: modal.data.date,
        basePrice: Number(modal.data.basePrice),
        description: modal.data.description,
      }

      setDays((p) => [...p, newDay])
      showToast('Race day added!')
    } else {
      setDays((p) =>
        p.map((d) =>
          d.id === modal.data.id
            ? {
                id: d.id,
                name: modal.data.name,
                date: modal.data.date,
                basePrice: Number(modal.data.basePrice),
                description: modal.data.description,
              }
            : d,
        ),
      )

      showToast('Race day updated!')
    }

    setModal(null)
  }

  const handleDelete = () => {
    if (!deleteTarget) return

    setDays((p) => p.filter((d) => d.id !== deleteTarget.id))
    setDeleteTarget(null)
    showToast('Race day deleted.')
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

        <RedBtn onClick={openAdd}>
          <PlusIcon /> Add Race Day
        </RedBtn>
      </div>

      <div className="md:hidden space-y-3">
        {days.map((d) => (
          <div
            key={d.id}
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
                <span className="text-neutral-500">Date:</span> {d.date}
              </p>

              <p>
                <span className="text-neutral-500">Base Price:</span>{' '}
                <span className="text-white font-semibold">€{d.basePrice}</span>
              </p>

              <p className="text-neutral-500">{d.description}</p>
            </div>
          </div>
        ))}

        {days.length === 0 && (
          <p className="text-center text-neutral-500 py-6">
            No race days added yet.
          </p>
        )}
      </div>

      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800">
              {['Name', 'Date', 'Base Price', 'Description', 'Actions'].map(
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
            {days.map((d) => (
              <tr
                key={d.id}
                className="border-b border-neutral-800/60 hover:bg-neutral-800/20 transition-colors"
              >
                <td className="py-3.5 pr-4 font-semibold text-white">
                  {d.name}
                </td>

                <td className="py-3.5 pr-4 text-neutral-400">{d.date}</td>

                <td className="py-3.5 pr-4 font-semibold text-white">
                  €{d.basePrice}
                </td>

                <td className="py-3.5 pr-4 text-neutral-400">
                  {d.description}
                </td>

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
                <td
                  colSpan={5}
                  className="py-8 text-center text-neutral-600 text-sm"
                >
                  No race days added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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

          <Field label="Base Price (€)">
            <Input
              type="number"
              value={modal.data.basePrice}
              onChange={set('basePrice')}
              placeholder="120"
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
