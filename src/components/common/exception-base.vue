<script lang="ts" setup>
import { useRouterPush } from '@/hooks/common/router'

import { computed } from 'vue'

defineOptions({
  name: 'ExceptionBase',
})

const props = defineProps<Props>()

/**
 *  异常类型
 */
type ExceptionType = '403' | '404' | '500'

// 组件属性定义
type Props = {

  /**
   * 异常类型
   *
   * - 403: 无权限访问
   * - 404: 页面未找到
   * - 500: 服务器错误
   */
  type: ExceptionType
}

const { routerPushByKey } = useRouterPush()

/**
 *  异常类型与图标的映射关系
 */
const iconMap: Record<ExceptionType, string> = {
  403: 'no-permission',
  404: 'not-found',
  500: 'service-error',
}

/**
 *  计算当前异常对应的图标
 */
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
