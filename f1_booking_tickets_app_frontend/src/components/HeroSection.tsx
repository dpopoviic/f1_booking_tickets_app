import { Link } from '@tanstack/react-router'
import type { RaceDay, RaceDetails } from '#/model/types'

type HeroSectionProps = {
  race: RaceDetails | null
  raceDays: RaceDay[]
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

export default function HeroSection({
  race,
  raceDays,
  loading,
  error,
}: HeroSectionProps) {
  const startDate = raceDays.length > 0 ? formatDateLabel(raceDays[0].date) : null
  const endDate =
    raceDays.length > 0 ? formatDateLabel(raceDays[raceDays.length - 1].date) : null
  const dateRange = startDate && endDate ? `${startDate} – ${endDate}` : 'Dates TBA'

  const raceDaysCount = raceDays.length
  const raceDayDescriptions = raceDays.map(
    (day) => `${day.name}: ${day.description}`,
  ).join('\n')

  return (
    <section className="relative min-h-130 flex items-center overflow-hidden bg-black">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(ferrari-hero.jpg)` }}
      />
      <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-black" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-8 py-20">
        <p className="mb-4 text-sm font-bold uppercase tracking-widest text-accent-red">
          {loading ? 'Loading schedule...' : dateRange}
        </p>
        <h1
          className="mb-6 max-w-3xl text-5xl font-black uppercase leading-none tracking-tight text-white md:text-6xl lg:text-7xl"
          style={{ fontStyle: 'italic' }}
        >
          {race?.name ?? 'Upcoming Formula 1 Weekend'}
        </h1>
        <div className="mb-6 flex flex-wrap items-center gap-6 text-sm text-accent-sage">
          <span className="flex items-center gap-1.5">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ff3b30"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {race?.location ?? 'Location TBA'}
          </span>
          <span className="flex items-center gap-1.5">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ff3b30"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {raceDaysCount} Race Days
          </span>
          {race && (
            <span className="flex items-center gap-1.5">From EUR {race.basePrice}</span>
          )}
        </div>
        <p className="mb-8 max-w-lg text-sm text-accent-sage whitespace-pre-line">
          {loading
            ? 'Preparing race details...'
            : raceDayDescriptions || 'Race day schedule will be available soon.'}
        </p>

        {error && <p className="mb-6 text-sm text-red-400">{error}</p>}

        {!loading && !error && !race && (
          <p className="mb-6 text-sm text-accent-sage">
            There are currently no upcoming races.
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to={`/purchase`}
            className="inline-block bg-accent-red px-8 py-3 text-sm font-black uppercase tracking-widest text-white transition hover:bg-accent-red/80 active:scale-95"
          >
            Buy Tickets
          </Link>
          <Link
            to={`/ticket`}
            className="inline-block border border-accent-sage px-8 py-3 text-sm font-black uppercase tracking-widest text-white transition hover:bg-white/10 hover:border-white active:scale-95"
          >
            Manage Your Ticket
          </Link>
        </div>
      </div>
    </section>
  )
}
