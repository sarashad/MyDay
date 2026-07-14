import { useQuery } from '@tanstack/react-query'
import { sparkApi } from '../../api/spark'

interface Props {
  compact?: boolean
}

export default function SparkHeatmap({ compact = false }: Props) {
  const { data: entries } = useQuery({
    queryKey: ['spark-heatmap'],
    queryFn: sparkApi.getHeatmap,
  })

  if (!entries) return null

  // Group by week for grid layout
  const weeks: { date: string; completed: boolean }[][] = []
  let week: { date: string; completed: boolean }[] = []

  // Pad first week with empty days
  const firstDay = new Date(entries[0].date).getDay()
  for (let i = 0; i < firstDay; i++) week.push({ date: '', completed: false })

  entries.forEach(entry => {
    week.push(entry)
    if (week.length === 7) { weeks.push(week); week = [] }
  })
  if (week.length > 0) weeks.push(week)

  return (
    <div className={`rounded-2xl bg-white border border-gray-100 ${compact ? 'px-4 py-3' : 'p-6 shadow-sm'}`}>

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          📅 Year Progress
        </h3>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm bg-gray-100" />
            <span>Not done</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm bg-violet-500" />
            <span>Completed</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex gap-[2px] w-full" style={{ height: '84px' }}>
        {weeks.map((w, wi) => (
          <div key={wi} className="flex flex-col gap-[2px] flex-1">
            {w.map((day, di) => (
              <div
                key={di}
                title={day.date}
                className={`aspect-square w-full rounded-sm ${
                  !day.date
                    ? 'bg-transparent'
                    : day.completed
                    ? 'bg-violet-500'
                    : 'bg-gray-100'
                }`}
              />
            ))}
          </div>
        ))}
      </div>

    </div>
  )
}