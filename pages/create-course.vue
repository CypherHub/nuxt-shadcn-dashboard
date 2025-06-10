<template>
  <div class="min-h-screen bg-blue-50">
    <!-- Top Bar -->
    <div class="flex items-center justify-between p-4 shadow bg-white">
      <div class="flex items-center gap-2">
        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 7h18M3 12h18M3 17h18" />
        </svg>
        <h1 class="text-2xl font-semibold text-blue-600">Course Forge</h1>
      </div>
      <button class="flex items-center gap-2 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H3" />
        </svg>
        Save Course
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 px-6 pt-4">
      <button class="px-4 py-2 text-sm font-medium bg-white rounded shadow text-blue-600">
        Course Settings
      </button>
      <button class="px-4 py-2 text-sm font-medium text-blue-600 hover:underline">Content</button>
      <button class="px-4 py-2 text-sm font-medium text-blue-600 hover:underline">Preview</button>
    </div>

    <!-- Main Content -->
    <div class="px-6 py-4">
      <div class="p-6 bg-white rounded shadow">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Course Details</h2>

        <!-- Course Title -->
        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium text-gray-700">Course Title</label>
          <input
            type="text"
            placeholder="e.g., Introduction to Web Development"
            class="w-full p-3 text-sm rounded bg-blue-100 focus:outline-none"
          />
        </div>

        <!-- Course Description -->
        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium text-gray-700">Course Description</label>
          <textarea
            rows="5"
            placeholder="Describe your course..."
            class="w-full p-3 text-sm rounded bg-blue-100 focus:outline-none"
          ></textarea>
        </div>

        <!-- Suggest Button -->
        <button class="flex items-center gap-2 px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-600">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Suggest Sections with AI
        </button>
      </div>
    </div>

    <!-- Footer -->
    <footer class="px-6 py-6 text-sm text-center text-gray-600">
      © 2025 Course Forge. Built with Next.js & ShadCN.
    </footer>
  </div>
</template>

<style scoped>
</style>