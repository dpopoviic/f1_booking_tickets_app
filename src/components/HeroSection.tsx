import { Link } from '@tanstack/react-router'

const race = {
  RaceId: 1,
  Name: 'Formula 1 Monaco Grand Prix 2026',
  Location: 'Monaco',
  BasePrice: 120,
  DiscountDeadline: 'May 20, 2025',
  CreatedAt: '2025-01-01',
  UpdatedAt: '2025-03-01',
  RaceDays: [
    {
      RaceDayId: 1,
      Date: '2025-05-23',
      Name: 'Practice Day',
      Description: 'Practice sessions',
      DayPrice: 120,
      Capacity: 5000,
      SoldTickets: 1200,
      CreatedAt: '2025-01-05',
      UpdatedAt: '2025-03-01',
    },
    {
      RaceDayId: 2,
      Date: '2025-05-24',
      Name: 'Qualifying Day',
      Description: 'Qualifying sessions',
      DayPrice: 180,
      Capacity: 5000,
      SoldTickets: 1500,
      CreatedAt: '2025-01-05',
      UpdatedAt: '2025-03-01',
    },
  ],
}

export default function HeroSection() {
  const raceDates = race.RaceDays.map((day) => new Date(day.Date).getTime())

  const startDate = new Date(Math.min(...raceDates)).toLocaleDateString(
    'en-GB',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    },
  )

  const endDate = new Date(Math.max(...raceDates)).toLocaleDateString('en-GB', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const raceDaysCount = race.RaceDays.length
  const raceDayDescriptions = race.RaceDays.map(
    (day) => `${day.Name}: ${day.Description}`,
  ).join(' | ')

  return (
    <section className="relative min-h-130 flex items-center overflow-hidden bg-black">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(ferrari-hero.jpg)` }}
      />
      <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-black" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-8 py-20">
        <p className="mb-4 text-sm font-bold uppercase tracking-widest text-accent-red">
          {startDate} – {endDate}
        </p>
        <h1
          className="mb-6 max-w-3xl text-5xl font-black uppercase leading-none tracking-tight text-white md:text-6xl lg:text-7xl"
          style={{ fontStyle: 'italic' }}
        >
          {race.Name}
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
            {race.Location}
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
        </div>
        <p className="mb-8 max-w-lg text-sm text-accent-sage">
          {raceDayDescriptions}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to={`/ticket`}
            className="inline-block bg-accent-red px-8 py-3 text-sm font-black uppercase tracking-widest text-white transition hover:bg-accent-red/80 active:scale-95"
          >
            Buy Tickets
          </Link>
          <Link
            to={`/ticket`}
            className="inline-block border border-white/60 px-8 py-3 text-sm font-black uppercase tracking-widest text-white transition hover:bg-white/10 active:scale-95"
          >
            Manage Your Ticket
          </Link>
        </div>
      </div>
    </section>
  )
}
