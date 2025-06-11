<template>
  <div class="min-h-screen bg-[#E5F5FA]">
    <TopBar />
    <CreateCourseTabs :tab="activeTab" @update:tab="activeTab = $event" />
    <div class="px-6 py-4">
      <CourseSettings v-if="activeTab === 'settings'" />
      <CourseContent v-else-if="activeTab === 'content'" />
      <CoursePreview v-else-if="activeTab === 'preview'" />
    </div>
    <Footer />
  </div>
</template>

<script>
import TopBar from './createCourse/components/TopBar.vue';
import CreateCourseTabs from './createCourse/components/CreateCourseTabs.vue';
import CourseSettings from './createCourse/components/CourseSettings.vue';
import CourseContent from './createCourse/components/CourseContent.vue';
import CoursePreview from './createCourse/components/CoursePreview.vue';
import Footer from './createCourse/components/Footer.vue';

export default {
  components: {
    TopBar,
    CreateCourseTabs,
    CourseSettings,
    CourseContent,
    CoursePreview,
    Footer,
  },
  data() {
    return {
      activeTab: 'settings',
    };
  },
};
</script>



<!-- <template>
  <div class="min-h-screen bg-blue-50">
    <div class="flex items-center justify-between p-4 shadow bg-white">
      <div class="flex items-center gap-2">
        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 7h18M3 12h18M3 17h18" />
        </svg>
        <h1 class="text-2xl font-semibold text-blue-600">Course Forge</h1>
      </div>
      <button class="flex items-center gap-2 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H3" />
        </svg>
        Save Course
      </button>
    </div>

    <div class="flex gap-2 py-2 pl-6 w-fit">
      <div class="flex gap-2 p-1 bg-blue-200 items-center w-fit">
        <button
          @click="activeTab = 'settings'"
          class="px-4 py-2 text-sm font-medium text-blue-600 rounded"
          :class="{ 'bg-white': activeTab === 'settings', '': activeTab !== 'settings' }"
        >
          Course Settings
        </button>
        <button
          @click="activeTab = 'content'"
          class="px-4 py-2 text-sm font-medium text-blue-600 rounded "
          :class="{ 'bg-white': activeTab === 'content', '': activeTab !== 'content' }"
        >
          Content
        </button>
        <button
          @click="activeTab = 'preview'"
          class="px-4 py-2 text-sm font-medium text-blue-600 rounded "
          :class="{ 'bg-white': activeTab === 'preview', '': activeTab !== 'preview' }"
        >
          Preview
        </button>
      </div>
    </div>

    <div class="px-6 py-4">
      <div v-if="activeTab === 'settings'" class="p-6 bg-white rounded shadow">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Course Details</h2>
        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium text-gray-700">Course Title</label>
          <input
            type="text"
            placeholder="e.g., Introduction to Web Development"
            class="w-full p-3 text-sm rounded bg-blue-100 focus:outline-none"
          />
        </div>
        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium text-gray-700">Course Description</label>
          <textarea
            rows="5"
            placeholder="Describe your course..."
            class="w-full p-3 text-sm rounded bg-blue-100 focus:outline-none"
          ></textarea>
        </div>
        <button class="flex items-center gap-2 px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-600">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Suggest Sections with AI
        </button>
      </div>

      <div v-if="activeTab === 'content'" class="p-6 bg-white rounded shadow">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Course Content</h2>
        <p class="text-sm text-gray-500 mb-4">Organize your course into sections and lectures.</p>
        <div class="flex justify-end mb-4">
          <button class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">+ Add Section</button>
        </div>
        <div class="flex flex-col items-center justify-center h-64 text-center text-gray-400">
          <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-lg">No sections yet.</p>
          <p class="text-sm">Start by adding a section to your course.</p>
        </div>
      </div>

      <div v-if="activeTab === 'preview'" class="p-6 bg-white rounded shadow">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Untitled Course</h2>
        <p class="text-sm text-gray-500 mb-4">No description provided.</p>
        <div class="flex flex-col items-center justify-center h-64 text-center text-gray-400">
          <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p class="text-lg">Course content will appear here.</p>
          <p class="text-sm">Add sections and lectures in the 'Content' tab.</p>
        </div>
      </div>
    </div>

    <footer class="px-6 py-6 text-sm text-center text-gray-600">
      © 2025 Course Forge. Built with Next.js & ShadCN.
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 'settings', 
    };
  },
};
</script>

<style scoped>
.bg-blue-200 {
  background-color: #e6f0fa;
}
button {
  transition: background-color 0.3s;
}
</style> -->