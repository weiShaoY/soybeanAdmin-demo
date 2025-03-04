<script setup lang="ts">
import { useRouterPush } from '@/hooks/common/router'

import { useTabStore } from '@/store/modules/tab'

import { ref } from 'vue'

defineOptions({
  name: 'TabPage',
})

const tabStore = useTabStore()

const { routerPushByKey } = useRouterPush()

const tabLabel = ref('')

function changeTabLabel() {
  tabStore.setTabLabel(tabLabel.value)
}

function resetTabLabel() {
  tabStore.resetTabLabel()
}
</script>

<template>
  <ElSpace
    direction="vertical"
    fill
    :size="16"
  >
    <ElCard
      header="标签页操作"
      class="card-wrapper"
    >
      <ElDivider
        content-position="left"
      >
        {{ '添加标签页' }}
      </ElDivider>

      <ElButton
        @click="routerPushByKey('about')"
      >
        {{ '跳转到关于页面' }}
      </ElButton>

      <ElDivider
        content-position="left"
      >
        {{ '关闭标签页' }}
      </ElDivider>

      <ElSpace>
        <ElButton
          @click="tabStore.removeActiveTab"
        >
          {{ '关闭当前标签页' }}
        </ElButton>

        <ElButton
          @click="tabStore.removeTabByRouteName('about')"
        >
          {{ '关闭"关于"标签页' }}
        </ElButton>
      </ElSpace>

      <ElDivider
        content-position="left"
      >
        {{ '添加多标签页' }}
      </ElDivider>

      <ElSpace>
        <ElButton
          @click="routerPushByKey('function_multi-tab')"
        >
          {{ '跳转到多标签页页面' }}
        </ElButton>

        <ElButton
          @click="routerPushByKey('function_multi-tab', { query: { a: '1' } })"
        >
          {{ '跳转到多标签页页面(带有查询参数)' }}
        </ElButton>
      </ElSpace>
    </ElCard>

    <ElCard
      header="标签页标题"
      class="card-wrapper"
    >
      <ElDivider
        content-position="left"
      >
        {{ '修改标题' }}
      </ElDivider>

      <ElInput
        v-model="tabLabel"
        class="max-w-[240px]"
      >
        <template
          #append
        >
          <ElButton
            type="primary"
            @click="changeTabLabel"
          >
            {{ '修改' }}
          </ElButton>
        </template>
      </ElInput>

      <ElDivider
        content-position="left"
      >
        {{ '重置标题' }}
      </ElDivider>

      <ElButton
        type="danger"
        plain
        class="w-[80px]"
        @click="resetTabLabel"
      >
        {{ '重置' }}
      </ElButton>
    </ElCard>
  </ElSpace>
</template>

<style scoped></style>
