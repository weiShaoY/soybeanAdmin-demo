<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useBoolean } from '@sa/hooks';
import { useForm, useFormRules } from '@/hooks/common/form';
import { enableStatusOptions } from '@/constants/business';
import MenuAuthModal from './menu-auth-modal.vue';
import ButtonAuthModal from './button-auth-modal.vue';

defineOptions({ name: 'RoleOperateDrawer' });

interface Props {
  /** the type of operation */
  operateType: UI.TableOperateType;
  /** the edit row data */
  rowData?: Api.SystemManage.Role | null;
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
const { bool: menuAuthVisible, setTrue: openMenuAuthModal } = useBoolean();
const { bool: buttonAuthVisible, setTrue: openButtonAuthModal } = useBoolean();

const title = computed(() => {
  const titles: Record<UI.TableOperateType, string> = {
    add: '新增角色',
    edit: '编辑角色'
  };
  return titles[props.operateType];
});

type Model = Pick<Api.SystemManage.Role, 'roleName' | 'roleCode' | 'roleDesc' | 'status'>;

const model = ref(createDefaultModel());

function createDefaultModel(): Model {
  return {
    roleName: '',
    roleCode: '',
    roleDesc: '',
    status: undefined
  };
}

type RuleKey = Exclude<keyof Model, 'roleDesc'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  roleName: defaultRequiredRule,
  roleCode: defaultRequiredRule,
  status: defaultRequiredRule
};

const roleId = computed(() => props.rowData?.id || -1);

const isEdit = computed(() => props.operateType === 'edit');

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
  }
});
</script>

<template>
  <ElDrawer v-model="visible" :title="title" :size="360">
    <ElForm ref="formRef" :model="model" :rules="rules" label-position="top">
      <ElFormItem :label="'角色名称'" prop="roleName">
        <ElInput v-model="model.roleName" :placeholder="'请输入角色名称'" />
      </ElFormItem>
      <ElFormItem :label="'角色编码'" prop="roleCode">
        <ElInput v-model="model.roleCode" :placeholder="'请输入角色编码'" />
      </ElFormItem>
      <ElFormItem :label="'角色状态'" prop="status">
        <ElRadioGroup v-model="model.status">
          <ElRadio v-for="{ label, value } in enableStatusOptions" :key="value" :value="value" :label="label" />
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem :label="'角色描述'" prop="roleDesc">
        <ElInput v-model="model.roleDesc" :placeholder="'请输入角色描述'" />
      </ElFormItem>
    </ElForm>
    <ElSpace v-if="isEdit">
      <ElButton @click="openMenuAuthModal">{{ '菜单权限' }}</ElButton>
      <MenuAuthModal v-model:visible="menuAuthVisible" :role-id="roleId" />
      <ElButton @click="openButtonAuthModal">{{ '按钮权限' }}</ElButton>
      <ButtonAuthModal v-model:visible="buttonAuthVisible" :role-id="roleId" />
    </ElSpace>
    <template #footer>
      <ElSpace :size="16">
        <ElButton @click="closeDrawer">取消</ElButton>
        <ElButton type="primary" @click="handleSubmit">{{ '确认' }}</ElButton>
      </ElSpace>
    </template>
  </ElDrawer>
</template>

<style scoped></style>
