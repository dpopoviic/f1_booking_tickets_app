import { VALID_PROMOS } from './PromoCode'
import { RACE_DAYS } from './SelectRaceDay'
import { SEATING_ZONES } from './SelectSeat'

type FinishPurchaseProps = {
  selectedDay: (typeof RACE_DAYS)[number] | null
  selectedZone: (typeof SEATING_ZONES)[number] | null
  appliedPromo: (typeof VALID_PROMOS)[number] | null
  handleSubmit: () => void
}

export default function FinishPurchase({
  selectedDay,
  selectedZone,
  appliedPromo,
  handleSubmit,
}: FinishPurchaseProps) {
  const basePrice =
    selectedDay && selectedZone
      ? selectedDay.dayPrice + selectedZone.priceModifier
      : 0
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
              €{(selectedDay.dayPrice + selectedZone.priceModifier).toFixed(2)}
            </span>
          </div>

          {appliedPromo && (
            <div className="flex justify-between text-sm text-green-500 mb-2">
              <span>Promo ({appliedPromo.code})</span>
              <span>-€{discount.toFixed(2)}</span>
            </div>
          )}

          <div className="h-px bg-dark-surface my-3" />
          <div className="flex justify-between items-baseline mb-5">
            <span className="text-md text-accent-sage font-bold ">Total</span>
            <span
              className="text-2xl font-extrabold text-white"
              style={{ fontFamily: "'Barlow Condensed',sans-serif" }}
            >
              €{total.toFixed(2)}
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
        className="w-full py-3.5 rounded-md text-md cursor-pointer font-semibold text-white transition-all duration-200"
        style={{ backgroundColor: '#E8102A' }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = '#b50d22')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = '#E8102A')
        }
      >
        Complete Purchase
      </button>
    </section>
  )
}
