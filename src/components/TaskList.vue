<script setup lang="ts">
import { computed, ref } from 'vue'
import TaskCard from './TaskCard.vue'
import type { Task, TaskStatus } from '../types/task'

const props = defineProps<{
  tasks: Task[]
}>()

const emit = defineEmits<{
  toggle: [taskId: Task['id']]
  delete: [taskId: Task['id']]
}>()

type TaskFilter = 'all' | TaskStatus

const filters: { label: string; value: TaskFilter }[] = [
  { label: '全部', value: 'all' },
  { label: '待办', value: 'todo' },
  { label: '进行中', value: 'in-progress' },
  { label: '完成', value: 'done' },
]

const activeFilter = ref<TaskFilter>('all')

const filteredTasks = computed(() =>
  props.tasks
    .filter((task) => activeFilter.value === 'all' || task.status === activeFilter.value)
    .slice()
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)),
)
</script>

<template>
  <section aria-labelledby="task-list-heading">
    <div class="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center justify-between gap-3">
        <h2 id="task-list-heading" class="text-lg font-semibold text-slate-900 dark:text-slate-100">所有任务</h2>
        <span class="text-sm text-slate-500 dark:text-slate-400">{{ filteredTasks.length }} 项</span>
      </div>

      <div class="flex flex-wrap gap-2" role="group" aria-label="按状态筛选任务">
        <button
          v-for="filter in filters"
          :key="filter.value"
          type="button"
          class="min-h-11 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          :class="
            activeFilter === filter.value
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800'
          "
          :aria-pressed="activeFilter === filter.value"
          @click="activeFilter = filter.value"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <ul v-if="filteredTasks.length" class="grid gap-3">
      <li v-for="task in filteredTasks" :key="task.id">
        <TaskCard
          :task="task"
          @toggle="emit('toggle', $event)"
          @delete="emit('delete', $event)"
        />
      </li>
    </ul>

    <div
      v-else
      class="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900"
    >
      <template v-if="tasks.length === 0">
        <div class="mx-auto grid size-12 place-items-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
          <svg viewBox="0 0 24 24" fill="none" class="size-6" aria-hidden="true">
            <path
              d="M12 5v14m-7-7h14"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <p class="mt-4 text-sm text-slate-600 dark:text-slate-300">还没有任务，点击“+ 新建任务”创建第一个吧</p>
      </template>
      <p v-else class="text-sm text-slate-500 dark:text-slate-400">当前筛选条件下暂无任务。</p>
    </div>
  </section>
</template>
