<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'

// Modal state
const showModal = ref(false)
const newSectionTitle = ref('')

// Sections state
const sections = ref<{ id: number, title: string }[]>([])
let nextSectionId = 1

function openModal() {
  showModal.value = true
  newSectionTitle.value = ''
}

function closeModal() {
  showModal.value = false
  newSectionTitle.value = ''
}

function addSection() {
  if (newSectionTitle.value.trim()) {
    sections.value.push({
      id: nextSectionId++,
      title: newSectionTitle.value.trim(),
    })
    closeModal()
  }
}
</script>

<template>
  <div class="bg-muted rounded-lg p-6 min-h-[400px] flex flex-col">
    <div class="flex items-start justify-between mb-8">
      <div>
        <h2 class="text-2xl font-bold text-foreground">Course Content</h2>
        <p class="text-muted-foreground">Organize your course into sections and lectures.</p>
      </div>
      <Button @click="openModal">
        + Add Section
      </Button>
    </div>

    <!-- Section List -->
    <div v-if="sections.length > 0" class="space-y-4">
      <div
        v-for="section in sections"
        :key="section.id"
        class="border rounded-lg p-4 bg-background"
      >
        <h3 class="font-medium mb-2">{{ section.title }}</h3>
        <ul class="space-y-2">
          <li class="text-muted-foreground italic">No lectures yet.</li>
        </ul>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex-1 flex flex-col items-center justify-center">
      <div class="flex flex-col items-center">
        <div class="mb-2">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="text-muted-foreground">
            <circle cx="12" cy="12" r="10" stroke-width="2" />
            <path stroke-linecap="round" stroke-width="2" d="M12 8v4m0 4h.01" />
          </svg>
        </div>
        <div class="text-center">
          <div class="text-lg font-semibold text-foreground">No sections yet.</div>
          <div class="text-muted-foreground">Start by adding a section to your course.</div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div class="bg-background rounded-lg p-6 w-full max-w-sm shadow-lg">
        <h3 class="text-lg font-semibold mb-4">Add Section</h3>
        <input
          v-model="newSectionTitle"
          type="text"
          placeholder="Section title"
          class="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring"
          @keyup.enter="addSection"
        />
        <div class="flex justify-end gap-2">
          <Button variant="outline" @click="closeModal">Cancel</Button>
          <Button @click="addSection" :disabled="!newSectionTitle.trim()">Add</Button>
        </div>
      </div>
    </div>
  </div>
</template>