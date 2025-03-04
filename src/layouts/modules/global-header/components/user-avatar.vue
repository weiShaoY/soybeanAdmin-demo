<script setup lang="ts">
import { computed } from 'vue';
import type { VNode } from 'vue';
import { useAuthStore } from '@/store/modules/auth';
import { useRouterPush } from '@/hooks/common/router';
import { useSvgIcon } from '@/hooks/common/icon';

defineOptions({ name: 'UserAvatar' });

const authStore = useAuthStore();
const { routerPushByKey, toLogin } = useRouterPush();
const { SvgIconVNode } = useSvgIcon();

function loginOrRegister() {
  toLogin();
}

type DropdownKey = 'user-center' | 'logout';

type DropdownOption = {
  key: DropdownKey;
  label: string;
  icon?: () => VNode;
};

const options = computed(() => {
  const opts: DropdownOption[] = [
    {
      label: '个人中心',
      key: 'user-center',
      icon: SvgIconVNode({ icon: 'ph:user-circle', fontSize: 18 })
    },
    {
      label:'退出登录',
      key: 'logout',
      icon: SvgIconVNode({ icon: 'ph:sign-out', fontSize: 18 })
    }
  ];

  return opts;
});

function logout() {
  window.$messageBox
    ?.confirm('确认退出登录吗？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText:'取消',
      type: 'warning'
    })
    .then(() => {
      authStore.resetStore();
    });
}

function handleDropdown(key: DropdownKey) {
  if (key === 'logout') {
    logout();
  } else {
    // If your other options are jumps from other routes, they will be directly supported here
    routerPushByKey(key);
  }
}
</script>

<template>
  <ElButton v-if="!authStore.isLogin" text @click="loginOrRegister">
    {{ '登录 / 注册' }}
  </ElButton>

  <ElDropdown class="px-[14px]" trigger="click" @command="handleDropdown">
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem
          v-for="{ key, label, icon } in options"
          :key="key"
          class="mx-[4px] my-[1px] rounded-[6px]"
          :icon="icon"
          :command="key"
        >
          {{ label }}
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
    <div class="flex items-center">
      <SvgIcon icon="ph:user-circle" class="mr-[5px] text-icon-large" />
      <span class="text-[16px] font-medium">{{ authStore.userInfo.userName }}</span>
    </div>
  </ElDropdown>
</template>

<style scoped></style>
