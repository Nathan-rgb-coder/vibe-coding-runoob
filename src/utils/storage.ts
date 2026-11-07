import type { Task } from '../types/task'

export const TASKS_STORAGE_KEY = 'vibe-coding-runoob-tasks'

export type TaskStorageLoadResult =
  | { status: 'loaded'; tasks: Task[] }
  | { status: 'missing'; tasks: [] }
  | { status: 'error'; tasks: []; error: unknown }

function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false

  const task = value as Record<string, unknown>
  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    typeof task.description === 'string' &&
    (task.status === 'todo' || task.status === 'in-progress' || task.status === 'done') &&
    (task.priority === 'low' || task.priority === 'medium' || task.priority === 'high') &&
    typeof task.dueDate === 'string' &&
    typeof task.createdAt === 'string'
  )
}

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
}

export function readTasksFromStorage(): TaskStorageLoadResult {
  try {
    const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY)
    if (storedTasks === null) return { status: 'missing', tasks: [] }

    const parsed: unknown = JSON.parse(storedTasks)
    if (!Array.isArray(parsed) || !parsed.every(isTask)) {
      throw new TypeError('Stored task data has an invalid format.')
    }

    return { status: 'loaded', tasks: parsed }
  } catch (error) {
    return { status: 'error', tasks: [], error }
  }
}

export function loadTasks(): Task[] {
  const result = readTasksFromStorage()
  if (result.status === 'error') {
    console.error('Failed to load tasks from localStorage.', result.error)
  }
  return result.tasks
}
