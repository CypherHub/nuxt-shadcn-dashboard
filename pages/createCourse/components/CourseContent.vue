<template>
  <div class="p-6 bg-white rounded shadow">
    <h2 class="text-2xl font-semibold text-gray-800 ">Course Content</h2>
    <p class="text-sm text-gray-500 mb-4">Organize your course into sections and lectures.</p>
    <div class="flex justify-end mb-4">
      <button class="px-4 py-2 text-white bg-[#29A9E0] rounded ">+ Add Section</button>
    </div>
    <div class="flex flex-col items-center justify-center h-64 text-center text-[#598FA6]">
      <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-lg font-bold">No sections yet.</p>
      <p class="text-sm">Start by adding a section to your course.</p>
    </div>
  </div>
</template>
