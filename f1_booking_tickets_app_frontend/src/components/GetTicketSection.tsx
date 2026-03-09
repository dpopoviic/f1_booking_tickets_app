import { Link } from '@tanstack/react-router'

export default function GetTicketSection() {
  return (
    <section className="bg-dark-surface py-20 text-center">
      <div className="mx-auto max-w-2xl px-8 my-10">
        <h2 className="mb-4 text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
          Ready for the Race?
        </h2>
        <p className="mb-10 text-sm leading-relaxed text-accent-sage">
          Secure your spot at the most thrilling motorsport event of the year.
          Choose your preferred days and seating zones.
        </p>
        <Link
          to="/purchase"
          className="inline-block bg-accent-red px-10 py-4 text-sm font-black uppercase tracking-widest text-white transition hover:bg-accent-red/80 active:scale-95"
        >
          Get Your Tickets Now
        </Link>
      </div>
    </section>
  )
}
