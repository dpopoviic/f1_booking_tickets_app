import { createFileRoute } from '@tanstack/react-router'
import { RefreshCw } from 'lucide-react'
import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react'
import {
  reportsService,
  type TicketsByRaceDayReport,
  type TicketsByPurchaseDateReport,
} from '#/api/reportsService'

export const Route = createFileRoute('/reports/')({ component: App })

type ReportCardProps = {
  eyebrow: string
  title: string
  summary: string
  loading: boolean
  error: string | null
  onRefresh: () => Promise<void>
  children: ReactNode
}

function LoadingState() {
  return (
    <div className="flex h-full items-center justify-center gap-3 text-accent-sage">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-accent-red" />
      <span className="text-sm font-bold uppercase tracking-[0.2em]">
        Loading
      </span>
    </div>
  )
}

function formatDateLabel(dateString: string) {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) {
    return dateString
  }

  return date.toLocaleDateString('en-GB', {
    month: 'short',
    day: 'numeric',
  })
}

function formatFullDate(dateString: string) {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) {
    return dateString
  }

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('en-GB', {
    notation: value >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: value >= 1000 ? 1 : 0,
  }).format(value)
}

function compareDateStrings(left: string, right: string) {
  const leftTime = new Date(left).getTime()
  const rightTime = new Date(right).getTime()

  if (Number.isNaN(leftTime) || Number.isNaN(rightTime)) {
    return left.localeCompare(right)
  }

  return leftTime - rightTime
}

function getNiceStep(maxValue: number, tickCount: number) {
  const roughStep = maxValue / Math.max(tickCount - 1, 1)
  const magnitude = 10 ** Math.floor(Math.log10(Math.max(roughStep, 1)))
  const residual = roughStep / magnitude

  if (residual <= 1) {
    return magnitude
  }

  if (residual <= 2) {
    return 2 * magnitude
  }

  if (residual <= 5) {
    return 5 * magnitude
  }

  return 10 * magnitude
}

function buildChartScale(maxValue: number, tickCount = 4) {
  const safeMax = Math.max(maxValue, 1)
  const step = getNiceStep(safeMax, tickCount)
  const scaledMax = Math.ceil(safeMax / step) * step
  const ticks: number[] = []

  for (let value = 0; value <= scaledMax + step / 2; value += step) {
    ticks.push(value)
  }

  return { ticks, max: scaledMax }
}

function ReportCard({
  eyebrow,
  title,
  summary,
  loading,
  error,
  onRefresh,
  children,
}: ReportCardProps) {
  return (
    <article className="border border-white/10 bg-[#1a1a1a] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] transition duration-300 hover:border-accent-red/60">
      <header className="flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.28em] text-accent-red">
            {eyebrow}
          </p>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">
            {title}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-accent-sage">
            {summary}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            void onRefresh()
          }}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 self-start border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-white transition hover:border-accent-red hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </header>

      <div className="mt-5 h-72 bg-black/30 p-4 sm:p-5">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <div className="flex h-full items-center justify-center text-center text-sm font-medium text-accent-red">
            {error}
          </div>
        ) : (
          children
        )}
      </div>
    </article>
  )
}

