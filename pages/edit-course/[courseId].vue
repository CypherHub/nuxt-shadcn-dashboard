<!-- pages/add-course.vue -->
<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import CourseSettingsTab from '@/components/edit-course/CourseSettingsTab.vue'
import CourseContentTab from '@/components/edit-course/CourseContentTab.vue'
import CoursePreviewTab from '@/components/edit-course/CoursePreviewTab.vue'
import type { Course } from '~/models/Course'

const route = useRoute()
const courseId = route.params.courseId as string
const { fetchCourseById } = useCourse()
const course = ref<Course | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    course.value = await fetchCourseById(courseId)
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="w-full flex flex-col gap-4">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <h2 class="text-2xl font-bold tracking-tight">
        Edit Course
      </h2>
      
    </div>

    <div v-if="loading" class="flex justify-center items-center h-40">
      <p>Loading course data...</p>
    </div>

    <div v-else-if="error" class="flex justify-center items-center h-40">
      <p class="text-red-500">{{ error }}</p>
    </div>

    <Tabs v-else default-value="settings" class="w-full">
      <TabsList class="grid w-full grid-cols-3">
        <TabsTrigger value="settings">Course Settings</TabsTrigger>
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>

      <TabsContent value="settings">
        <CourseSettingsTab :course="course" />
      </TabsContent>

      <TabsContent value="content">
        <CourseContentTab :course="course" />
      </TabsContent>

      <TabsContent value="preview">
        <CoursePreviewTab :course="course" />
      </TabsContent>
    </Tabs>
  </div>
</template>