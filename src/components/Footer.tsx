import { Link } from '@tanstack/react-router'
import FormulaLogo from './icons/FormulaLogo'

export default function Footer() {
  return (
    <footer className="border-t bg-dark-extreme border-accent-sage px-4 pb-14 pt-10 text-accent-sage">
      <div className="mx-auto w-full max-w-7xl px-4 flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center flex-row gap-2 text-accent-sage text-sm font-bold"
        >
          <FormulaLogo width={30} height={30} />
          TICKETS
        </Link>
        <div className="mt-4 flex justify-center gap-4">
          <a
            href="https://www.instagram.com/f1/"
            target="_blank"
            rel="noreferrer"
            className="p-2 text-accent-sage transition hover:bg-dark-surface/80 hover:text-white"
          >
            <span className="sr-only">Follow F1 on Instagram</span>
            <svg viewBox="0 0 24 24" aria-hidden="true" width="24" height="24">
              <path
                fill="currentColor"
                d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3h10zm-5 3.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5zm0 2A2.5 2.5 0 1 1 9.5 12 2.5 2.5 0 0 1 12 9.5zM17.75 6a1.25 1.25 0 1 0 1.25 1.25A1.25 1.25 0 0 0 17.75 6z"
              />
            </svg>
          </a>
          <a
            href="https://www.tiktok.com/@f1"
            target="_blank"
            rel="noreferrer"
            className="p-2 text-accent-sage transition hover:bg-dark-surface/80 hover:text-white"
          >
            <span className="sr-only">Follow F1 on TikTok</span>
            <svg viewBox="0 0 24 24" aria-hidden="true" width="24" height="24">
              <path
                fill="currentColor"
                d="M19.589 6.686a4.793 4.793 0 0 1-3.77-1.88V15.36a6.56 6.56 0 1 1-5.682-6.502v3.27a3.29 3.29 0 1 0 2.412 3.162V.75h3.27a4.8 4.8 0 0 0 3.77 4.787v1.149z"
              />
            </svg>
          </a>
          <a
            href="https://x.com/F1"
            target="_blank"
            rel="noreferrer"
            className="p-2 text-accent-sage transition hover:bg-dark-surface/80 hover:text-white"
          >
            <span className="sr-only">Follow F1 on X</span>
            <svg viewBox="0 0 16 16" aria-hidden="true" width="24" height="24">
              <path
                fill="currentColor"
                d="M12.6 1h2.2L10 6.48 15.64 15h-4.41L7.78 9.82 3.23 15H1l5.14-5.84L.72 1h4.52l3.12 4.73L12.6 1zm-.77 12.67h1.22L4.57 2.26H3.26l8.57 11.41z"
              />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}
