import { useState } from 'react'
import { Field, Input, RedBtn } from './SharedUI'
import { SaveIcon } from './icons/Icons'

type TabProps = {
  showToast: (msg: string) => void
}

const INIT_EVENT = {
  name: 'Monaco Grand Prix 2025',
  location: 'Circuit de Monaco, Monaco',
  startDate: '2025-05-23',
  endDate: '2025-05-25',
  description: 'The most prestigious Formula 1 race in the world.',
}

export function TabEventInfo({ showToast }: TabProps) {
  const [data, setData] = useState(INIT_EVENT)
  const set = (k: any) => (e: any) =>
    setData((p) => ({ ...p, [k]: e.target.value }))

  return (
    <div className="bg-dark-surface">
      <div className="flex items-center justify-between mb-5 bg-dark-surface">
        <h2
          className="font-bold uppercase tracking-widest text-white text-xl "
          style={{ fontFamily: "'Barlow Condensed',sans-serif" }}
        >
          Event Information
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Field label="Event Name">
          <Input
            value={data.name}
            onChange={set('name')}
            placeholder="Grand Prix Name"
          />
        </Field>
        <Field label="Location">
          <Input
            value={data.location}
            onChange={set('location')}
            placeholder="Circuit, City"
          />
        </Field>
        <Field label="Start Date">
          <Input
            type="date"
            value={data.startDate}
            onChange={set('startDate')}
          />
        </Field>
        <Field label="End Date">
          <Input type="date" value={data.endDate} onChange={set('endDate')} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Description">
            <textarea
              value={data.description}
              onChange={set('description')}
              rows={3}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3.5 py-2.5 text-sm text-neutral-100 outline-none focus:border-neutral-500 transition-colors placeholder:text-neutral-600 resize-none"
            />
          </Field>
        </div>
      </div>
      <div className="flex justify-end pt-2 border-t border-neutral-800">
        <RedBtn onClick={() => showToast('Event info saved!')}>
          <SaveIcon /> Save Changes
        </RedBtn>
      </div>
    </div>
  )
}
