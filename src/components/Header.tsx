import { Link } from '@tanstack/react-router'
import FormulaLogo from './icons/FormulaLogo'
import TicketsSvg from './icons/TicketsSvg'
import AdminSvg from './icons/AdminSvg'
import ResultsSvg from './icons/ResultsSvg'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-accent-sage bg-dark-extreme backdrop-blur-lg">
      <nav className="mx-auto w-full max-w-7xl px-4 flex h-16 items-center justify-between gap-4">
        <h2 className="">
          <Link
            to="/"
            className="flex items-center flex-row gap-2 font-bold text-white text-sm"
          >
            <FormulaLogo />
            TICKETS
          </Link>
        </h2>

        <div className="ml-auto flex items-center gap-1.5 sm:ml-0 sm:gap-2">
          <Link
            to="/ticket"
            className="rounded-md px-3 py-2 hover:bg-dark-surface/80 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-accent-sage flex flex-row items-center gap-1.5"
          >
            <TicketsSvg />
            <span className="text-sm text-accent-sage font-bold">
              Manage Ticket
            </span>
          </Link>
          <Link
            to="/admin"
            className="rounded-md px-3 py-2 hover:bg-dark-surface/80 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-accent-sage flex flex-row items-center gap-1.5"
          >
            <AdminSvg />
            <span className="text-sm text-accent-sage font-bold">Admin</span>
          </Link>
          <Link
            to="/results"
            className="rounded-md px-3 py-2 hover:bg-dark-surface/80 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-accent-sage flex flex-row items-center gap-1.5"
          >
            <ResultsSvg />
            <span className="text-sm text-accent-sage font-bold">Results</span>
          </Link>
        </div>
      </nav>
    </header>
  )
}
