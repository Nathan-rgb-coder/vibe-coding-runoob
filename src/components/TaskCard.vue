<script setup lang="ts">
import type { Task } from '../types/task'

defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  toggle: [taskId: Task['id']]
  delete: [taskId: Task['id']]
}>()

const priorityLabels: Record<Task['priority'], string> = {
  low: '低优先级',
  medium: '中优先级',
  high: '高优先级',
}

const priorityStyles: Record<Task['priority'], string> = {
  low: 'border-l-green-500',
  medium: 'border-l-yellow-500',
  high: 'border-l-red-500',
}

const priorityTagStyles: Record<Task['priority'], string> = {
  low: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
  medium: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
  high: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
}
</script>

<template>
  <article
    class="flex items-start gap-4 rounded-xl border border-l-4 border-slate-200 bg-white p-5 shadow-sm transition-transform duration-200 hover:scale-[1.02] dark:border-slate-700 dark:bg-slate-900"
    :class="priorityStyles[task.priority]"
  >
    <button
      type="button"
      class="grid size-11 shrink-0 place-items-center rounded-lg border transition-colors"
      :class="
        task.status === 'done'
          ? 'border-indigo-600 bg-indigo-600 text-white'
          : 'border-slate-300 bg-white text-transparent hover:border-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-indigo-400'
      "
      :aria-label="task.status === 'done' ? '标记为未完成' : '标记为完成'"
      :aria-pressed="task.status === 'done'"
      @click="emit('toggle', task.id)"
    >
      <svg viewBox="0 0 16 16" fill="none" class="size-4" aria-hidden="true">
        <path
          d="m3.5 8 3 3 6-6"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <div class="min-w-0 flex-1">
      <h3
        class="font-semibold text-slate-900 dark:text-slate-100"
        :class="task.status === 'done' && 'text-slate-400 line-through dark:text-slate-500'"
      >
        {{ task.title }}
      </h3>
      <p class="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{ task.description }}</p>
      <div class="mt-3 flex flex-wrap items-center gap-3">
        <span
          class="rounded-full px-2.5 py-1 text-xs font-medium"
          :class="priorityTagStyles[task.priority]"
        >
          {{ priorityLabels[task.priority] }}
        </span>
        <span class="text-xs text-slate-500 dark:text-slate-400">
          {{ task.dueDate ? `截止日期：${task.dueDate}` : '未设置截止日期' }}
        </span>
      </div>
    </div>

    <button
      type="button"
      class="-mr-2 -mt-2 grid size-11 shrink-0 place-items-center rounded-lg text-xl leading-none text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-500 dark:hover:bg-red-950 dark:hover:text-red-300"
      :aria-label="`删除任务：${task.title}`"
      @click="emit('delete', task.id)"
    >
      <span aria-hidden="true">×</span>
    </button>
  </article>
</template>
