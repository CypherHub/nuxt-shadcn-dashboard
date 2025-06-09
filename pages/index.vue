<script setup lang="ts">
import { Book, GraduationCap } from 'lucide-vue-next'

// Sample course data - in a real app, this would come from your backend
const courses = ref([
  {
    id: '1',
    title: 'Introduction to Web Development',
    description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript.',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=300&fit=crop',
    enrolled: true,
  },
  {
    id: '2',
    title: 'Advanced JavaScript',
    description: 'Master modern JavaScript concepts including ES6+, async programming, and design patterns.',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&h=300&fit=crop',
    enrolled: false,
  },
  {
    id: '3',
    title: 'Vue.js Masterclass',
    description: 'Build modern web applications with Vue.js, from basics to advanced concepts.',
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&h=300&fit=crop',
    enrolled: true,
  },
  {
    id: '4',
    title: 'UI/UX Design Fundamentals',
    description: 'Learn the principles of user interface and user experience design.',
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
    enrolled: false,
  },
])

const showAllCourses = ref(!courses.value.some(course => course.enrolled))
const router = useRouter()

const navigateToCourse = (courseId: string) => {
  router.push(`/courses/${courseId}`)
}

const displayedCourses = computed(() => {
  return showAllCourses.value ? courses.value : courses.value.filter(course => course.enrolled)
})
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
      <div v-if="displayedCourses.length === 0" class="text-center py-8">
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
              :src="course.imageUrl"
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
