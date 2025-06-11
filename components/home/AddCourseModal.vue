<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import type { Course } from '~/models/Course'
import { toast } from '~/components/ui/toast'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'course-created': []
}>()

const { user } = useAuth()
const { createCourse } = useCourse()

const newCourse = ref({
  title: '',
  description: '',
  courseImageUrl: ''
})

const isSubmitting = ref(false)

const handleAddCourse = async () => {
  if (!user.value) {
    toast({
      title: "Error",
      description: "You must be logged in to create a course",
      variant: "destructive"
    })
    return
  }

  if (!newCourse.value.title || !newCourse.value.description) {
    toast({
      title: "Error",
      description: "Title and description are required",
      variant: "destructive"
    })
    return
  }

  try {
    isSubmitting.value = true

    const courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'> = {
      title: newCourse.value.title,
      description: newCourse.value.description,
      courseImageUrl: newCourse.value.courseImageUrl || null,
      teacherIds: [user.value.uid],
      sections: []
    }

    await createCourse(courseData)
    
    toast({
      title: "Success",
      description: "Course created successfully",
    })
    
    // Reset form and close modal
    newCourse.value = {
      title: '',
      description: '',
      courseImageUrl: ''
    }
    emit('course-created')
    emit('update:open', false)
  } catch (e: any) {
    toast({
      title: "Error",
      description: e.message || "Failed to create course",
      variant: "destructive"
    })
    console.error('Failed to create course:', e)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="(value) => emit('update:open', value)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add New Course</DialogTitle>
        <DialogDescription>
          Fill in the details to create a new course.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid gap-2">
          <Label for="title">Course Title</Label>
          <Input
            id="title"
            v-model="newCourse.title"
            placeholder="Enter course title"
            :disabled="isSubmitting"
          />
        </div>
        <div class="grid gap-2">
          <Label for="description">Course Description</Label>
          <Textarea
            id="description"
            v-model="newCourse.description"
            placeholder="Enter course description"
            :disabled="isSubmitting"
          />
        </div>
        <div class="grid gap-2">
          <Label for="imageUrl">Course Image URL</Label>
          <Input
            id="imageUrl"
            v-model="newCourse.courseImageUrl"
            placeholder="Enter image URL"
            :disabled="isSubmitting"
          />
        </div>
      </div>
      <DialogFooter>
        <Button 
          type="submit" 
          @click="handleAddCourse"
          :disabled="isSubmitting"
        >
          <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
          {{ isSubmitting ? 'Creating...' : 'Create Course' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>