import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { todosApi } from '../api/todos'
import { habitsApi } from '../api/habits'
import { goalsApi } from '../api/goals'
import { sparkApi } from '../api/spark'
import { useAuthStore } from '../store/authStore'
import { Link } from 'react-router-dom'

export default function DashboardPage() {
  const { firstName } = useAuthStore()
  const today = new Date().toISOString().split('T')[0]
  const qc = useQueryClient()

  const { data: todos } = useQuery({ queryKey: ['todos'], queryFn: todosApi.getAll })
  const { data: habits } = useQuery({ queryKey: ['habits'], queryFn: habitsApi.getAll })
  const { data: goals } = useQuery({ queryKey: ['goals'], queryFn: goalsApi.getAll })
  const { data: spark } = useQuery({ queryKey: ['spark-today'], queryFn: sparkApi.getToday })
  const { data: streak } = useQuery({ queryKey: ['spark-streak'], queryFn: sparkApi.getStreak })
  const { data: heatmap } = useQuery({ queryKey: ['spark-heatmap'], queryFn: sparkApi.getHeatmap })

  const { mutate: complete, isPending } = useMutation({
    mutationFn: sparkApi.complete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['spark-today'] })
      qc.invalidateQueries({ queryKey: ['spark-streak'] })
      qc.invalidateQueries({ queryKey: ['spark-heatmap'] })
    },
  })

  const todayTodos = todos?.filter(t => {
    const date = t.dueDate ? t.dueDate.split('T')[0] : t.createdAt.split('T')[0]
    return date === today && !t.isCompleted
  }) ?? []
  const completedToday = todos?.filter(t => {
    const date = t.dueDate ? t.dueDate.split('T')[0] : t.createdAt.split('T')[0]
    return date === today && t.isCompleted
  }) ?? []
  const habitsCompleted = habits?.filter(h => h.completedToday).length ?? 0
  const habitsTotal = habits?.length ?? 0
  const activeGoals = goals?.filter(g => !g.isCompleted).length ?? 0

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const formatDate = () => new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  // Build heatmap weeks
  const weeks: { date: string; completed: boolean }[][] = []
  if (heatmap && heatmap.length > 0) {
    let week: { date: string; completed: boolean }[] = []
    const firstDay = new Date(heatmap[0].date).getDay()
    for (let i = 0; i < firstDay; i++) week.push({ date: '', completed: false })
    heatmap.forEach(entry => {
      week.push(entry)
      if (week.length === 7) { weeks.push(week); week = [] }
    })
    if (week.length > 0) weeks.push(week)
  }

  return (
    <div className="h-full flex flex-col gap-3 overflow-hidden">

      {/* ROW 1 — Greeting + Streak */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{greeting}, {firstName}! 👋</h1>
          <p className="text-gray-400 text-xs mt-0.5">{formatDate()}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span>🔥</span>
            <span className="font-bold text-orange-500 text-sm">{streak?.currentStreak ?? 0}</span>
            <span className="text-gray-400 text-xs">streak</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>⭐</span>
            <span className="font-bold text-yellow-500 text-sm">{streak?.longestStreak ?? 0}</span>
            <span className="text-gray-400 text-xs">best</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>✅</span>
            <span className="font-bold text-violet-500 text-sm">{streak?.totalCompleted ?? 0}</span>
            <span className="text-gray-400 text-xs">total</span>
          </div>
          {streak?.badges?.map(b => (
            <span key={b.key} title={`${b.name}: ${b.description}`} className="text-base cursor-default">{b.icon}</span>
          ))}
        </div>
      </div>

      {/* ROW 2 — Main grid */}
      <div className="flex gap-3 flex-1 min-h-0">

        {/* LEFT — SparkCard */}
        <div className={`w-64 flex-shrink-0 rounded-2xl p-4 flex flex-col border transition-all
          ${spark?.isCompleted
            ? 'bg-green-50 border-green-200'
            : 'bg-gradient-to-br from-violet-50 to-indigo-50 border-violet-200'}`}>
          <div className="flex items-center gap-2 mb-3">
            <span>✨</span>
            <span className="font-semibold text-violet-700 text-xs uppercase tracking-wide">Daily Spark</span>
            {spark?.isCompleted && (
              <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✅ Done!</span>
            )}
          </div>

          {spark ? (
            <div className="flex flex-col flex-1">
              <p className="text-gray-800 font-medium text-sm leading-relaxed mb-2">{spark.taskText}</p>
              <p className="text-gray-400 text-xs italic flex-1">"{spark.motivationalMessage}"</p>
              {!spark.isCompleted && (
                <button
                  onClick={() => complete()}
                  disabled={isPending}
                  className="mt-3 w-full py-2 rounded-xl bg-violet-600 text-white text-xs font-medium
                    hover:bg-violet-700 active:scale-95 transition-all disabled:opacity-50">
                  {isPending ? 'Saving...' : 'Mark as Done 🎯'}
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-violet-100 rounded animate-pulse" />
              <div className="h-3 bg-violet-100 rounded animate-pulse w-4/5" />
              <div className="h-3 bg-violet-100 rounded animate-pulse w-3/5" />
            </div>
          )}
        </div>

        {/* RIGHT — Stats + Todos + Habits */}
        <div className="flex-1 flex flex-col gap-3 min-h-0">

          {/* Stat boxes */}
          <div className="grid grid-cols-3 gap-3 flex-shrink-0">
            <div className="bg-violet-50 border border-violet-200 rounded-xl p-3">
              <p className="text-xs text-violet-500 font-medium uppercase tracking-wide">Todos</p>
              <p className="text-2xl font-bold text-violet-700">{todayTodos.length}</p>
              <p className="text-xs text-violet-400">{completedToday.length} completed</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
              <p className="text-xs text-orange-500 font-medium uppercase tracking-wide">Habits</p>
              <p className="text-2xl font-bold text-orange-700">{habitsCompleted}/{habitsTotal}</p>
              <p className="text-xs text-orange-400">done today</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
              <p className="text-xs text-blue-500 font-medium uppercase tracking-wide">Goals</p>
              <p className="text-2xl font-bold text-blue-700">{activeGoals}</p>
              <p className="text-xs text-blue-400">active</p>
            </div>
          </div>

          {/* Todos + Habits */}
          <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">

            {/* Todos */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-3 flex-shrink-0">
                <h2 className="font-semibold text-gray-800 text-sm">📋 Today's Todos</h2>
                <Link to="/todos" className="text-violet-500 text-xs hover:underline">View all</Link>
              </div>
              {todayTodos.length === 0 ? (
                <p className="text-gray-400 text-xs">No todos for today! 🎉</p>
              ) : (
                <div className="overflow-y-auto flex-1 space-y-2 min-h-0">
                  {todayTodos
                    .sort((a, b) => b.priority - a.priority)
                    .map(todo => (
                      <div key={todo.id} className="flex items-center gap-2 text-sm">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          todo.priority === 2 ? 'bg-red-400' :
                          todo.priority === 1 ? 'bg-orange-400' : 'bg-yellow-400'}`} />
                        <span className="text-gray-700 truncate text-xs">{todo.title}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Habits */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-3 flex-shrink-0">
                <h2 className="font-semibold text-gray-800 text-sm">💪 Habits</h2>
                <Link to="/habits" className="text-violet-500 text-xs hover:underline">View all</Link>
              </div>
              {habitsTotal === 0 ? (
                <p className="text-gray-400 text-xs">No habits yet!</p>
              ) : (
                <div className="overflow-y-auto flex-1 space-y-2 min-h-0">
                  {habits?.map(habit => (
                    <div key={habit.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="flex-shrink-0 text-sm">{habit.icon || '⭐'}</span>
                        <span className="text-gray-700 truncate text-xs">{habit.name}</span>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${
                        habit.completedToday ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {habit.completedToday ? '✓' : `${habit.todayCount}/${habit.targetCount}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ROW 3 — Heatmap inline (no separate component) */}
      <div className="flex-shrink-0 bg-white rounded-2xl border border-gray-100 px-4 py-2">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">📅 Year Progress</span>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-gray-200" />Not done</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-violet-500" />Completed</div>
          </div>
        </div>
        <div className="flex gap-[2px] w-full" style={{ height: '58px' }}>
          {weeks.map((w, wi) => (
            <div key={wi} className="flex flex-col gap-[2px] flex-1">
              {w.map((day, di) => (
                <div key={di} title={day.date}
                  className={`flex-1 w-full rounded-sm ${
                    !day.date ? 'bg-transparent' :
                    day.completed ? 'bg-violet-500' : 'bg-gray-100'}`} />
              ))}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}