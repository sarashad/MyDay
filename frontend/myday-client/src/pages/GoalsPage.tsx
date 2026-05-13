import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { goalsApi } from '../api/goals'
import type { CreateGoalRequest } from '../types'

export default function GoalsPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [steps, setSteps] = useState<string[]>([''])
  const [editingGoal, setEditingGoal] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editDeadline, setEditDeadline] = useState('')

  const { data: goals, isLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: goalsApi.getAll,
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateGoalRequest) => goalsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      setTitle('')
      setDescription('')
      setDeadline('')
      setSteps([''])
      setShowForm(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => goalsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      setEditingGoal(null)
    },
  })

  const completeStepMutation = useMutation({
    mutationFn: ({ goalId, stepId }: { goalId: number; stepId: number }) =>
      goalsApi.completeStep(goalId, stepId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['goals'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => goalsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['goals'] }),
  })

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    createMutation.mutate({
      title,
      description: description || undefined,
      deadline: deadline ? deadline + 'T00:00:00' : undefined,
      steps: steps.filter(s => s.trim() !== '')
    })
  }

  const handleEdit = (goal: any) => {
    setEditingGoal(goal.id)
    setEditTitle(goal.title)
    setEditDescription(goal.description || '')
    setEditDeadline(goal.deadline ? goal.deadline.split('T')[0] : '')
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingGoal) return
    updateMutation.mutate({
      id: editingGoal,
      data: {
        title: editTitle,
        description: editDescription || undefined,
        deadline: editDeadline ? editDeadline + 'T00:00:00' : undefined
      }
    })
  }

  const addStep = () => setSteps([...steps, ''])
  const updateStep = (i: number, val: string) => {
    const updated = [...steps]
    updated[i] = val
    setSteps(updated)
  }
  const removeStep = (i: number) => setSteps(steps.filter((_, idx) => idx !== i))

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🎯 My Goals</h1>
          <p className="text-gray-500 text-sm mt-1">Set goals and track your progress</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium transition">
          + Add Goal
        </button>
      </div>

      {/* Add Goal Form */}
      {showForm && (
        <form onSubmit={handleCreate}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
          <div className="flex flex-col gap-3">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Goal title" required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500" />
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500" />
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500" />
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Steps:</p>
              {steps.map((step, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input type="text" value={step} onChange={(e) => updateStep(i, e.target.value)}
                    placeholder={`Step ${i + 1}`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500" />
                  {steps.length > 1 && (
                    <button type="button" onClick={() => removeStep(i)}
                      className="text-gray-400 hover:text-red-500 px-2">×</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addStep}
                className="text-violet-600 hover:text-violet-800 text-sm font-medium">
                + Add step
              </button>
            </div>
            <button type="submit" disabled={createMutation.isPending}
              className="bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white px-4 py-2 rounded-lg font-medium transition">
              {createMutation.isPending ? 'Creating...' : 'Create Goal'}
            </button>
          </div>
        </form>
      )}

      {isLoading && <div className="text-center text-gray-500 py-8">Loading goals...</div>}

      {!isLoading && goals?.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          <p className="text-4xl mb-3">🎯</p>
          <p className="text-lg font-medium">No goals yet!</p>
          <p className="text-sm">Click "+ Add Goal" to create one.</p>
        </div>
      )}

      {/* Goals list */}
      <div className="flex flex-col gap-4">
        {goals?.map((goal) => (
          <div key={goal.id}
            className={`rounded-xl border p-5 transition ${
              goal.isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
            }`}>

            {/* Goal header */}
            <div className="flex items-start justify-between mb-3">
              {editingGoal === goal.id ? (
                <form onSubmit={handleUpdate} className="flex-1 flex flex-col gap-2 mr-4">
                  <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                  <input type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Description"
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                  <input type="date" value={editDeadline} onChange={(e) => setEditDeadline(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                  <div className="flex gap-2">
                    <button type="submit"
                      className="bg-violet-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-violet-700">
                      Save
                    </button>
                    <button type="button" onClick={() => setEditingGoal(null)}
                      className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-200">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {goal.isCompleted ? '✅' : '🎯'} {goal.title}
                  </h3>
                  {goal.description && (
                    <p className="text-sm text-gray-500 mt-0.5">{goal.description}</p>
                  )}
                  {goal.deadline && (
                    <p className="text-xs text-gray-400 mt-1">
                      📅 Deadline: {new Date(goal.deadline).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                  )}
                </div>
              )}
              <div className="flex gap-2 ml-4">
                {editingGoal !== goal.id && (
                  <button onClick={() => handleEdit(goal)}
                    className="text-gray-400 hover:text-violet-500 transition text-sm">
                    ✏️
                  </button>
                )}
                <button onClick={() => deleteMutation.mutate(goal.id)}
                  className="text-gray-300 hover:text-red-400 transition text-xl">
                  ×
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span className="font-medium">
                  {goal.completedSteps} / {goal.totalSteps} steps ({goal.progressPercent}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`h-2 rounded-full transition-all duration-300 ${
                  goal.isCompleted ? 'bg-green-500' : 'bg-violet-500'
                }`} style={{ width: `${goal.progressPercent}%` }} />
              </div>
            </div>

            {/* Steps */}
            {goal.steps.length > 0 && (
              <div className="flex flex-col gap-2">
                {goal.steps.map(step => (
                  <div key={step.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => completeStepMutation.mutate({ goalId: goal.id, stepId: step.id })}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${
                      step.isCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-violet-400'
                    }`}>
                      {step.isCompleted && <span className="text-xs">✓</span>}
                    </div>
                    <span className={`text-sm ${step.isCompleted ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}