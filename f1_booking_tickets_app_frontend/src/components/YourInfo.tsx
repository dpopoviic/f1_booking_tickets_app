import { useState } from 'react'
import { SUPPORTED_CURRENCIES } from '#/model/types'

export type FieldKey =
  | 'firstName'
  | 'lastName'
  | 'address'
  | 'postalCode'
  | 'city'
  | 'country'
  | 'email'
  | 'emailConfirmation'
  | 'phoneNumber'

export type FormState = Record<FieldKey, string>
type ErrorState = Partial<Record<FieldKey, string>>

const FIELDS: {
  key: FieldKey
  label: string
  placeholder: string
  full?: boolean
  type?: string
}[] = [
  { key: 'firstName', label: 'First Name', placeholder: 'John' },
  { key: 'lastName', label: 'Last Name', placeholder: 'Doe' },
  {
    key: 'address',
    label: 'Address',
    placeholder: '123 Main Street',
    full: true,
  },
  { key: 'postalCode', label: 'Postal Code', placeholder: '12345' },
  { key: 'city', label: 'City', placeholder: 'Monaco' },
  { key: 'country', label: 'Country', placeholder: 'Monaco' },
  {
    key: 'email',
    label: 'Email',
    placeholder: 'john@example.com',
    type: 'email',
  },
  {
    key: 'emailConfirmation',
    label: 'Confirm Email',
    placeholder: 'john@example.com',
    type: 'email',
  },
  { key: 'phoneNumber', label: 'Phone Number', placeholder: '+33 123 456 789' },
]

type YourInfoProps = {
  form: FormState
  setForm: React.Dispatch<React.SetStateAction<FormState>>
  currency: string
  setCurrency: (currency: string) => void
}

export default function YourInfo({ form, setForm, currency, setCurrency }: YourInfoProps) {
  const [errors, setErrors] = useState<ErrorState>({})

  const handleChange = (key: FieldKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))

    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    }
  }

  return (
    <section className="max-w-5xl mx-auto p-6 bg-transparent rounded-lg mt-6">
      <h2
        className="text-4xl text-white font-extrabold uppercase tracking-wide mb-1"
        style={{ fontFamily: "'Barlow Condensed',sans-serif" }}
      >
        Your Information
      </h2>
      <p className="text-md text-accent-sage mb-4">
        Please provide your contact details.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {FIELDS.map(({ key, label, placeholder, full, type }) => (
          <div key={key} className={full ? 'sm:col-span-2' : ''}>
            <label className="block text-sm text-accent-sage mb-1.5">
              {label} <span className="text-accent-red">*</span>
            </label>
            <input
              type={type || 'text'}
              placeholder={placeholder}
              value={form[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              className={`w-full bg-dark-surface border rounded-md px-3.5 py-3 text-sm text-white outline-none transition-colors placeholder:text-accent-sage
                ${errors[key] ? 'border-accent-red' : 'border-accent-sage/70 focus:border-accent-sage/50'}`}
            />
            {errors[key] && (
              <p className="text-xs text-accent-red mt-1">{errors[key]}</p>
            )}
          </div>
        ))}

        {/* Currency Dropdown */}
        <div>
          <label className="block text-sm text-accent-sage mb-1.5">
            Currency <span className="text-accent-red">*</span>
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full bg-dark-surface border border-accent-sage/70 rounded-md px-3.5 py-3 text-sm text-white outline-none transition-colors focus:border-accent-sage/50"
          >
            {SUPPORTED_CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  )
}