function RaceDayBarChart({ data }: { data: TicketsByRaceDayReport[] }) {
  const bars = useMemo(
    () =>
      [...data]
        .sort((left, right) =>
          compareDateStrings(left.raceDayDate, right.raceDayDate),
        )
        .slice(0, 12),
    [data],
  )

  const totalTickets = useMemo(
    () => bars.reduce((total, item) => total + item.ticketCount, 0),
    [bars],
  )

  const peakDay = useMemo(
    () =>
      bars.reduce<TicketsByRaceDayReport | null>(
        (top, item) =>
          !top || item.ticketCount > top.ticketCount ? item : top,
        null,
      ),
    [bars],
  )

  if (!bars.length) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-accent-sage">
        No data yet
      </div>
    )
  }

  const svgWidth = 520
  const svgHeight = 220
  const leftPadding = 48
  const rightPadding = 16
  const topPadding = 12
  const bottomPadding = 44
  const chartWidth = svgWidth - leftPadding - rightPadding
  const chartHeight = svgHeight - topPadding - bottomPadding
  const gap = 14
  const barWidth = Math.max(
    (chartWidth - gap * (bars.length - 1)) / bars.length,
    18,
  )
  const scale = buildChartScale(
    Math.max(...bars.map((item) => item.ticketCount), 1),
  )

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="min-h-0 flex-1 w-full overflow-visible"
      >
        {scale.ticks.map((tick) => {
          const y = topPadding + chartHeight - (tick / scale.max) * chartHeight
          return (
            <g key={tick}>
              <line
                x1={leftPadding}
                y1={y}
                x2={svgWidth - rightPadding}
                y2={y}
                stroke="rgba(255,255,255,0.08)"
              />
              <text
                x={leftPadding - 10}
                y={y + 4}
                textAnchor="end"
                fill="rgba(255,255,255,0.45)"
                fontSize="11"
              >
                {formatCompactNumber(tick)}
              </text>
            </g>
          )
        })}

        {bars.map((item, index) => {
          const barHeight = (item.ticketCount / scale.max) * chartHeight
          const x = leftPadding + index * (barWidth + gap)
          const y = topPadding + chartHeight - barHeight
          const label = item.raceDayName || `Race Day ${item.raceDayId}`

          return (
            <g key={item.id}>
              <title>{`${label} (${formatFullDate(item.raceDayDate)}): ${item.ticketCount} tickets`}</title>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="rgba(255,59,48,0.92)"
                rx="2"
              />
              <text
                x={x + barWidth / 2}
                y={svgHeight - 20}
                textAnchor="middle"
                fill="rgba(255,255,255,0.65)"
                fontSize="11"
              >
                {formatDateLabel(item.raceDayDate)}
              </text>
              <text
                x={x + barWidth / 2}
                y={svgHeight - 6}
                textAnchor="middle"
                fill="rgba(255,255,255,0.38)"
                fontSize="10"
              >
                {label.slice(0, 8).toUpperCase()}
              </text>
            </g>
          )
        })}
      </svg>

      <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-4 text-left text-xs uppercase tracking-[0.18em] text-white/45">
        <div>
          <p className="mb-2 text-[10px]">Total Tickets</p>
          <p className="text-lg font-black tracking-normal text-white">
            {formatCompactNumber(totalTickets)}
          </p>
        </div>
        <div>
          <p className="mb-2 text-[10px]">Peak Day</p>
          <p className="text-sm font-black tracking-normal text-white">
            {peakDay?.raceDayName || '-'}
          </p>
        </div>
        <div>
          <p className="mb-2 text-[10px]">Peak Volume</p>
          <p className="text-lg font-black tracking-normal text-white">
            {peakDay ? formatCompactNumber(peakDay.ticketCount) : '-'}
          </p>
        </div>
      </div>
    </div>
  )
}

