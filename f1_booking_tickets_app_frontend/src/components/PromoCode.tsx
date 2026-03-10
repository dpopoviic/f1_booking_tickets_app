import { useState } from 'react'
import { promoService } from '#/api/promoService'

type PromoResult = {
  code: string
  discountPercentage: number
}

type PromoMsg = {
  ok: boolean
  text: string
}

type PromoCodeProps = {
  appliedPromo: PromoResult | null
  setAppliedPromo: React.Dispatch<React.SetStateAction<PromoResult | null>>
}

export default function PromoCode({
  appliedPromo,
  setAppliedPromo,
}: PromoCodeProps) {
  const [promoInput, setPromoInput] = useState<string>('')
  const [promoMsg, setPromoMsg] = useState<PromoMsg | null>(null)
  const [loading, setLoading] = useState(false)

  const applyPromo = async () => {
    if (!promoInput.trim()) {
      setPromoMsg({ ok: false, text: 'Please enter a promo code.' })
      return
    }

    setLoading(true)
    setPromoMsg(null)

    try {
      const result = await promoService.validate(promoInput.trim())
      
      if (!result.isValid) {
        setPromoMsg({ ok: false, text: result.message || 'Invalid promo code.' })
        return
      }

      setAppliedPromo({
        code: promoInput.trim().toUpperCase(),
        discountPercentage: result.discountPercentage || 0,
      })
      setPromoMsg({
        ok: true,
        text: `Promo code applied! ${result.discountPercentage}% off.`,
      })
    } catch (error) {
      console.error('Error validating promo code:', error)
      setPromoMsg({ ok: false, text: 'Failed to validate promo code. Please try again.' })
    } finally {
      setLoading(false)
    }
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
          disabled={!!appliedPromo || loading}
        />
        <button
          onClick={appliedPromo ? removePromo : applyPromo}
          disabled={loading}
          className="cursor-pointer px-5 py-3 border border-accent-sage text-white rounded-md text-sm font-semibold hover:border-accent-sage/50 transition-colors whitespace-nowrap disabled:opacity-50"
        >
          {loading ? 'Validating...' : appliedPromo ? 'Remove' : 'Apply'}
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
