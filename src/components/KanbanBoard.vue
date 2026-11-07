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
  'update-status': [taskId: Task['id'], status: TaskStatus]
}>()

const columns: { title: string; status: TaskStatus; accent: string }[] = [
  { title: '待办', status: 'todo', accent: 'bg-slate-400' },
  { title: '进行中', status: 'in-progress', accent: 'bg-indigo-500' },
  { title: '已完成', status: 'done', accent: 'bg-emerald-500' },
]

const draggedTaskId = ref<Task['id'] | null>(null)

const tasksByStatus = computed(() =>
  Object.fromEntries(
    columns.map(({ status }) => [
      status,
      props.tasks
        .filter((task) => task.status === status)
        .slice()
        .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)),
    ]),
  ) as Record<TaskStatus, Task[]>,
)

function startDragging(event: DragEvent, taskId: Task['id']) {
  draggedTaskId.value = taskId
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', taskId)
  }
}

function stopDragging() {
  draggedTaskId.value = null
}

function dropTask(event: DragEvent, status: TaskStatus) {
  const taskId = event.dataTransfer?.getData('text/plain') || draggedTaskId.value
  if (taskId && props.tasks.some((task) => task.id === taskId)) {
    emit('update-status', taskId, status)
  }
  draggedTaskId.value = null
}
</script>

<template>
  <section aria-label="任务看板">
    <div class="grid grid-cols-1 items-start gap-5 md:grid-cols-3">
      <section
        v-for="column in columns"
        :key="column.status"
        class="min-w-0 rounded-2xl bg-slate-100/80 p-3 dark:bg-slate-900 sm:p-4"
        :aria-label="`${column.title}任务`"
        @dragover.prevent
        @drop.prevent="dropTask($event, column.status)"
      >
        <header class="mb-4 flex items-center justify-between px-1">
          <div class="flex items-center gap-2">
            <span class="size-2.5 rounded-full" :class="column.accent" aria-hidden="true" />
            <h2 class="font-semibold text-slate-800 dark:text-slate-200">{{ column.title }}</h2>
          </div>
          <span class="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            {{ tasksByStatus[column.status].length }}
          </span>
        </header>

        <ul class="grid min-h-32 content-start gap-3">
          <li
            v-for="task in tasksByStatus[column.status]"
            :key="task.id"
            draggable="true"
            class="cursor-grab active:cursor-grabbing"
            :class="draggedTaskId === task.id ? 'opacity-50' : ''"
            @dragstart="startDragging($event, task.id)"
            @dragend="stopDragging"
          >
            <TaskCard
              :task="task"
              @toggle="emit('toggle', $event)"
              @delete="emit('delete', $event)"
            />
          </li>
          <li
            v-if="tasksByStatus[column.status].length === 0"
            class="rounded-xl border border-dashed border-slate-300 px-3 py-6 text-center text-sm text-slate-400 dark:border-slate-700 dark:text-slate-500"
          >
            拖拽任务到此处
          </li>
        </ul>
      </section>
    </div>
  </section>
</template>
