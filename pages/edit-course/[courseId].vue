<!-- pages/add-course.vue -->
<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import CourseSettingsTab from '@/components/add-course/CourseSettingsTab.vue'
import CourseContentTab from '@/components/add-course/CourseContentTab.vue'
import CoursePreviewTab from '@/components/add-course/CoursePreviewTab.vue'
</script>

<template>
  <div class="w-full flex flex-col gap-4">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <h2 class="text-2xl font-bold tracking-tight">
        Edit Course
      </h2>
      
    </div>

    <Tabs default-value="settings" class="w-full">
      <TabsList class="grid w-full grid-cols-3">
        <TabsTrigger value="settings">Course Settings</TabsTrigger>
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>

      <TabsContent value="settings">
        <CourseSettingsTab />
      </TabsContent>

      <TabsContent value="content">
        <CourseContentTab />
      </TabsContent>

      <TabsContent value="preview">
        <CoursePreviewTab />
      </TabsContent>
    </Tabs>
  </div>
</template>