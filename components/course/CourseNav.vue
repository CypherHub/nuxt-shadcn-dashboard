<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Course } from '~/models/Course'

const props = defineProps<{
  course: Course | null
  isCollapsed: boolean
}>()

const emit = defineEmits<{
  (e: 'expand'): void
  (e: 'collapse'): void
}>()

const { user } = useUser()

const navLinks = computed(() => {
  const baseLinks = [
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
  ]

  // Only add these links if user is not a student
  if (user.value?.role !== 'student') {
    baseLinks.push(
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
      {
        title: 'Edit',
        icon: 'lucide:settings',
        variant: 'ghost',
        to: computed(() => `/edit-course/${props.course?.id}`)
      }
    )
  }

  return baseLinks
})

function onCollapse() {
  emit('collapse')
}

function onExpand() {
  emit('expand')
}
</script>

<template>
  <div
    :class="[
      'border-r',
      isCollapsed ? 'w-[50px]' : 'w-[140px]',
      'transition-all duration-300 ease-in-out'
    ]"
  >
    <div class="flex h-[56px] items-center justify-center px-2">
      <h2 class="text-lg font-semibold truncate">
        {{ course?.title || 'Course' }}
      </h2>
    </div>
    <Separator />
    <nav class="flex flex-col gap-1 p-2">
      <NuxtLink
        v-for="link in navLinks"
        :key="link.title"
        :to="link.to"
        class="w-full"
      >
        <Button
          :variant="link.variant"
          class="w-full justify-start"
        >
          <Icon :name="link.icon" class="mr-2 h-4 w-4" />
          <span v-if="!isCollapsed">{{ link.title }}</span>
        </Button>
      </NuxtLink>
    </nav>
  </div>
</template>