import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { todosApi } from '../api/todos'
import { Priority } from '../types'
import type { CreateTodoRequest } from '../types'

export default function TodosPage() {
  const queryClient = useQueryClient()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<number>(Priority.Medium)
  const [showForm, setShowForm] = useState(false)
  const [showExpired, setShowExpired] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  )

  const { data: todos, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: todosApi.getAll,
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateTodoRequest) => todosApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      setTitle('')
      setDescription('')
      setShowForm(false)
    },
  })

  const completeMutation = useMutation({
    mutationFn: (id: number) => todosApi.complete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => todosApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    createMutation.mutate({
      title,
      description: description || undefined,
      priority: priority as Priority,
      dueDate: selectedDate + 'T00:00:00'
    })
  }

  const today = new Date().toISOString().split('T')[0]

  const getEffectiveDate = (todo: { dueDate?: string; createdAt: string }) => {
    return todo.createdAt.split('T')[0]
  }

  const { expiredTodos, selectedDayTodos, completedTodos } = useMemo(() => {
    if (!todos) return { expiredTodos: [], selectedDayTodos: [], completedTodos: [] }

    const expired = todos
      .filter(t => !t.isCompleted && getEffectiveDate(t) < today)
      .sort((a, b) => b.priority - a.priority)

    const selectedDay = todos
      .filter(t => !t.isCompleted && getEffectiveDate(t) === selectedDate)
      .sort((a, b) => b.priority - a.priority)

    const completed = todos.filter(t =>
      t.isCompleted && getEffectiveDate(t) === selectedDate
    )

    return { expiredTodos: expired, selectedDayTodos: selectedDay, completedTodos: completed }
  }, [todos, selectedDate, today])

  const priorityStyle = (p: number, completed: boolean) => {
    if (completed) return 'bg-green-50 border-green-200'
    if (p === Priority.High) return 'bg-red-50 border-red-200'
    if (p === Priority.Medium) return 'bg-orange-50 border-orange-200'
    return 'bg-yellow-50 border-yellow-200'
  }

  const priorityLabel = (p: number) => {
    if (p === Priority.High) return { label: 'High', color: 'bg-red-100 text-red-700' }
    if (p === Priority.Medium) return { label: 'Medium', color: 'bg-orange-100 text-orange-700' }
    return { label: 'Low', color: 'bg-yellow-100 text-yellow-700' }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    })
  }

  const isToday = selectedDate === today

  const TodoCard = ({ todo, expired = false }: { todo: any; expired?: boolean }) => (
    <div className={`rounded-xl shadow-sm border p-4 flex items-center gap-4 transition ${
      expired ? 'bg-purple-50 border-purple-300' : priorityStyle(todo.priority, todo.isCompleted)
    }`}>

      {/* Checkbox */}
      <button
        onClick={() => completeMutation.mutate(todo.id)}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${
          todo.isCompleted
            ? 'bg-violet-600 border-violet-600 text-white'
            : expired
            ? 'border-purple-400 hover:border-purple-600'
            : 'border-gray-300 hover:border-violet-400'
        }`}>
        {todo.isCompleted && '✓'}
      </button>

      {/* Title + Description */}
      <div className="flex-1">
        <span className={`font-medium ${
          todo.isCompleted
            ? 'line-through text-gray-400'
            : expired
            ? 'text-purple-700'
            : 'text-gray-800'
        }`}>
          {todo.title}
        </span>
        {todo.description && (
          <p className="text-xs text-gray-500 mt-0.5">{todo.description}</p>
        )}
        {expired && (
          <p className="text-xs text-purple-500 mt-0.5">
            ⚠️ Was due on {formatDate(getEffectiveDate(todo))}
          </p>
        )}
      </div>

      {/* Priority badge */}
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${priorityLabel(todo.priority).color}`}>
        {priorityLabel(todo.priority).label}
      </span>

      {/* Delete */}
      <button
        onClick={() => deleteMutation.mutate(todo.id)}
        className="text-gray-400 hover:text-red-500 transition text-lg">
        ×
      </button>
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">✅ My Todos</h1>
          <p className="text-gray-500 text-sm mt-1">
            {isToday ? 'Today — ' : ''}{formatDate(selectedDate)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {expiredTodos.length > 0 && (
            <button
              onClick={() => setShowExpired(!showExpired)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                showExpired
                  ? 'bg-purple-100 text-purple-700 border border-purple-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-600'
              }`}>
              ⚠️ Expired ({expiredTodos.length})
            </button>
          )}

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium transition">
            + Add Todo
          </button>
        </div>
      </div>

      {/* Add Todo Form */}
      {showForm && (
        <form onSubmit={handleCreate}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <select
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500">
                <option value={Priority.Low}>Low</option>
                <option value={Priority.Medium}>Medium</option>
                <option value={Priority.High}>High</option>
              </select>
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium transition">
                {createMutation.isPending ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="text-center text-gray-500 py-8">Loading todos...</div>
      )}

      {/* Expired section */}
      {showExpired && expiredTodos.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-3">
            ⚠️ Expired — Not completed
          </h2>
          <div className="space-y-3">
            {expiredTodos.map(todo => (
              <TodoCard key={todo.id} todo={todo} expired={true} />
            ))}
          </div>
        </div>
      )}

      {/* Selected day todos */}
      {selectedDayTodos.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            📋 {isToday ? "Today's Todos" : formatDate(selectedDate)}
          </h2>
          <div className="space-y-3">
            {selectedDayTodos.map(todo => (
              <TodoCard key={todo.id} todo={todo} />
            ))}
          </div>
        </div>
      )}

      {/* Completed section */}
      {completedTodos.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-green-600 uppercase tracking-wide mb-3">
            ✅ Completed
          </h2>
          <div className="space-y-3">
            {completedTodos.map(todo => (
              <TodoCard key={todo.id} todo={todo} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && selectedDayTodos.length === 0 && completedTodos.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          <p className="text-4xl mb-3">📝</p>
          <p className="text-lg font-medium">No todos for this day!</p>
          <p className="text-sm">Click "+ Add Todo" to create one.</p>
        </div>
      )}
    </div>
  )
}