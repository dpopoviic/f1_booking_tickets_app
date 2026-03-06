export default function RaceDaySection() {
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
  return (
    <section className="relative bg-[#111] py-20">
      <div className="absolute inset-0 h-full w-full bg-dark-extreme bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[60px_60px]" />

      <div className="relative mx-auto w-full max-w-7xl px-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-red-500">
          Schedule
        </p>
        <h2 className="mb-10 text-4xl font-black uppercase tracking-tight text-white">
          Race Days
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {race.RaceDays.map((day) => (
            <div
              key={day.RaceDayId}
              className="border border-white/10 bg-[#1a1a1a] p-5 transition hover:border-accent-red hover:-translate-y-1 duration-400"
            >
              <div className="mb-4 flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center bg-accent-red/20 text-xl font-semibold text-accent-red">
                  {day.RaceDayId}
                </span>
                <span className="text-xs font-medium uppercase tracking-widest text-white/40">
                  {new Date(day.Date).toLocaleDateString('en-GB', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <h3 className="mb-1 text-base font-black uppercase tracking-wide text-white">
                {day.Name}
              </h3>
              <p className="mb-6 text-sm text-white/50">{day.Description}</p>

              <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                <span className="text-xs text-white/40">Starting from</span>
                <span className="text-lg font-black text-white">
                  €{day.DayPrice}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
