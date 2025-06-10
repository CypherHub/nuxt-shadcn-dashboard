<script setup lang="ts">
import { Book, GraduationCap } from 'lucide-vue-next'
import type { Course } from '~/models/Course'

const { courses, loading: coursesLoading, error: coursesError, fetchCourses } = useCourse()
const { enrollments, loading: enrollmentsLoading, error: enrollmentsError, getAllEnrolledCourses } = useEnrollment()
const showAllCourses = ref(true)
const router = useRouter()

// Fetch courses when component is mounted
onMounted(async () => {
  try {
    await fetchCourses()
    await getAllEnrolledCourses()
  } catch (e) {
    console.error('Failed to fetch courses:', e)
  }
})

const navigateToCourse = (courseId: string) => {
  router.push(`/courses/${courseId}`)
}

const displayedCourses = computed(() => {
  if (showAllCourses.value) {
    return courses.value
  } else {
    // Get the set of enrolled course IDs for efficient lookup
    const enrolledCourseIds = new Set(enrollments.value.map(e => e.courseId))
    
    // Filter courses to only show enrolled ones and merge with enrollment data
    return courses.value
      .filter(course => enrolledCourseIds.has(course.id))
      .map(course => {
        const enrollment = enrollments.value.find(e => e.courseId === course.id)
        return {
          id: course.id,
          title: course.title,
          description: `Progress: ${enrollment?.overallProgress}% complete. Last accessed: ${new Date(enrollment?.lastAccessedAt || '').toLocaleDateString()}`,
          courseImageUrl: course.courseImageUrl
        }
      })
  }
}) as ComputedRef<Course[]>

const isLoading = computed(() => coursesLoading.value || enrollmentsLoading.value)
const error = computed(() => coursesError.value || enrollmentsError.value)
</script>

<template>
  <div class="w-full flex flex-col gap-4">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <h2 class="text-2xl font-bold tracking-tight">
        {{ showAllCourses ? 'All Courses' : 'My Enrolled Courses' }}
      </h2>
      <div class="flex items-center space-x-2">
        <Button
          variant="outline"
          @click="showAllCourses = !showAllCourses"
        >
          <component
            :is="showAllCourses ? GraduationCap : Book"
            class="mr-2 h-4 w-4"
          />
          {{ showAllCourses ? 'Show Enrolled Courses' : 'Show All Courses' }}
        </Button>
      </div>
    </div>
    <main class="flex flex-1 flex-col gap-4 md:gap-8">
      <div v-if="loading" class="text-center py-8">
        <p class="text-muted-foreground">Loading courses...</p>
      </div>
      <div v-else-if="error" class="text-center py-8">
        <p class="text-muted-foreground text-red-500">{{ error }}</p>
      </div>
      <div v-else-if="displayedCourses.length === 0" class="text-center py-8">
        <p class="text-muted-foreground">
          {{ showAllCourses ? 'No courses available.' : 'You are not enrolled in any courses yet.' }}
        </p>
      </div>
      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card
          v-for="course in displayedCourses"
          :key="course.id"
          class="cursor-pointer transition-all hover:shadow-lg"
          @click="navigateToCourse(course.id)"
        >
          <CardHeader class="p-0">
            <img
              :src="course.courseImageUrl || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=300&fit=crop'"
              :alt="course.title"
              class="aspect-video w-full object-cover"
            />
          </CardHeader>
          <CardContent class="p-4">
            <h3 class="text-lg font-semibold">
              {{ course.title }}
            </h3>
            <p class="mt-2 text-sm text-muted-foreground">
              {{ course.description }}
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
</template>
