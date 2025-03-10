<script setup lang="ts">
import { alova } from '@/service-alova/request'

import { actionDelegationMiddleware, useAutoRequest } from '@sa/alova/client'

import { ref } from 'vue'

defineOptions({
  name: 'PollingRequest',
})

const getLastTime = alova.Get<{ time: string }>('/mock/getLastTime', {
  cacheFor: null,
})

const isStop = ref(false)

const { loading, data } = useAutoRequest(getLastTime, {
  pollingTime: 3000,
  initialData: {
    time: '',
  },
  async middleware(_, next) {
    await actionDelegationMiddleware('autoRequest:3')(_, () => Promise.resolve())
    if (!isStop.value) {
      next()
    }
  },
})

function toggleStop() {
  isStop.value = !isStop.value
}
</script>

<template>
  <ElSpace
    direction="vertical"
    fill
  >
    <ElAlert
      type="info"
      show-icon
    >
      {{ '每3秒自动请求一次' }}
    </ElAlert>

    <ElButton
      type="primary"
      @click="toggleStop"
    >
      <icon-carbon-play
        v-if="isStop"
        class="mr-2"
      />

      <icon-carbon-stop
        v-else
        class="mr-2"
      />
      {{ isStop ? '开始请求' : '停止请求' }}
    </ElButton>

    <ElSpace
      class="justify-center"
    >
      <span>{{ '更新时间' }}: {{ data.time || '--' }}</span>

      <SvgIcon
        v-if="loading"
        icon="line-md:loading-twotone-loop"
        class="text-[20px]"
      />
    </ElSpace>
  </ElSpace>
</template>
