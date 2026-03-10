import { useState } from 'react'
import { RedBtn, Field, Input } from './SharedUI'
import { PlusIcon, EditIcon, TrashIcon } from './icons/Icons'
import { Modal, ConfirmDelete } from './Modal'

type Zone = {
  id: number
  name: string
  capacity: number
  available: number
  priceModifier: number
  characteristics: string
}

type ZoneForm = {
  id?: number
  name: string
  capacity: number | string
  available: number | string
  priceModifier: number | string
  characteristics: string
}

type ModalState = {
  mode: 'add' | 'edit'
  data: ZoneForm
} | null

type TabProps = {
  showToast: (msg: string) => void
}

const INIT_ZONES: Zone[] = [
  {
    id: 1,
    name: 'VIP Grandstand',
    capacity: 100,
    available: 98,
    priceModifier: 50,
    characteristics: 'Premium view, hospitality included',
  },
  {
    id: 2,
    name: 'General Admission',
    capacity: 500,
    available: 497,
    priceModifier: 0,
    characteristics: 'Great atmosphere',
  },
]

export function TabZones({ showToast }: TabProps) {
  const [zones, setZones] = useState<Zone[]>(INIT_ZONES)
  const [modal, setModal] = useState<ModalState>(null)
  const [deleteTarget, setDeleteTarget] = useState<Zone | null>(null)

  const openAdd = () =>
    setModal({
      mode: 'add',
      data: {
        name: '',
        capacity: '',
        available: '',
        priceModifier: '',
        characteristics: '',
      },
    })

  const openEdit = (z: Zone) =>
    setModal({
      mode: 'edit',
      data: { ...z },
    })

  const handleSave = () => {
    if (!modal) return
    if (!modal.data.name) return

    const parsed: Zone = {
      id: modal.data.id ?? Date.now(),
      name: modal.data.name,
      capacity: Number(modal.data.capacity),
      available: Number(modal.data.available),
      priceModifier: Number(modal.data.priceModifier),
      characteristics: modal.data.characteristics,
    }

    if (modal.mode === 'add') {
      setZones((p) => [...p, parsed])
      showToast('Zone added!')
    } else {
      setZones((p) => p.map((z) => (z.id === parsed.id ? parsed : z)))
      showToast('Zone updated!')
    }

    setModal(null)
  }

  const handleDelete = () => {
    if (!deleteTarget) return

    setZones((p) => p.filter((z) => z.id !== deleteTarget.id))
    setDeleteTarget(null)
    showToast('Zone deleted.')
  }

  const set = (k: keyof ZoneForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
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

      <div className="md:hidden space-y-3">
        {zones.map((z) => (
          <div
            key={z.id}
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
                <span className="text-neutral-500">Available:</span>{' '}
                <span
                  className={`font-semibold ${
                    z.available > 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {z.available}
                </span>
              </p>

              <p>
                <span className="text-neutral-500">Price:</span>{' '}
                {z.priceModifier === 0 ? '+€0' : `+€${z.priceModifier}`}
              </p>

              <p className="text-neutral-500">{z.characteristics}</p>
            </div>
          </div>
        ))}

        {zones.length === 0 && (
          <p className="text-center text-neutral-500 py-6">
            No zones added yet.
          </p>
        )}
      </div>

      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800">
              {[
                'Name',
                'Capacity',
                'Available',
                'Price Modifier',
                'Characteristics',
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
            {zones.map((z) => (
              <tr
                key={z.id}
                className="border-b border-neutral-800/60 hover:bg-neutral-800/20 transition-colors"
              >
                <td className="py-3.5 pr-4 font-semibold text-white">
                  {z.name}
                </td>

                <td className="py-3.5 pr-4 text-neutral-400">{z.capacity}</td>

                <td className="py-3.5 pr-4">
                  <span
                    className={`font-semibold ${
                      z.available > 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {z.available}
                  </span>
                </td>

                <td className="py-3.5 pr-4 font-semibold text-white">
                  {z.priceModifier === 0 ? '+€0' : `+€${z.priceModifier}`}
                </td>

                <td className="py-3.5 pr-4 text-neutral-400">
                  {z.characteristics}
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
                  colSpan={6}
                  className="py-8 text-center text-neutral-600 text-sm"
                >
                  No zones added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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

          <div className="grid grid-cols-2 gap-3">
            <Field label="Capacity">
              <Input
                type="number"
                value={modal.data.capacity}
                onChange={set('capacity')}
                placeholder="100"
              />
            </Field>

            <Field label="Available">
              <Input
                type="number"
                value={modal.data.available}
                onChange={set('available')}
                placeholder="98"
              />
            </Field>
          </div>

          <Field label="Price Modifier (€)">
            <Input
              type="number"
              value={modal.data.priceModifier}
              onChange={set('priceModifier')}
              placeholder="50"
            />
          </Field>

          <Field label="Characteristics">
            <Input
              value={modal.data.characteristics}
              onChange={set('characteristics')}
              placeholder="Premium view, hospitality included"
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
