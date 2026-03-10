import type { RaceDay, SeatingZone, Race } from '#/model/types'

type AppliedPromo = {
  code: string
  discountPercentage: number
} | null

type FinishPurchaseProps = {
  race: Race | null
  selectedDay: RaceDay | null
  selectedZone: SeatingZone | null
  appliedPromo: AppliedPromo
  currency: string
  handleSubmit: () => void
  loading?: boolean
}

export default function FinishPurchase({
  race,
  selectedDay,
  selectedZone,
  appliedPromo,
  currency,
  handleSubmit,
  loading = false,
}: FinishPurchaseProps) {
  // Calculate price: basePrice from race + dayPrice + (basePrice * priceMultiplier)
  const calculatePrice = () => {
    if (!race || !selectedDay || !selectedZone) return 0
    const dayPrice = selectedDay.dayPrice
    const zoneMultiplier = selectedZone.priceMultiplier
    return dayPrice * zoneMultiplier
  }

  const basePrice = calculatePrice()
  const discount = appliedPromo
    ? (basePrice * appliedPromo.discountPercentage) / 100
    : 0
  const total = basePrice - discount

  return (
    <section className="border border-dark-extreme rounded-lg p-5 max-w-5xl mx-auto mt-6">
      <h2
        className="text-4xl text-white font-extrabold uppercase tracking-wide mb-4"
        style={{ fontFamily: "'Barlow Condensed',sans-serif" }}
      >
        Order Summary
      </h2>

      {selectedDay && selectedZone ? (
        <>
          <div className="flex justify-between text-sm mb-2 text-accent-sage">
            <span>
              {selectedDay.name} — {selectedZone.name}
            </span>
            <span>
              {currency === 'EUR' ? '€' : currency}{basePrice.toFixed(2)}
            </span>
          </div>

          {appliedPromo && (
            <div className="flex justify-between text-sm text-green-500 mb-2">
              <span>Promo ({appliedPromo.code})</span>
              <span>-{currency === 'EUR' ? '€' : currency}{discount.toFixed(2)}</span>
            </div>
          )}

          <div className="h-px bg-dark-surface my-3" />
          <div className="flex justify-between items-baseline mb-5">
            <span className="text-md text-accent-sage font-bold ">Total</span>
            <span
              className="text-2xl font-extrabold text-white"
              style={{ fontFamily: "'Barlow Condensed',sans-serif" }}
            >
              {currency === 'EUR' ? '€' : currency}{total.toFixed(2)}
            </span>
          </div>
        </>
      ) : (
        <p className="text-md text-accent-sage mb-5">
          Select a race day and seating zone to see the price.
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || !selectedDay || !selectedZone}
        className="w-full py-3.5 rounded-md text-md cursor-pointer font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: '#E8102A' }}
        onMouseEnter={(e) =>
          !loading && (e.currentTarget.style.backgroundColor = '#b50d22')
        }
        onMouseLeave={(e) =>
          !loading && (e.currentTarget.style.backgroundColor = '#E8102A')
        }
      >
        {loading ? 'Processing...' : 'Complete Purchase'}
      </button>
    </section>
  )
}
