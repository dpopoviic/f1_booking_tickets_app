import type { RaceDay } from '#/model/types'

type RaceDaySectionProps = {
  raceDays: RaceDay[]
  raceName?: string
  loading: boolean
  error: string
}

function formatDateLabel(dateValue: string): string {
  return new Date(dateValue).toLocaleDateString('en-GB', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function RaceDaySection({
  raceDays,
  raceName,
  loading,
  error,
}: RaceDaySectionProps) {
  const showEmptyState = !loading && !error && raceDays.length === 0

  const skeletonCards = [1, 2, 3]

  const sectionDescription = raceName
    ? `Days for ${raceName}`
    : 'Upcoming race schedule'

  return (
    <section className="relative bg-[#111] py-20">
      <div className="absolute inset-0 h-full w-full bg-dark-extreme bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[60px_60px]" />

      <div className="relative mx-auto w-full max-w-7xl px-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-red-500">
          Schedule
        </p>
        <h2 className="mb-2 text-4xl font-black uppercase tracking-tight text-white">
          Race Days
        </h2>
        <p className="mb-10 text-sm text-white/60">{sectionDescription}</p>

        {error && <p className="mb-6 text-sm text-red-400">{error}</p>}

        {loading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {skeletonCards.map((cardId) => (
              <div
                key={cardId}
                className="border border-white/10 bg-[#1a1a1a] p-5 animate-pulse"
              >
                <div className="mb-4 flex items-start justify-between">
                  <span className="h-12 w-12 bg-white/10" />
                  <span className="h-4 w-24 bg-white/10" />
                </div>
                <div className="mb-2 h-5 w-36 bg-white/10" />
                <div className="mb-6 h-4 w-full bg-white/10" />
                <div className="h-4 w-24 bg-white/10" />
              </div>
            ))}
          </div>
        )}

        {showEmptyState && (
          <p className="text-sm text-white/60">No upcoming race days are available yet.</p>
        )}

        {!loading && raceDays.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {raceDays.map((day, index) => (
              <div
                key={day.raceDayId}
                className="border border-white/10 bg-[#1a1a1a] p-5 transition hover:border-accent-red hover:-translate-y-1 duration-400"
              >
                <div className="mb-4 flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center bg-accent-red/20 text-xl font-semibold text-accent-red">
                    {index + 1}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-widest text-white/40">
                    {formatDateLabel(day.date)}
                  </span>
                </div>

                <h3 className="mb-1 text-base font-black uppercase tracking-wide text-white">
                  {day.name}
                </h3>
                <p className="mb-6 text-sm text-white/50">{day.description}</p>

                <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                  <span className="text-xs text-white/40">Starting from</span>
                  <span className="text-lg font-black text-white">EUR {day.dayPrice}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
