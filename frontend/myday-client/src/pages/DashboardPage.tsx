import { useQuery } from '@tanstack/react-query'
import { todosApi } from '../api/todos'
import { habitsApi } from '../api/habits'
import { goalsApi } from '../api/goals'
import { useAuthStore } from '../store/authStore'
import { Link } from 'react-router-dom'

export default function DashboardPage() {
  const { firstName } = useAuthStore()
  const today = new Date().toISOString().split('T')[0]

  const { data: todos } = useQuery({ queryKey: ['todos'], queryFn: todosApi.getAll })
  const { data: habits } = useQuery({ queryKey: ['habits'], queryFn: habitsApi.getAll })
  const { data: goals } = useQuery({ queryKey: ['goals'], queryFn: goalsApi.getAll })

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
  const completedGoals = goals?.filter(g => g.isCompleted).length ?? 0

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const formatDate = () => now.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <div>
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {greeting}, {firstName}! 👋
        </h1>
        <p className="text-gray-500 mt-1">{formatDate()}</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
          <p className="text-xs text-violet-600 font-medium uppercase tracking-wide">Today's Todos</p>
          <p className="text-3xl font-bold text-violet-700 mt-1">{todayTodos.length}</p>
          <p className="text-xs text-violet-500 mt-1">{completedToday.length} completed</p>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <p className="text-xs text-orange-600 font-medium uppercase tracking-wide">Habits</p>
          <p className="text-3xl font-bold text-orange-700 mt-1">{habitsCompleted}/{habitsTotal}</p>
          <p className="text-xs text-orange-500 mt-1">done today</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Active Goals</p>
          <p className="text-3xl font-bold text-blue-700 mt-1">{activeGoals}</p>
          <p className="text-xs text-blue-500 mt-1">{completedGoals} completed</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-xs text-green-600 font-medium uppercase tracking-wide">Streak 🔥</p>
          <p className="text-3xl font-bold text-green-700 mt-1">
            {Math.max(...(habits?.map(h => h.currentStreak) ?? [0]))}
          </p>
          <p className="text-xs text-green-500 mt-1">best streak days</p>
        </div>
      </div>

      {/* Today's todos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">📋 Today's Todos</h2>
            <Link to="/todos" className="text-violet-600 text-sm hover:underline">View all</Link>
          </div>
          {todayTodos.length === 0 ? (
            <p className="text-gray-400 text-sm">No todos for today! 🎉</p>
          ) : (
            <div className="space-y-2">
              {todayTodos
  .sort((a, b) => b.priority - a.priority)
  .slice(0, 5).map(todo => (
  <div key={todo.id} className="flex items-center gap-2 text-sm">
    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
      todo.priority === 2 ? 'bg-red-400' :
      todo.priority === 1 ? 'bg-orange-400' :
      'bg-yellow-400'
    }`} />
    <span className="text-gray-700">{todo.title}</span>
  </div>
))}
              {todayTodos.length > 5 && (
                <p className="text-xs text-gray-400">+{todayTodos.length - 5} more</p>
              )}
            </div>
          )}
        </div>

        {/* Habits today */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">💪 Habits Today</h2>
            <Link to="/habits" className="text-violet-600 text-sm hover:underline">View all</Link>
          </div>
          {habitsTotal === 0 ? (
            <p className="text-gray-400 text-sm">No habits yet!</p>
          ) : (
            <div className="space-y-2">
              {habits?.slice(0, 5).map(habit => (
                <div key={habit.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span>{habit.icon || '⭐'}</span>
                    <span className="text-gray-700">{habit.name}</span>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    habit.completedToday
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {habit.completedToday ? '✓ Done' : `${habit.todayCount}/${habit.targetCount}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active goals */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">🎯 Active Goals</h2>
            <Link to="/goals" className="text-violet-600 text-sm hover:underline">View all</Link>
          </div>
          {activeGoals === 0 ? (
            <p className="text-gray-400 text-sm">No active goals!</p>
          ) : (
            <div className="space-y-3">
              {goals?.filter(g => !g.isCompleted).slice(0, 3).map(goal => (
                <div key={goal.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">{goal.title}</span>
                    <span className="text-gray-500">{goal.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-violet-500 transition-all"
                      style={{ width: `${goal.progressPercent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}