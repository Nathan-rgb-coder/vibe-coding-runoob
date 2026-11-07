<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { Task, TaskPriority } from '../types/task'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [isOpen: boolean]
  create: [task: Task]
}>()

const form = reactive<{
  title: string
  description: string
  priority: TaskPriority
}>({
  title: '',
  description: '',
  priority: 'medium',
})

const titleError = ref(false)
let fallbackId = 0

function createTaskId(): string {
  const randomUUID = globalThis.crypto?.randomUUID
  if (randomUUID) return randomUUID.call(globalThis.crypto)

  fallbackId += 1
  return `task-${Date.now()}-${fallbackId}`
}

watch(
  () => props.modelValue,
  (isOpen, _wasOpen, onCleanup) => {
    if (!isOpen) return

    form.title = ''
    form.description = ''
    form.priority = 'medium'
    titleError.value = false

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        emit('update:modelValue', false)
      }
    }

    document.addEventListener('keydown', handleKeydown)
    onCleanup(() => document.removeEventListener('keydown', handleKeydown))
  },
)

function closeModal() {
  emit('update:modelValue', false)
}

function submitTask() {
  const title = form.title.trim()
  if (!title) {
    titleError.value = true
    return
  }

  emit('create', {
    id: createTaskId(),
    title,
    description: form.description.trim(),
    status: 'todo',
    priority: form.priority,
    dueDate: '',
    createdAt: new Date().toISOString(),
  })
  closeModal()
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 backdrop-blur-sm sm:items-center sm:p-4"
        @click.self="closeModal"
      >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        class="max-h-[90dvh] w-full animate-[mobile-sheet-in_300ms_ease-out] overflow-y-auto rounded-t-2xl bg-white p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl shadow-slate-950/20 dark:bg-slate-900 dark:shadow-black/40 sm:max-w-lg sm:animate-none sm:rounded-2xl sm:p-8"
      >
        <div class="mb-6 flex items-start justify-between gap-4">
          <div>
            <p class="text-sm font-medium text-indigo-600">开始一件新事情</p>
            <h2 id="task-modal-title" class="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
              新建任务
            </h2>
          </div>
          <button
            type="button"
            class="-mr-2 -mt-2 grid size-11 place-items-center rounded-lg text-2xl leading-none text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="关闭弹窗"
            @click="closeModal"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <form class="space-y-5" novalidate @submit.prevent="submitTask">
          <div>
            <label for="task-title" class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              标题 <span class="text-red-500">*</span>
            </label>
            <input
              id="task-title"
              v-model="form.title"
              type="text"
              autofocus
              autocomplete="off"
              aria-describedby="task-title-error"
              :aria-invalid="titleError"
              placeholder="输入任务标题"
              class="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-950"
              @input="titleError = false"
            />
            <p
              v-if="titleError"
              id="task-title-error"
              class="mt-1.5 text-sm text-red-600"
              role="alert"
            >
              标题不能为空
            </p>
          </div>

          <div>
            <label for="task-description" class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              描述 <span class="font-normal text-slate-400 dark:text-slate-500">（选填）</span>
            </label>
            <textarea
              id="task-description"
              v-model="form.description"
              rows="3"
              placeholder="补充任务的相关信息"
              class="w-full resize-y rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-950"
            />
          </div>

          <div>
            <label for="task-priority" class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              优先级
            </label>
            <select
              id="task-priority"
              v-model="form.priority"
              class="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-indigo-950"
            >
              <option value="low">低优先级</option>
              <option value="medium">中优先级</option>
              <option value="high">高优先级</option>
            </select>
          </div>

          <div class="flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
            <button
              type="button"
              class="min-h-11 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              @click="closeModal"
            >
              取消
            </button>
            <button
              type="submit"
              class="min-h-11 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-900"
            >
              创建任务
            </button>
          </div>
        </form>
      </section>
      </div>
    </Transition>
  </Teleport>
</template>
