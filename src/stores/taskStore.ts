import { reactive, ref, watch } from 'vue'
import type { Task } from '../types/task'
import { readTasksFromStorage, saveTasks } from '../utils/storage'

function createExampleTasks(): Task[] {
  return [
    {
      id: 'example-1',
      title: '整理本周工作计划',
      description: '列出本周的重点事项并安排优先级。',
      status: 'todo',
      priority: 'high',
      dueDate: '2026-11-10',
      createdAt: '2026-11-06T09:00:00.000Z',
    },
    {
      id: 'example-2',
      title: '完成任务列表页面',
      description: '检查任务卡片、筛选和响应式布局。',
      status: 'in-progress',
      priority: 'medium',
      dueDate: '2026-11-12',
      createdAt: '2026-11-06T08:00:00.000Z',
    },
    {
      id: 'example-3',
      title: '回顾本周进度',
      description: '总结已完成事项并记录需要跟进的内容。',
      status: 'done',
      priority: 'low',
      dueDate: '2026-11-13',
      createdAt: '2026-11-05T08:00:00.000Z',
    },
  ]
}

const storedTasks = readTasksFromStorage()
export const storageError = ref<string | null>(null)

if (storedTasks.status === 'error') {
  console.error('Failed to load tasks from localStorage.', storedTasks.error)
  storageError.value = '无法读取已保存的任务，原有数据暂未覆盖。新增或修改任务后会再次尝试保存。'
}

export const tasks = reactive<Task[]>(
  storedTasks.status === 'loaded'
    ? storedTasks.tasks
    : storedTasks.status === 'missing'
      ? createExampleTasks()
      : [],
)

let skipInitialSave = storedTasks.status === 'error'

watch(
  tasks,
  (updatedTasks) => {
    if (skipInitialSave) {
      skipInitialSave = false
      return
    }

    try {
      saveTasks(updatedTasks)
      storageError.value = null
    } catch (error) {
      console.error('Failed to save tasks to localStorage.', error)
      storageError.value = '任务已更新，但无法保存到本地存储。请检查浏览器存储设置或可用空间。'
    }
  },
  { deep: true, immediate: true },
)

export function addTask(task: Task): void {
  tasks.push(task)
}

export function updateTask(
  taskId: Task['id'],
  updates: Partial<Pick<Task, 'title' | 'description' | 'status' | 'priority' | 'dueDate'>>,
): void {
  const task = tasks.find((item) => item.id === taskId)
  if (task) {
    Object.assign(task, updates)
  }
}

export function deleteTask(taskId: Task['id']): void {
  const taskIndex = tasks.findIndex((task) => task.id === taskId)
  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1)
  }
}
