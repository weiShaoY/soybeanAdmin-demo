<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouterPush } from '@/hooks/common/router';
import { useForm, useFormRules } from '@/hooks/common/form';

defineOptions({ name: 'ResetPwd' });

const { toggleLoginModule } = useRouterPush();
const { formRef, validate } = useForm();

interface FormModel {
  phone: string;
  code: string;
  password: string;
  confirmPassword: string;
}

const model = ref<FormModel>({
  phone: '',
  code: '',
  password: '',
  confirmPassword: ''
});

type RuleRecord = Partial<Record<keyof FormModel, App.Global.FormRule[]>>;

const rules = computed<RuleRecord>(() => {
  const { formRules, createConfirmPwdRule } = useFormRules();

  return {
    phone: formRules.phone,
    password: formRules.pwd,
    confirmPassword: createConfirmPwdRule(model.value.password)
  };
});

async function handleSubmit() {
  await validate();
  // request to reset password
  window.$message?.success('验证成功');
}
</script>

<template>
  <ElForm ref="formRef" :model="model" :rules="rules" size="large" :show-label="false" @keyup.enter="handleSubmit">
    <ElFormItem prop="phone">
      <ElInput v-model="model.phone" :placeholder="'请输入手机号'" />
    </ElFormItem>
    <ElFormItem prop="code">
      <ElInput v-model="model.code" :placeholder="'请输入验证码'" />
    </ElFormItem>
    <ElFormItem prop="password">
      <ElInput
        v-model="model.password"
        type="password"
        show-password-on="click"
        :placeholder="'请输入密码'"
      />
    </ElFormItem>
    <ElFormItem prop="confirmPassword">
      <ElInput
        v-model="model.confirmPassword"
        type="password"
        show-password-on="click"
        :placeholder="'请再次输入密码'"
      />
    </ElFormItem>
    <ElSpace direction="vertical" fill :size="18" class="w-full">
      <ElButton type="primary" size="large" round @click="handleSubmit">
        确认
      </ElButton>
      <ElButton size="large" round @click="toggleLoginModule('pwd-login')">
        返回
           </ElButton>
    </ElSpace>
  </ElForm>
</template>

<style scoped></style>
