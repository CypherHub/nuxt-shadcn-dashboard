<!-- Tabs.vue -->
<template>
  <div class="flex gap-2 py-2 pl-6 w-fit">
    <div class="flex gap-2 p-1 bg-[#D9EBF2] text-[#29A9E0] items-center w-fit">
      <button @click="$emit('update:tab', 'settings')" class="px-4 py-2 text-sm font-medium rounded"
        :class="{ 'bg-[#E5F5FA] text-[#364365]': tab === 'settings' }">
        Course Settings
      </button>
      <button @click="$emit('update:tab', 'content')" class="px-4 py-2 text-sm font-medium  rounded"
        :class="{ 'bg-[#E5F5FA] text-[#364365]': tab === 'content' }">
        Content
      </button>
      <button @click="$emit('update:tab', 'preview')" class="px-4 py-2 text-sm font-medium rounded"
        :class="{ 'bg-[#E5F5FA] text-[#364365]': tab === 'preview' }">
        Preview
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tab: {
      type: String,
      required: true,
    },
  },
  emits: ['update:tab'],
};
</script>
