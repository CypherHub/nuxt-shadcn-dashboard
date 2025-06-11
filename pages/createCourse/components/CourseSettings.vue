<template>
  <div class="p-6 bg-white rounded shadow">
    <h2 class="text-2xl font-semibold text-gray-800 mb-6">Course Details</h2>
    <div class="mb-4">
      <label class="block mb-1 text-sm font-medium text-gray-700">Course Title</label>
      <input
        type="text"
        placeholder="e.g., Introduction to Web Development"
        class="w-full p-3 text-sm rounded bg-[#E5F5FA] focus:outline-none"
      />
    </div>
    <div class="mb-4">
      <label class="block mb-1 text-sm font-medium text-gray-700">Course Description</label>
      <textarea
        rows="5"
        placeholder="Describe your course..."
        class="w-full p-3 text-sm rounded bg-[#E5F5FA] focus:outline-none"
      ></textarea>
    </div>
    <button class="flex items-center gap-2 px-4 py-2 mt-2 text-white bg-[#94D4EF] rounded hover:bg-blue-600">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      Suggest Sections with AI
    </button>
  </div>
</template>
