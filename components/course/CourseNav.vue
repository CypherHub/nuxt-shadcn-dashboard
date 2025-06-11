<script setup lang="ts">
import { ref } from 'vue'
import type { Course } from '~/models/Course'

const props = defineProps<{
  course: Course | null
  isCollapsed: boolean
}>()

const emit = defineEmits<{
  (e: 'expand'): void
  (e: 'collapse'): void
}>()

const navLinks = [
  {
    title: 'Home',
    icon: 'lucide:home',
    variant: 'default',
  },
  {
    title: 'Syllabus',
    icon: 'lucide:book-open',
    variant: 'ghost',
  },
  {
    title: 'People',
    icon: 'lucide:users',
    variant: 'ghost',
  },
  {
    title: 'Quizzes',
    icon: 'lucide:help-circle',
    variant: 'ghost',
  },
]

function onCollapse() {
  emit('collapse')
}

function onExpand() {
  emit('expand')
}
</script>

<template>
  <ResizablePanel
    id="course-nav-panel"
    :default-size="10"
    :collapsed-size="4"
    collapsible
    :min-size="10"
    :max-size="15"
    :class="cn(isCollapsed && 'min-w-[50px] transition-all duration-300 ease-in-out')"
    @expand="onExpand"
    @collapse="onCollapse"
  >
    <div class="flex h-[56px] items-center justify-center px-2">
      <h2 class="text-lg font-semibold truncate">
        {{ course?.title || 'Course' }}
      </h2>
    </div>
    <Separator />
    <nav class="flex flex-col gap-1 p-2">
      <Button
        v-for="link in navLinks"
        :key="link.title"
        :variant="link.variant"
        class="w-full justify-start"
      >
        <Icon :name="link.icon" class="mr-2 h-4 w-4" />
        <span v-if="!isCollapsed">{{ link.title }}</span>
      </Button>
    </nav>
  </ResizablePanel>
</template> 