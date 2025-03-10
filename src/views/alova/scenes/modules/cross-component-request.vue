<script setup lang="ts">
import { accessAction } from '@sa/alova/client'

async function handleAutoRequestSend() {
  accessAction(/^autoRequest/, async ({ send }) => {
    await send()
  })
}
</script>

<template>
  <ElButton
    @click="handleAutoRequestSend"
  >
    手动触发所有自动请求
  </ElButton>
</template>
