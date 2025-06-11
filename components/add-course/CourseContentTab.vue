<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'

const showSectionModal = ref(false)
const newSectionTitle = ref('')

const showLectureModal = ref(false)
const lectureSectionId = ref<number | null>(null)
const newLectureTitle = ref('')
const newLectureType = ref('video')
const newLectureContent = ref('')

const sections = ref<{ id: number, title: string, lectures: any[] }[]>([])
let nextSectionId = 1
let nextLectureId = 1

function openSectionModal() {
  showSectionModal.value = true
  newSectionTitle.value = ''
}

function closeSectionModal() {
  showSectionModal.value = false
  newSectionTitle.value = ''
}

function addSection() {
  if (newSectionTitle.value.trim()) {
    sections.value.push({
      id: nextSectionId++,
      title: newSectionTitle.value.trim(),
      lectures: [],
    })
    closeSectionModal()
  }
}

function openLectureModal(sectionId: number) {
  lectureSectionId.value = sectionId
  newLectureTitle.value = ''
  newLectureType.value = 'video'
  newLectureContent.value = ''
  showLectureModal.value = true
}

function closeLectureModal() {
  showLectureModal.value = false
  lectureSectionId.value = null
  newLectureTitle.value = ''
  newLectureType.value = 'video'
  newLectureContent.value = ''
}

function addLecture() {
  if (
    newLectureTitle.value.trim() &&
    newLectureContent.value.trim() &&
    lectureSectionId.value !== null
  ) {
    const section = sections.value.find(s => s.id === lectureSectionId.value)
    if (section) {
      section.lectures.push({
        id: nextLectureId++,
        title: newLectureTitle.value.trim(),
        type: newLectureType.value,
        content: newLectureContent.value.trim(),
      })
    }
    closeLectureModal()
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
      <Button @click="openSectionModal">
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
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-medium">{{ section.title }}</h3>
          <Button size="sm" @click="openLectureModal(section.id)">+ Add Lecture</Button>
        </div>
        <ul class="space-y-2">
          <li v-if="section.lectures.length === 0" class="text-muted-foreground italic">No lectures yet.</li>
          <li v-for="lecture in section.lectures" :key="lecture.id" class="flex items-center gap-2">
            <span class="font-semibold">{{ lecture.title }}</span>
            <span class="text-xs text-muted-foreground">({{ lecture.type }})</span>
            <span class="text-xs text-muted-foreground truncate max-w-xs">{{ lecture.content }}</span>
          </li>
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

    <!-- Section Modal -->
    <div v-if="showSectionModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
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
          <Button variant="outline" @click="closeSectionModal">Cancel</Button>
          <Button @click="addSection" :disabled="!newSectionTitle.trim()">Add</Button>
        </div>
      </div>
    </div>

    <!-- Lecture Modal -->
    <div v-if="showLectureModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div class="bg-background rounded-lg p-6 w-full max-w-sm shadow-lg">
        <h3 class="text-lg font-semibold mb-4">Add Lecture</h3>
        <input
          v-model="newLectureTitle"
          type="text"
          placeholder="Lecture title"
          class="w-full border rounded px-3 py-2 mb-3 focus:outline-none focus:ring"
        />
        <div class="mb-3">
          <label class="block text-sm font-medium mb-1">Type</label>
          <select v-model="newLectureType" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring">
            <option value="video">Video</option>
            <option value="html">HTML</option>
            <option value="pdf">PDF</option>
            <option value="quiz">Quiz</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">
            {{ newLectureType === 'video' ? 'Video URL' : newLectureType === 'pdf' ? 'PDF URL' : newLectureType === 'html' ? 'HTML Content' : 'Quiz ID' }}
          </label>
          <input
            v-if="newLectureType !== 'html'"
            v-model="newLectureContent"
            type="text"
            :placeholder="newLectureType === 'video' ? 'https://...' : newLectureType === 'pdf' ? 'https://...' : 'Quiz ID'"
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
          />
          <textarea
            v-else
            v-model="newLectureContent"
            placeholder="Enter HTML content"
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            rows="3"
          />
        </div>
        <div class="flex justify-end gap-2">
          <Button variant="outline" @click="closeLectureModal">Cancel</Button>
          <Button @click="addLecture" :disabled="!newLectureTitle.trim() || !newLectureContent.trim()">Add</Button>
        </div>
      </div>
    </div>
  </div>
</template>