<script setup lang="ts">
import { $t } from '@/locales';

/** 定义组件选项 */
defineOptions({ name: 'TableHeaderOperation' });

/** 组件属性类型 */
type Props = {
  /** 是否禁用删除按钮 */
  disabledDelete?: boolean;
  /** 加载状态 */
  loading?: boolean;
};

/** 定义组件属性 */
defineProps<Props>();

/** 组件事件类型 */
type Emits = {
  /** 添加事件 */
  (e: 'add'): void;
  /** 删除事件 */
  (e: 'delete'): void;
  /** 刷新事件 */
  (e: 'refresh'): void;
};

/** 定义组件事件 */
const emit = defineEmits<Emits>();

/** 定义列模型 */
const columns = defineModel<UI.TableColumnCheck[]>('columns', {
  default: () => []
});

/** 添加操作 */
function add() {
  emit('add');
}

/** 批量删除操作 */
function batchDelete() {
  emit('delete');
}

/** 刷新操作 */
function refresh() {
  emit('refresh');
}
</script>

<template>
  <ElSpace direction="horizontal" wrap justify="end" class="lt-sm:w-[200px]">
    <slot name="prefix"></slot>
    <slot name="default">
      <ElButton plain type="primary" @click="add">
        <template #icon>
          <icon-ic-round-plus class="text-icon" />
        </template>
        {{ $t('common.add') }}
      </ElButton>
      <ElPopconfirm :title="$t('common.confirmDelete')" @confirm="batchDelete">
        <template #reference>
          <ElButton type="danger" plain :disabled="disabledDelete">
            <template #icon>
              <icon-ic-round-delete class="text-icon" />
            </template>
            {{ $t('common.batchDelete') }}
          </ElButton>
        </template>
      </ElPopconfirm>
    </slot>
    <ElButton @click="refresh">
      <template #icon>
        <icon-mdi-refresh class="text-icon" :class="{ 'animate-spin': loading }" />
      </template>
      {{ $t('common.refresh') }}
    </ElButton>
    <TableColumnSetting v-model:columns="columns" />
    <slot name="suffix"></slot>
  </ElSpace>
</template>

<style scoped></style>
