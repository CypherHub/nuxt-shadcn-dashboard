<template>
  <div class="bg-blue-50 rounded-lg p-6 min-h-[400px] flex flex-col">
    <div class="flex items-start justify-between">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Course Content</h2>
        <p class="text-slate-500">Organize your course into sections and lectures.</p>
      </div>
      <Button class="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-2 rounded shadow-none">
        + Add Section
      </Button>
    </div>
    <div class="flex-1 flex flex-col items-center justify-center">
      <div class="flex flex-col items-center">
        <div class="mb-2">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="text-sky-400">
            <circle cx="12" cy="12" r="10" stroke-width="2" />
            <path stroke-linecap="round" stroke-width="2" d="M12 8v4m0 4h.01" />
          </svg>
        </div>
        <div class="text-center">
          <div class="text-lg font-semibold text-sky-600">No sections yet.</div>
          <div class="text-sky-400">Start by adding a section to your course.</div>
        </div>
      </div>
    </div>
  </div>
</template>
