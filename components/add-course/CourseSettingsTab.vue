<!-- components/course/CourseSettingsTab.vue -->
<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const courseTitle = ref('')
const courseDescription = ref('')

const handleSave = () => {
  // TODO: Implement save functionality
  console.log('Saving course:', { title: courseTitle.value, description: courseDescription.value })
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
        />
      </div>
      <div class="space-y-2">
        <label for="description" class="text-sm font-medium">Description</label>
        <Textarea
          id="description"
          v-model="courseDescription"
          placeholder="Enter course description"
          class="min-h-[100px]"
        />
      </div>
      <div class="flex justify-end">
        <Button @click="handleSave">Save</Button>
      </div>
    </CardContent>
  </Card>
</template>