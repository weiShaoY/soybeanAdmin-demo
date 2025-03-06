<script setup lang="ts">
import { BAIDU_MAP_SDK_URL } from '@/constants/map-sdk'

import { useScriptTag } from '@vueuse/core'

import { onMounted, ref } from 'vue'

defineOptions({
  name: 'BaiduMap',
})

window.HOST_TYPE = '2'

const { load } = useScriptTag(BAIDU_MAP_SDK_URL)

const domRef = ref<HTMLDivElement>()

async function renderMap() {
  await load(true)
  if (!domRef.value) {
    return
  }

  const map = new BMap.Map(domRef.value)

  const point = new BMap.Point(114.05834626586915, 22.546789983033168)

  map.centerAndZoom(point, 15)
  map.enableScrollWheelZoom()
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
