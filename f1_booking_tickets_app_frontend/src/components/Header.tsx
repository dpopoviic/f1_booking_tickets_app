import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import FormulaLogo from './icons/FormulaLogo'
import TicketsSvg from './icons/TicketsSvg'
import AdminSvg from './icons/AdminSvg'
import ReportsSvg from './icons/ReportsSvg'

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-accent-sage/30 bg-dark-extreme backdrop-blur-lg">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-white text-sm"
          onClick={() => setOpen(false)}
        >
          <FormulaLogo />
          TICKETS
        </Link>

        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/ticket"
            className="px-3 py-2 hover:bg-dark-surface/80 flex items-center gap-1.5"
          >
            <TicketsSvg />
            <span className="text-sm text-accent-sage font-bold">
              Manage Ticket
            </span>
          </Link>

          <Link
            to="/admin"
            className="px-3 py-2 hover:bg-dark-surface/80 flex items-center gap-1.5"
          >
            <AdminSvg />
            <span className="text-sm text-accent-sage font-bold">Admin</span>
          </Link>

          <Link
            to="/reports"
            className="px-3 py-2 hover:bg-dark-surface/80 flex items-center gap-1.5"
          >
            <ReportsSvg />
            <span className="text-sm text-accent-sage font-bold">Reports</span>
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1"
        >
          <span className="w-5 h-0.5 bg-white"></span>
          <span className="w-5 h-0.5 bg-white"></span>
          <span className="w-5 h-0.5 bg-white"></span>
        </button>
      </nav>

      {open && (
        <div className="fixed top-16 left-0 w-full h-[calc(100vh-4rem)] z-40 bg-black/80 backdrop-blur-md md:hidden">
          <div className="flex flex-col p-4 gap-2 bg-dark-extreme border-t border-accent-sage/20">
            <Link
              to="/ticket"
              className="px-3 py-3 hover:bg-dark-surface/80 flex items-center gap-2"
              onClick={() => setOpen(false)}
            >
              <TicketsSvg />
              <span className="text-sm text-accent-sage font-bold">
                Manage Ticket
              </span>
            </Link>

            <Link
              to="/admin"
              className="px-3 py-3 hover:bg-dark-surface/80 flex items-center gap-2"
              onClick={() => setOpen(false)}
            >
              <AdminSvg />
              <span className="text-sm text-accent-sage font-bold">Admin</span>
            </Link>

            <Link
              to="/reports"
              className="px-3 py-3 hover:bg-dark-surface/80 flex items-center gap-2"
              onClick={() => setOpen(false)}
            >
              <ReportsSvg />
              <span className="text-sm text-accent-sage font-bold">
                Reports
              </span>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
