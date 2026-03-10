import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  GearIcon,
  CalIcon,
  PinIcon2,
  DollarIcon,
} from '../../components/icons/Icons'
import { TabEventInfo } from '../../components/TabEventInfo'
import TabRaceDays from '../../components/TabRaceDay'
import { TabZones } from '../../components/TabZones'
import { TabDiscounts } from '../../components/TabDiscountsCurrencies'

export const Route = createFileRoute('/admin/')({ component: App })

type ToastProps = {
  msg: string | null
}
function Toast({ msg }: ToastProps) {
  if (!msg) return null
  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm font-medium border border-green-600/50 shadow-2xl"
      style={{ backgroundColor: '#1a1a1a' }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6" fill="#22c55e" />
        <path
          d="M4 7l2.5 2.5 4-4"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-neutral-100">{msg}</span>
    </div>
  )
}

const TABS = [
  { key: 'event', label: 'Event Info', icon: <GearIcon /> },
  { key: 'days', label: 'Race Days', icon: <CalIcon /> },
  { key: 'zones', label: 'Zones', icon: <PinIcon2 /> },
  { key: 'discounts', label: 'Discounts & Currencies', icon: <DollarIcon /> },
] as const

type TabKey = (typeof TABS)[number]['key']

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('days')
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  return (
    <div className="bg-dark-surface">
      <div className="min-h-screen w-full px-6 py-8 max-w-5xl mx-auto bg-dark-surface">
        <h1
          className="lg:text-4xl text-2xl font-extrabold uppercase tracking-wide mb-6 text-white"
          style={{ fontFamily: "'Barlow Condensed',sans-serif" }}
        >
          Administration
        </h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map((t) => {
            const active = activeTab === t.key
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold border transition-all duration-200
                  ${active ? 'text-white border-transparent' : 'text-neutral-400 border-neutral-700 bg-transparent hover:border-neutral-500 hover:text-neutral-200'}`}
                style={
                  active
                    ? { backgroundColor: '#E8102A', borderColor: '#E8102A' }
                    : {}
                }
              >
                {t.icon}
                {t.label}
              </button>
            )
          })}
        </div>

        <div
          className="border border-neutral-800 rounded-xl p-6"
          style={{ backgroundColor: '#121212' }}
        >
          {activeTab === 'event' && <TabEventInfo showToast={showToast} />}
          {activeTab === 'days' && <TabRaceDays showToast={showToast} />}
          {activeTab === 'zones' && <TabZones showToast={showToast} />}
          {activeTab === 'discounts' && <TabDiscounts showToast={showToast} />}
        </div>
      </div>

      <Toast msg={toast} />
    </div>
  )
}
