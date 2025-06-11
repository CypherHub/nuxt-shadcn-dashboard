<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCourse } from '~/composables/useCourse'
import { useEnrollment } from '~/composables/useEnrollment'
import type { Course, Section, Lecture } from '~/models/Course'
import type { Enrollment } from '~/models/Enrollment'
import { Home, BookOpen, Users, HelpCircle, Loader2 } from 'lucide-vue-next'
import CourseNav from '~/components/course/CourseNav.vue'
import { Button } from '~/components/ui/button'
import { Progress } from '~/components/ui/progress'

const route = useRoute()
const courseId = route.params.courseId as string

// Make refs type-safe
const course = ref<Course | null>(null)
const sections = ref<Section[]>([])
const lectures = ref<Lecture[]>([])
const progress = ref(0)
const isCollapsed = ref(false)
const enrollment = ref<Enrollment | null>(null)

const { fetchCourseById } = useCourse()
const { getAllEnrolledCourses, createEnrollment } = useEnrollment()

// Add loading state for enrollment
const isEnrolling = ref(false)

const fetchCourseDetails = async () => {
  try {
    const data = await fetchCourseById(courseId)
    course.value = data
    sections.value = data.sections || []
    lectures.value = data.sections?.flatMap(section => section.lectures) || []
    progress.value = 0 // TODO: Implement progress calculation
  } catch (e) {
    console.error('Error fetching course details:', e)
  }
}

function onCollapse() {
  isCollapsed.value = true
}

function onExpand() {
  isCollapsed.value = false
}

// Add function to handle enrollment
const handleEnroll = async () => {
  try {
    isEnrolling.value = true
    const newEnrollment = await createEnrollment(courseId)
    enrollment.value = newEnrollment
    progress.value = 0 // Reset progress for new enrollment
  } catch (e) {
    console.error('Error enrolling in course:', e)
  } finally {
    isEnrolling.value = false
  }
}

onMounted(async () => {
  await fetchCourseDetails()
  let allEnrollments = await getAllEnrolledCourses()
  console.log('[courses/[courseId].vue] allEnrollments', allEnrollments)
  enrollment.value = allEnrollments.find((enrollment) => enrollment.courseId === courseId) || null
  console.log('[courses/[courseId].vue] enrollment', enrollment.value)
})
</script>

<template>
  <div class="h-full">
    <ResizablePanelGroup
      id="course-panel-group"
      direction="horizontal"
      class="h-full max-h-[calc(100dvh-53px-3rem)] items-stretch"
    >
      <!-- Left Side Navigation -->
      <CourseNav
        :course="course"
        :is-collapsed="isCollapsed"
        @expand="onExpand"
        @collapse="onCollapse"
      />


      <!-- Right Side Content -->
      <ResizablePanel id="course-content-panel" :default-size="82" :min-size="30">
        <div class="container p-6">
          <div v-if="course" class="space-y-6">
            <!-- Course Header -->
            <div class="flex items-start gap-6">
              <img 
                :src="course.courseImageUrl || '/images/default-course.jpg'" 
                :alt="course.title" 
                class="w-48 h-32 object-cover rounded-lg"
              >
              <div class="space-y-2">
                <h1 class="text-2xl font-bold">{{ course.title }}</h1>
                <p class="text-muted-foreground">{{ course.description }}</p>
                <div v-if="enrollment" class="flex items-center gap-2">
                  <Progress :value="enrollment.overallProgress" class="w-[200px]" />
                  <span class="text-sm text-muted-foreground">{{ enrollment.overallProgress }}% Complete</span>
                </div>
                <div v-else class="flex items-center gap-2">
                  <Button 
                    :disabled="isEnrolling" 
                    @click="handleEnroll"
                    class="w-[200px]"
                  >
                    <Loader2 v-if="isEnrolling" class="mr-2 h-4 w-4 animate-spin" />
                    {{ isEnrolling ? 'Enrolling...' : 'Enroll in Course' }}
                  </Button>
                </div>
              </div>
            </div>

            <!-- Course Content -->
            <div v-if="sections.length > 0" class="space-y-4">
              <h2 class="text-xl font-semibold">Course Content</h2>
              <div class="space-y-2">
                <div v-for="section in sections" :key="section.id" class="border rounded-lg p-4">
                  <h3 class="font-medium mb-2">{{ section.title }}</h3>
                  <ul class="space-y-2">
                    <li v-for="lecture in section.lectures" :key="lecture.id" class="flex items-center gap-2">
                      <Icon 
                        :name="lecture.isVideo ? 'lucide:video' : lecture.isHTML ? 'lucide:file-text' : lecture.isPDF ? 'lucide:file-pdf' : 'lucide:help-circle'" 
                        class="h-4 w-4"
                      />
                      <span>{{ lecture.title }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-muted-foreground">
              No sections available for this course.
            </div>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
</template>
