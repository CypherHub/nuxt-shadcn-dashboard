<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCourse } from '~/composables/useCourse'
import type { Course, Section, Lecture } from '~/models/Course'

const route = useRoute()
const courseId = route.params.courseId as string

// Make refs type-safe
const course = ref<Course | null>(null)
const sections = ref<Section[]>([])
const lectures = ref<Lecture[]>([])
const progress = ref(0)

const { fetchCourseById } = useCourse()

const fetchCourseDetails = async () => {
  try {
    const data = await fetchCourseById(courseId)
    course.value = data
    sections.value = data.sections || []
    // Flatten all lectures from all sections
    lectures.value = data.sections?.flatMap(section => section.lectures) || []
    // You might want to calculate progress based on completed lectures
    progress.value = 0 // TODO: Implement progress calculation
  } catch (e) {
    console.error('Error fetching course details:', e)
  }
}

onMounted(() => {
  fetchCourseDetails()
})
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <h1>Course Details</h1>
      </div>
    </div>
    <div v-if="course" class="row">
      <div class="col-md-4">
        <img 
          :src="course.courseImageUrl || '/images/default-course.jpg'" 
          :alt="course.title" 
          class="img-fluid"
        >
      </div>
      <div class="col-md-8">
        <h2>{{ course.title }}</h2>
        <p>{{ course.description }}</p>
        <p>Progress: {{ progress }}%</p>
      </div>
    </div>
    <div v-if="sections.length > 0" class="row">
      <div class="col-md-12">
        <h3>Sections</h3>
        <ul>
          <li v-for="section in sections" :key="section.id">
            {{ section.title }}
            <ul v-if="section.lectures.length > 0">
              <li v-for="lecture in section.lectures" :key="lecture.id">
                {{ lecture.title }}
                <span v-if="lecture.isVideo">🎥</span>
                <span v-if="lecture.isHTML">📄</span>
                <span v-if="lecture.isPDF">📑</span>
                <span v-if="lecture.isQuiz">❓</span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <div v-else class="row">
      <div class="col-md-12">
        <p>No sections available for this course.</p>
      </div>
    </div>
  </div>
</template>
