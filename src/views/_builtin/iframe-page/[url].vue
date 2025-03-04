<script setup lang="ts">
import { onActivated, onMounted } from 'vue'

type Props = {
  url: string
}

defineProps<Props>()

onMounted(() => {
  // console.log('mounted');
})

onActivated(() => {
  // console.log('activated');
})
</script>

<template>
  <div
    class="h-full"
  >
    <iframe
      id="iframePage"
      class="size-full"
      :src="url"
    />
  </div>
</template>

<style scoped></style>