function PurchaseTrendChart({ data }: { data: TicketsByPurchaseDateReport[] }) {
  const points = useMemo(
    () =>
      [...data]
        .sort((left, right) =>
          compareDateStrings(left.purchaseDate, right.purchaseDate),
        )
        .slice(-14),
    [data],
  )

  const gradientId = useId().replace(/:/g, '')

  if (!points.length) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-accent-sage">
        No data yet
      </div>
    )
  }

  const totalTickets = points.reduce(
    (total, item) => total + item.ticketCount,
    0,
  )
  const peakPoint = points.reduce<TicketsByPurchaseDateReport | null>(
    (top, item) => (!top || item.ticketCount > top.ticketCount ? item : top),
    null,
  )
  const latestPoint = points[points.length - 1]

  const svgWidth = 520
  const svgHeight = 220
  const leftPadding = 48
  const rightPadding = 12
  const topPadding = 12
  const bottomPadding = 40
  const chartWidth = svgWidth - leftPadding - rightPadding
  const chartHeight = svgHeight - topPadding - bottomPadding
  const scale = buildChartScale(
    Math.max(...points.map((item) => item.ticketCount), 1),
  )
  const xStep = points.length > 1 ? chartWidth / (points.length - 1) : 0

  const coordinates = points.map((item, index) => {
    const x = leftPadding + index * xStep
    const y =
      topPadding + chartHeight - (item.ticketCount / scale.max) * chartHeight
    return { x, y }
  })

  const linePoints = coordinates
    .map((point) => `${point.x},${point.y}`)
    .join(' ')
  const areaPoints = `${leftPadding},${svgHeight - bottomPadding} ${linePoints} ${svgWidth - rightPadding},${svgHeight - bottomPadding}`
  const visibleTickIndexes = Array.from(
    new Set(
      [0, Math.floor((points.length - 1) / 2), points.length - 1].filter(
        (index) => index >= 0,
      ),
    ),
  )

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="min-h-0 flex-1 w-full overflow-visible"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,59,48,0.45)" />
            <stop offset="100%" stopColor="rgba(255,59,48,0)" />
          </linearGradient>
        </defs>

        {scale.ticks.map((tick) => {
          const y = topPadding + chartHeight - (tick / scale.max) * chartHeight
          return (
            <g key={tick}>
              <line
                x1={leftPadding}
                y1={y}
                x2={svgWidth - rightPadding}
                y2={y}
                stroke="rgba(255,255,255,0.08)"
              />
              <text
                x={leftPadding - 10}
                y={y + 4}
                textAnchor="end"
                fill="rgba(255,255,255,0.45)"
                fontSize="11"
              >
                {formatCompactNumber(tick)}
              </text>
            </g>
          )
        })}

        <polyline fill={`url(#${gradientId})`} points={areaPoints} />
        <polyline
          fill="none"
          stroke="rgb(255 59 48)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={linePoints}
        />

        {coordinates.map((point, index) => {
          const item = points[index]
          const isPeak = peakPoint?.id === item.id

          return (
            <g key={`${item.id}-${point.x}`}>
              <title>{`${formatFullDate(item.purchaseDate)}: ${item.ticketCount} tickets`}</title>
              <circle
                cx={point.x}
                cy={point.y}
                r={isPeak ? '5' : '4'}
                fill="rgb(255 59 48)"
                stroke="rgb(10 10 10)"
                strokeWidth="2"
              />
            </g>
          )
        })}

        {visibleTickIndexes.map((index) => (
          <text
            key={points[index].id}
            x={coordinates[index].x}
            y={svgHeight - 10}
            textAnchor="middle"
            fill="rgba(255,255,255,0.55)"
            fontSize="11"
          >
            {formatDateLabel(points[index].purchaseDate)}
          </text>
        ))}
      </svg>

      <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-4 text-left text-xs uppercase tracking-[0.18em] text-white/45">
        <div>
          <p className="mb-2 text-[10px]">Total Volume</p>
          <p className="text-lg font-black tracking-normal text-white">
            {formatCompactNumber(totalTickets)}
          </p>
        </div>
        <div>
          <p className="mb-2 text-[10px]">Peak Date</p>
          <p className="text-sm font-black tracking-normal text-white">
            {peakPoint ? formatDateLabel(peakPoint.purchaseDate) : '-'}
          </p>
        </div>
        <div>
          <p className="mb-2 text-[10px]">Latest Count</p>
          <p className="text-lg font-black tracking-normal text-white">
            {latestPoint ? formatCompactNumber(latestPoint.ticketCount) : '-'}
          </p>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [byRaceDay, setByRaceDay] = useState<TicketsByRaceDayReport[]>([])
  const [byPurchaseDate, setByPurchaseDate] = useState<
    TicketsByPurchaseDateReport[]
  >([])
  const [isRaceDayLoading, setIsRaceDayLoading] = useState(false)
  const [isPurchaseDateLoading, setIsPurchaseDateLoading] = useState(false)
  const [raceDayError, setRaceDayError] = useState<string | null>(null)
  const [purchaseDateError, setPurchaseDateError] = useState<string | null>(
    null,
  )

  const loadRaceDayReport = useCallback(async () => {
    try {
      setIsRaceDayLoading(true)
      setRaceDayError(null)
      const raceDayData = await reportsService.getByRaceDay()
      setByRaceDay(raceDayData)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load race day report'
      setRaceDayError(message)
    } finally {
      setIsRaceDayLoading(false)
    }
  }, [])

  const loadPurchaseDateReport = useCallback(async () => {
    try {
      setIsPurchaseDateLoading(true)
      setPurchaseDateError(null)
      const purchaseDateData = await reportsService.getByPurchaseDate()
      setByPurchaseDate(purchaseDateData)
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to load purchase date report'
      setPurchaseDateError(message)
    } finally {
      setIsPurchaseDateLoading(false)
    }
  }, [])

  useEffect(() => {
    void Promise.all([loadRaceDayReport(), loadPurchaseDateReport()])
  }, [loadPurchaseDateReport, loadRaceDayReport])

  const raceDaySummary = useMemo(() => {
    if (!byRaceDay.length) {
      return 'Snapshot of sold tickets grouped by race day from the portal reporting database.'
    }

    const total = byRaceDay.reduce((sum, item) => sum + item.ticketCount, 0)
    return `${formatCompactNumber(total)} tickets tracked across ${byRaceDay.length} recorded race day entries.`
  }, [byRaceDay])

  const purchaseSummary = useMemo(() => {
    if (!byPurchaseDate.length) {
      return 'Chronological ticket demand based on saved portal statistics by purchase date.'
    }

    const latest = byPurchaseDate[byPurchaseDate.length - 1]
    return `Latest recorded purchase date is ${formatFullDate(latest.purchaseDate)} with ${formatCompactNumber(latest.ticketCount)} tickets.`
  }, [byPurchaseDate])

  return (
    <main className="relative min-h-screen overflow-hidden bg-dark-surface py-16">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[60px_60px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,59,48,0.14),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_28%)]" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-accent-red">
            Portal Analytics
          </p>
          <h1
            className="text-4xl font-black uppercase leading-none tracking-tight text-white md:text-5xl"
            style={{ fontStyle: 'italic' }}
          >
            Reports Dashboard
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-accent-sage md:text-base">
            Live statistics persisted in the portal database, displayed in the
            same visual language as the rest of the booking app.
          </p>
        </div>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <ReportCard
            eyebrow="Race Day Breakdown"
            title="Tickets By Race Day"
            summary={raceDaySummary}
            loading={isRaceDayLoading}
            error={raceDayError}
            onRefresh={loadRaceDayReport}
          >
            <RaceDayBarChart data={byRaceDay} />
          </ReportCard>

          <ReportCard
            eyebrow="Purchase Momentum"
            title="Tickets By Purchase Date"
            summary={purchaseSummary}
            loading={isPurchaseDateLoading}
            error={purchaseDateError}
            onRefresh={loadPurchaseDateReport}
          >
            <PurchaseTrendChart data={byPurchaseDate} />
          </ReportCard>
        </section>
      </div>
    </main>
  )
}
