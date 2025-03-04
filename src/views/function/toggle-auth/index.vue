<script setup lang="ts">
import { useAuth } from '@/hooks/business/auth'

import { useAppStore } from '@/store/modules/app'

import { useAuthStore } from '@/store/modules/auth'

import { useTabStore } from '@/store/modules/tab'

import { useLoading } from '@sa/hooks'

import { computed, ref } from 'vue'

import { useRoute } from 'vue-router'

defineOptions({
  name: 'ToggleAuth',
})

const route = useRoute()

const appStore = useAppStore()

const authStore = useAuthStore()

const tabStore = useTabStore()

const { hasAuth } = useAuth()

const { loading, startLoading, endLoading } = useLoading()

type AccountKey = 'super' | 'admin' | 'user'

type Account = {
  key: AccountKey
  label: string
  userName: string
  password: string
}

const accounts = computed<Account[]>(() => [
  {
    key: 'super',
    label: '超级管理员',
    userName: 'Super',
    password: '123456',
  },
  {
    key: 'admin',
    label: '管理员',
    userName: 'Admin',
    password: '123456',
  },
  {
    key: 'user',
    label: '普通用户',
    userName: 'User',
    password: '123456',
  },
])

const loginAccount = ref<AccountKey>('super')

async function handleToggleAccount(account: Account) {
  loginAccount.value = account.key

  startLoading()
  await authStore.login(account.userName, account.password, false)
  tabStore.initTabStore(route)
  endLoading()
  appStore.reloadPage()
}
</script>

<template>
  <ElSpace
    direction="vertical"
    fill
    :size="16"
  >
    <ElCard
      header="切换权限"
      class="card-wrapper"
    >
      <ElDescriptions
        direction="vertical"
        border
        :column="1"
      >
        <ElDescriptionsItem
          label="用户角色"
        >
          <ElSpace>
            <ElTag
              v-for="role in authStore.userInfo.roles"
              :key="role"
            >
              {{ role }}
            </ElTag>
          </ElSpace>
        </ElDescriptionsItem>

        <ElDescriptionsItem
          ions-item
          label="切换账号"
        >
          <ElSpace>
            <ElButton
              v-for="account in accounts"
              :key="account.key"
              :loading="loading && loginAccount === account.key"
              :disabled="loading && loginAccount !== account.key"
              @click="handleToggleAccount(account)"
            >
              {{ account.label }}
            </ElButton>
          </ElSpace>
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElCard>

    <ElCard
      header="权限钩子函数 `hasAuth`"
      class="card-wrapper"
    >
      <ElSpace>
        <ElButton
          v-if="hasAuth('B_CODE1')"
        >
          {{ '超级管理员可见' }}
        </ElButton>

        <ElButton
          v-if="hasAuth('B_CODE2')"
        >
          {{ '管理员可见' }}
        </ElButton>

        <ElButton
          v-if="hasAuth('B_CODE3')"
        >
          管理员和用户可见
        </ElButton>
      </ElSpace>
    </ElCard>
  </ElSpace>
</template>

<style scoped></style>
