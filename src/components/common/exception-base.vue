<script lang="ts" setup>
import { useRouterPush } from '@/hooks/common/router'

import { computed } from 'vue'

defineOptions({
  name: 'ExceptionBase',
})

const props = defineProps<Props>()

type ExceptionType = '403' | '404' | '500'

type Props = {

  /**
   * Exception type
   *
   * - 403: no permission
   * - 404: not found
   * - 500: service error
   */
  type: ExceptionType
}

const { routerPushByKey } = useRouterPush()

const iconMap: Record<ExceptionType, string> = {
  403: 'no-permission',
  404: 'not-found',
  500: 'service-error',
}

const icon = computed(() => iconMap[props.type])
</script>

<template>
  <div
    class="size-full min-h-[520px] flex-col-center gap-[24px] overflow-hidden"
  >
    <div
      class="flex text-[400px] text-primary"
    >
      <SvgIcon
        :local-icon="icon"
      />
    </div>

    <ElButton
      type="primary"
      @click="routerPushByKey('root')"
    >
      {{ '返回首页' }}
    </ElButton>
  </div>
</template>

<style scoped></style>
