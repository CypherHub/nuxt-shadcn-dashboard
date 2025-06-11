<!-- components/course/CourseSettingsTab.vue -->
<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-vue-next'
import { toast } from '~/components/ui/toast'
import type { Course } from '~/models/Course'

const props = defineProps<{
  course: Course | null
}>()

const emit = defineEmits<{
  (e: 'saved'): void
}>()

const courseTitle = ref(props.course?.title || '')
const courseDescription = ref(props.course?.description || '')
const { updateCourse } = useCourse()
const loading = ref(false)

const handleSave = async () => {
  if (!props.course?.id) {
    toast({
      title: "Error",
      description: "No course ID available",
      variant: "destructive"
    })
    return
  }

  if (!courseTitle.value.trim()) {
    toast({
      title: "Error",
      description: "Please enter a course title",
      variant: "destructive"
    })
    return
  }

  try {
    loading.value = true
    
    await updateCourse(props.course.id, {
      title: courseTitle.value,
      description: courseDescription.value
    })
    
    toast({
      title: "Success",
      description: "Course updated successfully"
    })
    
    emit('saved')
  } catch (e: any) {
    toast({
      title: "Error",
      description: e.message || "Failed to update course",
      variant: "destructive"
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Course Details</CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="space-y-2">
        <label for="title" class="text-sm font-medium">Title</label>
        <Input
          id="title"
          v-model="courseTitle"
          placeholder="Enter course title"
          :disabled="loading"
        />
      </div>
      <div class="space-y-2">
        <label for="description" class="text-sm font-medium">Description</label>
        <Textarea
          id="description"
          v-model="courseDescription"
          placeholder="Enter course description"
          class="min-h-[100px]"
          :disabled="loading"
        />
      </div>
      <div class="flex justify-end">
        <Button 
          @click="handleSave"
          :disabled="loading"
        >
          <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
          {{ loading ? 'Saving...' : 'Save' }}
        </Button>
      </div>
    </CardContent>
  </Card>
</template>