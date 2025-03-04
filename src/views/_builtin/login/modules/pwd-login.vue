<script setup lang="ts">
import { computed, ref } from 'vue';
import { loginModuleRecord } from '@/constants/app';
import { useRouterPush } from '@/hooks/common/router';
import { useForm, useFormRules } from '@/hooks/common/form';
import { useAuthStore } from '@/store/modules/auth';

defineOptions({ name: 'PwdLogin' });

const authStore = useAuthStore();
const { toggleLoginModule } = useRouterPush();
const { formRef, validate } = useForm();

interface FormModel {
  userName: string;
  password: string;
}

const model = ref<FormModel>({
  userName: 'Soybean',
  password: '123456'
});

const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  const { formRules } = useFormRules();

  return {
    userName: formRules.userName,
    password: formRules.pwd
  };
});

async function handleSubmit() {
  await validate();
  await authStore.login(model.value.userName, model.value.password);
}

type AccountKey = 'super' | 'admin' | 'user';

interface Account {
  key: AccountKey;
  label: string;
  userName: string;
  password: string;
}

const accounts = computed<Account[]>(() => [
  {
    key: 'super',
    label: '超级管理员',
    userName: 'Super',
    password: '123456'
  },
  {
    key: 'admin',
    label:'管理员',
    userName: 'Admin',
    password: '123456'
  },
  {
    key: 'user',
    label:'普通用户',
    userName: 'User',
    password: '123456'
  }
]);

async function handleAccountLogin(account: Account) {
  await authStore.login(account.userName, account.password);
}
</script>

<template>
  <ElForm ref="formRef" :model="model" :rules="rules" size="large" :show-label="false" @keyup.enter="handleSubmit">
    <ElFormItem prop="userName">
      <ElInput v-model="model.userName" :placeholder="'请输入用户名'" />
    </ElFormItem>
    <ElFormItem prop="password">
      <ElInput
        v-model="model.password"
        type="password"
        show-password-on="click"
        :placeholder="'请输入密码'"
      />
    </ElFormItem>
    <ElSpace direction="vertical" :size="24" class="w-full" fill>
      <div class="flex-y-center justify-between">
        <ElCheckbox>{{ '记住我' }}</ElCheckbox>
        <ElButton text @click="toggleLoginModule('reset-pwd')">
          {{ '忘记密码？' }}
        </ElButton>
      </div>
      <ElButton type="primary" size="large" round block :loading="authStore.loginLoading" @click="handleSubmit">
        确认
      </ElButton>
      <div class="flex-y-center justify-between gap-[12px]">
        <ElButton class="flex-1" size="default" @click="toggleLoginModule('code-login')">
          {{ loginModuleRecord['code-login'] }}
        </ElButton>
        <ElButton class="flex-1" size="default" @click="toggleLoginModule('register')">
          {{ loginModuleRecord.register }}
        </ElButton>
      </div>
      <ElDivider class="text-[14px] text-[#666] !m-0">{{ '其他账号登录' }}</ElDivider>
      <div class="flex justify-center items-center gap-[12px]">
        <ElButton
          v-for="item in accounts"
          :key="item.key"
          size="default"
          type="primary"
          :disabled="authStore.loginLoading"
          @click="handleAccountLogin(item)"
        >
          {{ item.label }}
        </ElButton>
      </div>
    </ElSpace>
  </ElForm>
</template>

<style scoped></style>
