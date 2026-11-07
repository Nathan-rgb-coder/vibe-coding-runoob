<script setup lang="ts">
import { computed, ref } from 'vue'
import TaskList from './components/TaskList.vue'
import KanbanBoard from './components/KanbanBoard.vue'
import TaskModal from './components/TaskModal.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import { addTask, deleteTask, storageError, tasks, updateTask } from './stores/taskStore'
import type { Task, TaskStatus } from './types/task'

const isTaskModalOpen = ref(false)
const activeView = ref<'list' | 'kanban'>('list')
const isMobileMenuOpen = ref(false)

const completedCount = computed(() => tasks.filter((task) => task.status === 'done').length)

function toggleTask(taskId: Task['id']) {
  const task = tasks.find((item) => item.id === taskId)
  if (task) {
    updateTask(taskId, { status: task.status === 'done' ? 'todo' : 'done' })
  }
}

function moveTask(taskId: Task['id'], status: TaskStatus) {
  updateTask(taskId, { status })
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
    <header class="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <nav
        class="relative mx-auto flex max-w-6xl flex-wrap items-center justify-between px-4 py-3 sm:flex-nowrap sm:px-8 sm:py-4"
        aria-label="主导航"
      >
        <a href="#" class="flex items-center gap-3 text-slate-900 no-underline dark:text-slate-100">
          <span
            class="grid size-10 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200"
          >
            <svg viewBox="0 0 24 24" fill="none" class="size-5" aria-hidden="true">
              <path
                d="m5 12 4 4L19 6"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span class="text-lg font-semibold tracking-tight">Vibe Coding Runoob</span>
        </a>
        <div class="flex items-center gap-2 sm:gap-4">
          <span class="hidden text-sm text-slate-500 dark:text-slate-400 sm:block">把想法，一件件变成现实。</span>
          <ThemeToggle />
          <button
            type="button"
            class="grid size-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 sm:hidden"
            :aria-expanded="isMobileMenuOpen"
            aria-controls="mobile-navigation"
            :aria-label="isMobileMenuOpen ? '关闭导航菜单' : '打开导航菜单'"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
          >
            <svg v-if="!isMobileMenuOpen" viewBox="0 0 24 24" fill="none" class="size-5" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" class="size-5" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </button>
        </div>
        <div
          v-if="isMobileMenuOpen"
          id="mobile-navigation"
          class="mt-3 flex basis-full flex-col gap-2 border-t border-slate-200 pt-3 dark:border-slate-800 sm:hidden"
        >
          <button
            type="button"
            class="min-h-11 rounded-lg px-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            @click="activeView = 'list'; isMobileMenuOpen = false"
          >
            列表视图
          </button>
          <button
            type="button"
            class="min-h-11 rounded-lg px-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            @click="activeView = 'kanban'; isMobileMenuOpen = false"
          >
            看板视图
          </button>
        </div>
      </nav>
    </header>

    <main class="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <div
        v-if="storageError"
        class="mb-6 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-200"
        role="alert"
      >
        <svg viewBox="0 0 24 24" fill="none" class="mt-0.5 size-5 shrink-0" aria-hidden="true">
          <path
            d="M12 9v4m0 4h.01M10.3 3.9 1.8 18.6A1.6 1.6 0 0 0 3.2 21h17.6a1.6 1.6 0 0 0 1.4-2.4L13.7 3.9a1.9 1.9 0 0 0-3.4 0Z"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <p>{{ storageError }}</p>
      </div>

      <section class="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="mb-2 text-sm font-medium text-indigo-600">你的工作空间</p>
          <h1 class="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">任务管理</h1>
          <p class="mt-3 text-slate-500 dark:text-slate-400">保持专注，一步一步完成今天的计划。</p>
        </div>
        <div class="flex items-center gap-4">
          <button
            type="button"
            class="inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 dark:shadow-indigo-950 dark:focus:ring-indigo-900"
            @click="isTaskModalOpen = true"
          >
            <span class="text-lg leading-none" aria-hidden="true">+</span>
            新建任务
          </button>
          <div class="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p class="text-sm text-slate-500 dark:text-slate-400">任务完成进度</p>
            <p class="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">
              <span class="text-indigo-600">{{ completedCount }}</span>
              <span class="text-slate-400 dark:text-slate-500"> / {{ tasks.length }} 项</span>
            </p>
          </div>
        </div>
      </section>

      <div class="mb-5 flex gap-1 rounded-xl bg-slate-200/70 p-1 dark:bg-slate-800 sm:w-fit" role="tablist" aria-label="任务视图">
        <button
          id="list-view-tab"
          type="button"
          role="tab"
          :aria-selected="activeView === 'list'"
          aria-controls="list-view-panel"
          class="min-h-11 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          :class="activeView === 'list' ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-700 dark:text-indigo-300' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'"
          @click="activeView = 'list'"
        >
          列表
        </button>
        <button
          id="kanban-view-tab"
          type="button"
          role="tab"
          :aria-selected="activeView === 'kanban'"
          aria-controls="kanban-view-panel"
          class="min-h-11 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          :class="activeView === 'kanban' ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-700 dark:text-indigo-300' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'"
          @click="activeView = 'kanban'"
        >
          看板
        </button>
      </div>

      <div
        v-show="activeView === 'list'"
        id="list-view-panel"
        role="tabpanel"
        aria-labelledby="list-view-tab"
      >
        <TaskList :tasks="tasks" @toggle="toggleTask" @delete="deleteTask" />
      </div>
      <div
        v-if="activeView === 'kanban'"
        id="kanban-view-panel"
        role="tabpanel"
        aria-labelledby="kanban-view-tab"
      >
        <KanbanBoard
          :tasks="tasks"
          @toggle="toggleTask"
          @delete="deleteTask"
          @update-status="moveTask"
        />
      </div>
      <TaskModal v-model="isTaskModalOpen" @create="addTask" />
    </main>
  </div>
</template>
