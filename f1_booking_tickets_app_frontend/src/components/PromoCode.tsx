import { useState } from 'react'

type Promo = {
  code: string
  discountPercentage: number
  status: 'Active' | 'Inactive'
  expiryDate: string
}

type PromoMsg = {
  ok: boolean
  text: string
}

export const VALID_PROMOS: Promo[] = [
  {
    code: 'MONACO10',
    discountPercentage: 10,
    status: 'Active',
    expiryDate: '2026-12-31',
  },
  {
    code: 'F1FAN5',
    discountPercentage: 5,
    status: 'Active',
    expiryDate: '2025-12-31',
  },
]

type PromoCodeProps = {
  appliedPromo: Promo | null
  setAppliedPromo: React.Dispatch<React.SetStateAction<Promo | null>>
}

export default function PromoCode({
  appliedPromo,
  setAppliedPromo,
}: PromoCodeProps) {
  const [promoInput, setPromoInput] = useState<string>('')
  const [promoMsg, setPromoMsg] = useState<PromoMsg | null>(null)

  const applyPromo = () => {
    const promo = VALID_PROMOS.find(
      (p) => p.code.toUpperCase() === promoInput.toUpperCase(),
    )

    if (!promo) {
      setPromoMsg({ ok: false, text: 'Invalid promo code.' })
      return
    }

    const today = new Date()
    const expiry = new Date(promo.expiryDate)

    if (promo.status !== 'Active' || expiry < today) {
      setPromoMsg({ ok: false, text: 'Promo code is expired or inactive.' })
      return
    }

    setAppliedPromo(promo)
    setPromoMsg({
      ok: true,
      text: `Promo code applied! ${promo.discountPercentage}% off.`,
    })
  }

  const removePromo = () => {
    setAppliedPromo(null)
    setPromoInput('')
    setPromoMsg(null)
  }

  return (
    <section className="max-w-5xl mx-auto p-6 bg-transparent rounded-lg mt-6">
      <h2
        className="text-4xl text-white font-extrabold uppercase tracking-wide mb-1"
        style={{ fontFamily: "'Barlow Condensed',sans-serif" }}
      >
        Promo Code
      </h2>
      <p className="text-md text-accent-sage mb-4">
        Have a discount code? Enter it below.
      </p>

      <div className="flex gap-2.5">
        <input
          className="flex-1 bg-neutral-900 border border-accent-sage text-white rounded-md px-3.5 py-3 text-sm outline-none focus:border-accent-sage/50 transition-colors placeholder:text-accent-sage disabled:opacity-40"
          placeholder="e.g. MONACO10"
          value={promoInput}
          onChange={(e) => {
            setPromoInput(e.target.value)
            setPromoMsg(null)
          }}
          disabled={!!appliedPromo}
        />
        <button
          onClick={appliedPromo ? removePromo : applyPromo}
          className="cursor-pointer px-5 py-3 border border-accent-sage text-white rounded-md text-sm font-semibold hover:border-accent-sage/50 transition-colors whitespace-nowrap"
        >
          {appliedPromo ? 'Remove' : 'Apply'}
        </button>
      </div>

      {promoMsg && (
        <p
          className={`text-xs mt-2 ${promoMsg.ok ? 'text-green-500' : 'text-red-500'}`}
        >
          {promoMsg.text}
        </p>
      )}
    </section>
  )
}
