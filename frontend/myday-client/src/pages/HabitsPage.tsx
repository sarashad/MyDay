import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { habitsApi } from '../api/habits'
import type { CreateHabitRequest } from '../types'

export default function HabitsPage() {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('')
  const [targetCount, setTargetCount] = useState(1)
  const [showForm, setShowForm] = useState(false)

  const { data: habits, isLoading } = useQuery({
    queryKey: ['habits'],
    queryFn: habitsApi.getAll,
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateHabitRequest) => habitsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      setName('')
      setIcon('')
      setTargetCount(1)
      setShowForm(false)
    },
  })

  const logMutation = useMutation({
    mutationFn: (id: number) => habitsApi.logToday(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['habits'] }),
  })

  const undoMutation = useMutation({
    mutationFn: (id: number) => habitsApi.undoToday(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['habits'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => habitsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['habits'] }),
  })

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    createMutation.mutate({
      name,
      icon: icon || undefined,
      targetCount
    })
  }

  const emojiOptions = ['💪', '📚', '🏃', '🧘', '💧', '🥗', '😴', '✍️', '🎯', '🌿']

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">💪 My Habits</h1>
          <p className="text-gray-500 text-sm mt-1">Track your daily habits and streaks</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium transition">
          + Add Habit
        </button>
      </div>

      {/* Add Habit Form */}
      {showForm && (
        <form onSubmit={handleCreate}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
          <div className="flex flex-col gap-4">

            {/* Name input */}
            <div className="flex gap-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Habit name (e.g. Drink water)"
                required
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            {/* Target count */}
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600 font-medium whitespace-nowrap">
                Daily target:
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTargetCount(Math.max(1, targetCount - 1))}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 font-bold text-gray-600">
                  −
                </button>
                <span className="w-8 text-center font-semibold text-gray-800">
                  {targetCount}
                </span>
                <button
                  type="button"
                  onClick={() => setTargetCount(targetCount + 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 font-bold text-gray-600">
                  +
                </button>
              </div>
              <span className="text-sm text-gray-400">times per day</span>
            </div>

            {/* Emoji picker */}
            <div>
              <p className="text-sm text-gray-500 mb-2">Pick an icon (optional):</p>
              <div className="flex gap-2 flex-wrap">
                {emojiOptions.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setIcon(icon === emoji ? '' : emoji)}
                    className={`text-xl p-2 rounded-lg border transition ${
                      icon === emoji
                        ? 'border-violet-500 bg-violet-50'
                        : 'border-gray-200 hover:border-violet-300'
                    }`}>
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white px-4 py-2 rounded-lg font-medium transition">
              {createMutation.isPending ? 'Adding...' : 'Add Habit'}
            </button>

          </div>
        </form>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="text-center text-gray-500 py-8">Loading habits...</div>
      )}

      {/* Empty state */}
      {!isLoading && habits?.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          <p className="text-4xl mb-3">💪</p>
          <p className="text-lg font-medium">No habits yet!</p>
          <p className="text-sm">Click "+ Add Habit" to start tracking.</p>
        </div>
      )}

      {/* Habits grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {habits?.map(habit => {
          const progress = Math.min((habit.todayCount / habit.targetCount) * 100, 100)
          const isCompleted = habit.completedToday

          return (
            <div key={habit.id}
              className={`rounded-xl border p-5 transition ${
                isCompleted
                  ? 'bg-green-50 border-green-200'
                  : 'bg-white border-gray-200'
              }`}>

              {/* Top row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{habit.icon || '⭐'}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{habit.name}</h3>
                    <p className="text-xs text-gray-500">
                      🔥 {habit.currentStreak} day streak
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteMutation.mutate(habit.id)}
                  className="text-gray-300 hover:text-red-400 transition text-xl">
                  ×
                </button>
              </div>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress today</span>
                  <span className="font-medium">
                    {habit.todayCount} / {habit.targetCount}
                    {habit.targetCount > 1 ? ' times' : ''}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isCompleted ? 'bg-green-500' : 'bg-violet-500'
                    }`}
                    style={{ width: `${progress}%` }}>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                {/* Log button */}
                <button
                  onClick={() => logMutation.mutate(habit.id)}
                  disabled={isCompleted}
                  className={`flex-1 py-2 rounded-lg font-medium text-sm transition ${
                    isCompleted
                      ? 'bg-green-500 text-white cursor-default'
                      : 'bg-violet-600 hover:bg-violet-700 text-white'
                  }`}>
                  {isCompleted
                    ? '✓ Completed!'
                    : habit.targetCount > 1
                    ? `+ 1 (${habit.todayCount}/${habit.targetCount})`
                    : 'Mark as done'}
                </button>

                {/* Undo button — only show if logged at least once today */}
                {habit.todayCount > 0 && (
                  <button
                    onClick={() => undoMutation.mutate(habit.id)}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700 text-sm transition"
                    title="Undo last log">
                    ↩
                  </button>
                )}
              </div>

            </div>
          )
        })}
      </div>
    </div>
  )
}