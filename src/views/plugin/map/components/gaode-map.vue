<script setup lang="ts">
import { AMAP_SDK_URL } from '@/constants/map-sdk'

import { useScriptTag } from '@vueuse/core'

import { onMounted, ref } from 'vue'

defineOptions({
  name: 'GaodeMap',
})

const { load } = useScriptTag(AMAP_SDK_URL)

const domRef = ref<HTMLDivElement>()

async function renderMap() {
  await load(true)
  if (!domRef.value) { return }

  const map = new AMap.Map(domRef.value, {
    zoom: 11,
    center: [114.05834626586915, 22.546789983033168],
    viewMode: '3D',
  })

  map.getCenter()
}

onMounted(() => {
  renderMap()
})
</script>

<template>
  <div
    ref="domRef"
    class="h-full w-full"
  />
</template>

<style scoped></style>
