<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useForm, useFormRules } from '@/hooks/common/form';
import { fetchGetAllRoles } from '@/service/api';
import { enableStatusOptions, userGenderOptions } from '@/constants/business';

defineOptions({ name: 'UserOperateDrawer' });

interface Props {
  /** the type of operation */
  operateType: UI.TableOperateType;
  /** the edit row data */
  rowData?: Api.SystemManage.User | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, restoreValidation } = useForm();
const { defaultRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<UI.TableOperateType, string> = {
    add: '新增用户',
    edit: '编辑用户'
  };
  return titles[props.operateType];
});

type Model = Pick<
  Api.SystemManage.User,
  'userName' | 'userGender' | 'nickName' | 'userPhone' | 'userEmail' | 'userRoles' | 'status'
>;

const model = ref(createDefaultModel());

function createDefaultModel(): Model {
  return {
    userName: '',
    userGender: undefined,
    nickName: '',
    userPhone: '',
    userEmail: '',
    userRoles: [],
    status: undefined
  };
}

type RuleKey = Extract<keyof Model, 'userName' | 'status'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  userName: defaultRequiredRule,
  status: defaultRequiredRule
};

/** the enabled role options */
const roleOptions = ref<CommonType.Option<string>[]>([]);

async function getRoleOptions() {
  const { error, data } = await fetchGetAllRoles();

  if (!error) {
    const options = data.map(item => ({
      label: item.roleName,
      value: item.roleCode
    }));

    // the mock data does not have the roleCode, so fill it
    // if the real request, remove the following code
    const userRoleOptions = model.value.userRoles.map(item => ({
      label: item,
      value: item
    }));
    // end

    roleOptions.value = [...userRoleOptions, ...options];
  }
}

function handleInitModel() {
  model.value = createDefaultModel();

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, props.rowData);
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  // request
  window.$message?.success( '更新成功');
  closeDrawer();
  emit('submitted');
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
    getRoleOptions();
  }
});
</script>

<template>
  <ElDrawer v-model="visible" :title="title" :size="360">
    <ElForm ref="formRef" :model="model" :rules="rules" label-position="top">
      <ElFormItem :label="'用户名'" prop="userName">
        <ElInput v-model="model.userName" :placeholder="'请输入用户名'" />
      </ElFormItem>
      <ElFormItem :label="'性别'" prop="userGender">
        <ElRadioGroup v-model="model.userGender">
          <ElRadio v-for="item in userGenderOptions" :key="item.value" :value="item.value" :label="item.label" />
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem :label="'昵称'" prop="nickName">
        <ElInput v-model="model.nickName" :placeholder="'请输入昵称'" />
      </ElFormItem>
      <ElFormItem :label="'手机号'" prop="userPhone">
        <ElInput v-model="model.userPhone" :placeholder="'请输入手机号'" />
      </ElFormItem>
      <ElFormItem :label="'邮箱'" prop="email">
        <ElInput v-model="model.userEmail" :placeholder="'请输入邮箱'" />
      </ElFormItem>
      <ElFormItem :label="'用户状态'" prop="status">
        <ElRadioGroup v-model="model.status">
          <ElRadio v-for="item in enableStatusOptions" :key="item.value" :value="item.value" :label="item.label" />
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem :label="'用户角色'" prop="roles">
        <ElSelect v-model="model.userRoles" multiple :placeholder="'请选择用户角色'">
          <ElOption v-for="{ label, value } in roleOptions" :key="value" :label="label" :value="value" />
        </ElSelect>
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElSpace :size="16">
        <ElButton @click="closeDrawer">取消</ElButton>
        <ElButton type="primary" @click="handleSubmit">{{ '确认' }}</ElButton>
      </ElSpace>
    </template>
  </ElDrawer>
</template>

<style scoped></style>
