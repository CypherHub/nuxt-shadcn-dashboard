<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import type { Course, Lecture } from '~/models/Course'
import { toast } from '~/components/ui/toast'

// Change props to accept the full course object
const props = defineProps<{
  course: Course | null
}>()

// Import and use the course composable
const { addSection, addLecture, loading, error } = useCourse()

const showSectionModal = ref(false)
const newSectionTitle = ref('')

const showLectureModal = ref(false)
const lectureSectionId = ref<string | null>(null)
const newLectureTitle = ref('')
const newLectureType = ref('video')
const newLectureContent = ref('')

// Initialize sections from the course prop
const sections = ref(props.course?.sections || [])

function openSectionModal() {
  showSectionModal.value = true
  newSectionTitle.value = ''
}

function closeSectionModal() {
  showSectionModal.value = false
  newSectionTitle.value = ''
}

async function handleAddSection() {
  if (newSectionTitle.value.trim() && props.course?.id) {
    try {
      await addSection(props.course.id, {
        title: newSectionTitle.value.trim(),
      })
      toast({
        title: "Success",
        description: "Section added successfully",
      })
      closeSectionModal()
    } catch (e: any) {
      console.error('Failed to add section:', e)
      toast({
        title: "Error",
        description: e.message || "Failed to add section",
        variant: "destructive"
      })
    }
  }
}

function openLectureModal(sectionId: string) {
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

async function handleAddLecture() {
  if (
    newLectureTitle.value.trim() &&
    newLectureContent.value.trim() &&
    lectureSectionId.value !== null &&
    props.course?.id
  ) {
    try {
      const lectureData: Omit<Lecture, 'id' | 'createdAt' | 'updatedAt'> = {
        title: newLectureTitle.value.trim(),
        isVideo: newLectureType.value === 'video',
        isHTML: newLectureType.value === 'html',
        isPDF: newLectureType.value === 'pdf',
        isQuiz: newLectureType.value === 'quiz',
        videoUrl: newLectureType.value === 'video' ? newLectureContent.value.trim() : null,
        html: newLectureType.value === 'html' ? newLectureContent.value.trim() : null,
        pdfUrl: newLectureType.value === 'pdf' ? newLectureContent.value.trim() : null,
        quizId: newLectureType.value === 'quiz' ? newLectureContent.value.trim() : null,
      }

      await addLecture(props.course.id, lectureSectionId.value, lectureData)
      toast({
        title: "Success",
        description: "Lecture added successfully",
      })
      closeLectureModal()
    } catch (e: any) {
      console.error('Failed to add lecture:', e)
      toast({
        title: "Error",
        description: e.message || "Failed to add lecture",
        variant: "destructive"
      })
    }
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
      <Button variant="default" @click="openSectionModal">
        + Add Section
      </Button>
    </div>

    <!-- Section List -->
    <div v-if="sections.length > 0" class="space-y-6">
      <div
        v-for="section in sections"
        :key="section.id"
        class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm p-6"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-primary">{{ section.title }}</h3>
          <Button variant="secondary" size="sm" @click="openLectureModal(section.id)">+ Add Lecture</Button>
        </div>
        <ul class="space-y-2 pl-4">
          <li v-if="section.lectures.length === 0" class="text-muted-foreground italic">No lectures yet.</li>
          <li
            v-for="lecture in section.lectures"
            :key="lecture.id"
            class="flex items-center gap-2 bg-muted/60 border-l-4 border-primary/40 rounded px-3 py-2"
          >
            <span class="inline-block w-2 h-2 rounded-full bg-primary/60 mr-2"></span>
            <span class="font-medium text-foreground">{{ lecture.title }}</span>
            <span class="text-xs text-muted-foreground">
              ({{ lecture.isVideo ? 'Video' : lecture.isHTML ? 'HTML' : lecture.isPDF ? 'PDF' : 'Quiz' }})
            </span>
            <span class="text-xs text-muted-foreground truncate max-w-xs">
              {{ lecture.isVideo ? lecture.videoUrl : lecture.isHTML ? 'HTML Content' : lecture.isPDF ? lecture.pdfUrl : lecture.quizId }}
            </span>
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
          @keyup.enter="handleAddSection"
        />
        <div class="flex justify-end gap-2">
          <Button variant="outline" @click="closeSectionModal">Cancel</Button>
          <Button variant="default" @click="handleAddSection" :disabled="!newSectionTitle.trim()">Add</Button>
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
          <Button variant="default" @click="handleAddLecture" :disabled="!newLectureTitle.trim() || !newLectureContent.trim()">Add</Button>
        </div>
      </div>
    </div>

    <!-- Add loading state -->
    <div v-if="loading" class="flex items-center justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <!-- Add error state -->
    <div v-if="error" class="text-red-500 text-center p-4">
      {{ error }}
    </div>
  </div>
</template>