import { useState } from 'react'
import { RedBtn, Field, Input } from './SharedUI'
import { SaveIcon } from './icons/Icons'

type TabProps = {
  showToast: (msg: string) => void
}

type DiscountsData = {
  earlyBird: number | string
  endDate: string
  currencies: string
}

const INIT_DISCOUNTS: DiscountsData = {
  earlyBird: 10,
  endDate: '2025-05-01',
  currencies: 'EUR, USD, GBP',
}

export function TabDiscounts({ showToast }: TabProps) {
  const [data, setData] = useState<DiscountsData>(INIT_DISCOUNTS)

  const set =
    (k: keyof DiscountsData) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setData((p) => ({ ...p, [k]: e.target.value }))

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2
          className="font-bold uppercase tracking-widest text-white text-xl"
          style={{ fontFamily: "'Barlow Condensed',sans-serif" }}
        >
          Discounts & Currencies
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Field label="Early Bird Discount (%)">
          <Input
            type="number"
            value={data.earlyBird}
            onChange={set('earlyBird')}
            placeholder="10"
          />
        </Field>

        <Field label="Discount End Date">
          <Input type="date" value={data.endDate} onChange={set('endDate')} />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Allowed Currencies (comma-separated)">
            <Input
              value={data.currencies}
              onChange={set('currencies')}
              placeholder="EUR, USD, GBP"
            />
            <p className="text-xs text-neutral-600 mt-1.5">
              Supported currencies: EUR, USD, GBP, RSD, CHF, JPY, etc.
            </p>
          </Field>
        </div>
      </div>

      <div className="h-px bg-neutral-800 mb-4" />

      <div className="flex justify-start">
        <RedBtn onClick={() => showToast('Settings saved!')}>
          <SaveIcon /> Save Changes
        </RedBtn>
      </div>
    </div>
  )
}
