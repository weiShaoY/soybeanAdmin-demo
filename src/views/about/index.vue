<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'

import { computed } from 'vue'

import pkg from '~/package.json'

defineOptions({
  name: 'AboutPage',
})

const appStore = useAppStore()

const column = computed(() => (appStore.isMobile ? 1 : 2))

type PkgJson = {
  name: string
  version: string
  dependencies: PkgVersionInfo[]
  devDependencies: PkgVersionInfo[]
}

type PkgVersionInfo = {
  name: string
  version: string
}

const { name, version, dependencies, devDependencies } = pkg

function transformVersionData(tuple: [string, string]): PkgVersionInfo {
  const [$name, $version] = tuple

  return {
    name: $name,
    version: $version,
  }
}

const pkgJson: PkgJson = {
  name,
  version,
  dependencies: Object.entries(dependencies).map(item => transformVersionData(item)),
  devDependencies: Object.entries(devDependencies).map(item => transformVersionData(item)),
}

const latestBuildTime = BUILD_TIME
</script>

<template>
  <ElSpace
    direction="vertical"
    fill
    :size="16"
  >
    <ElCard
      header="关于"
      size="small"
      segmented
      class="card-wrapper"
    >
      <p>
        `SoybeanAdmin 是一个优雅且功能强大的后台管理模板，基于最新的前端技术栈，包括 Vue3, Vite5, TypeScript, Pinia 和 UnoCSS。它内置了丰富的主题配置和组件，代码规范严谨，实现了自动化的文件路由系统。此外，它还采用了基于 ApiFox 的在线Mock数据方案。SoybeanAdmin 为您提供了一站式的后台管理解决方案，无需额外配置，开箱即用。同样是一个快速学习前沿技术的最佳实践。`
      </p>
    </ElCard>

    <ElCard
      header="项目信息"
      size="small"
      class="card-wrapper"
    >
      <ElDescriptions
        label-placement="left"
        border
        :column="column"
      >
        <ElDescriptionsItem
          label="版本"
        >
          <ElTag
            type="primary"
          >
            {{ pkgJson.version }}
          </ElTag>
        </ElDescriptionsItem>

        <ElDescriptionsItem
          label="最新构建时间"
        >
          <ElTag
            type="primary"
          >
            {{ latestBuildTime }}
          </ElTag>
        </ElDescriptionsItem>

        <ElDescriptionsItem
          label="Github 地址"
        >
          <a
            class="text-primary"
            :href="pkg.homepage"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github 地址          </a>
        </ElDescriptionsItem>

        <ElDescriptionsItem
          label="预览地址"
        >
          <a
            class="text-primary"
            :href="pkg.website"
            target="_blank"
            rel="noopener noreferrer"
          >
            预览地址          </a>
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElCard>

    <ElCard
      header="生产依赖"
      class="card-wrapper"
    >
      <ElDescriptions
        label-placement="left"
        border
        :column="column"
      >
        <ElDescriptionsItem
          v-for="item in pkgJson.dependencies"
          :key="item.name"
          :label="item.name"
        >
          {{ item.version }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElCard>

    <ElCard
      header="开发依赖"
      class="card-wrapper"
    >
      <ElDescriptions
        label-placement="left"
        border
        :column="column"
      >
        <ElDescriptionsItem
          v-for="item in pkgJson.devDependencies"
          :key="item.name"
          :label="item.name"
        >
          {{ item.version }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElCard>
  </ElSpace>
</template>

<style scoped></style>
