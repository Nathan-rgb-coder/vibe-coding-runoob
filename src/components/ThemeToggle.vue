<script setup lang="ts">
import { ref } from 'vue'

const THEME_STORAGE_KEY = 'vibe-coding-runoob-theme'

function getInitialTheme(): boolean {
  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    if (savedTheme === 'dark') return true
    if (savedTheme === 'light') return false
  } catch (error) {
    console.error('Failed to read the saved theme preference.', error)
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

const isDark = ref(getInitialTheme())

function applyTheme() {
  document.documentElement.classList.toggle('dark', isDark.value)
}

applyTheme()

function toggleTheme() {
  isDark.value = !isDark.value
  applyTheme()

  try {
    localStorage.setItem(THEME_STORAGE_KEY, isDark.value ? 'dark' : 'light')
  } catch (error) {
    console.error('Failed to save the theme preference.', error)
  }
}
</script>

<template>
  <button
    type="button"
    class="grid size-11 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white dark:focus:ring-indigo-900"
    :aria-label="isDark ? '切换到亮色模式' : '切换到深色模式'"
    :aria-pressed="isDark"
    @click="toggleTheme"
  >
    <svg
      v-if="isDark"
      viewBox="0 0 24 24"
      fill="none"
      class="size-5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.8" />
      <path
        d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
      />
    </svg>
    <svg v-else viewBox="0 0 24 24" fill="none" class="size-5" aria-hidden="true">
      <path
        d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.5 8.5 0 1 0 20.2 15.1Z"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>
</template>
