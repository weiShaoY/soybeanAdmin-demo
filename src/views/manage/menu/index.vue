<script setup lang="tsx">
import { ref } from 'vue';

import type { Ref } from 'vue';

import { useBoolean } from '@sa/hooks';

import { ElButton, ElPopconfirm, ElTag } from 'element-plus';

import { fetchGetAllPages, fetchGetMenuList } from '@/service/api';

import { useTable, useTableOperate } from '@/hooks/common/table';

import { yesOrNoRecord } from '@/constants/common';

import { enableStatusRecord, menuTypeRecord } from '@/constants/business';

import SvgIcon from '@/components/custom/svg-icon.vue';

import MenuOperateModal, { type OperateType } from './modules/menu-operate-modal.vue';

const { bool: visible, setTrue: openModal } = useBoolean();

const wrapperRef = ref<HTMLElement | null>(null);

const { columns, columnChecks, data, loading, pagination, getData, getDataByPage } = useTable({
  apiFn: fetchGetMenuList,
  columns: () => [
    { type: 'selection', width: 48 },
    { prop: 'id', label: 'ID' },
    {
      prop: 'menuType',
      label: '菜单类型',
      width: 90,
      formatter: row => {
        const tagMap: Record<Api.SystemManage.MenuType, UI.ThemeColor> = {
          1: 'info',
          2: 'primary'
        };

        const label = menuTypeRecord[row.menuType];

        return <ElTag type={tagMap[row.menuType]}>{label}</ElTag>;
      }
    },
    {
      prop: 'menuName',
      label: '菜单名称',
      minWidth: 120,
      formatter: row => {
        const label = row.menuName;

        return <span>{label}</span>;
      }
    },
    {
      prop: 'icon',
      label: '图标',
      width: 100,
      formatter: row => {
        const icon = row.iconType === '1' ? row.icon : undefined;

        const localIcon = row.iconType === '2' ? row.icon : undefined;

        return (
          <div class="flex-center">
            <SvgIcon icon={icon} localIcon={localIcon} class="text-icon" />
          </div>
        );
      }
    },
    { prop: 'routeName', label: '路由名称', minWidth: 120 },
    { prop: 'routePath', label: '路由路径', minWidth: 120 },
    {
      prop: 'status',
      label: '菜单状态',
      width: 80,
      formatter: row => {
        if (row.status === undefined) {
          return '';
        }

        const tagMap: Record<Api.Common.EnableStatus, UI.ThemeColor> = {
          1: 'success',
          2: 'warning'
        };

        const label = enableStatusRecord[row.status];

        return <ElTag type={tagMap[row.status]}>{label}</ElTag>;
      }
    },
    {
      prop: 'hideInMenu',
      label: '隐藏菜单',
      width: 80,
      formatter: row => {
        const hide: CommonType.YesOrNo = row.hideInMenu ? 'Y' : 'N';

        const tagMap: Record<CommonType.YesOrNo, UI.ThemeColor> = {
          Y: 'danger',
          N: 'info'
        };

        const label = yesOrNoRecord[hide];

        return <ElTag type={tagMap[hide]}>{label}</ElTag>;
      }
    },
    { prop: 'parentId', label: '父级菜单ID', width: 90 },
    { prop: 'order', label: '排序', width: 60 },
    {
      prop: 'operate',
      label: '操作',
      width: 230,
      formatter: row => (
        <div class="flex-center justify-end pr-10px">
          {row.menuType === '1' && (
            <ElButton type="primary" plain size="small" onClick={() => handleAddChildMenu(row)}>
              新增子菜单
            </ElButton>
          )}
          <ElButton type="primary" plain size="small" onClick={() => handleEdit(row)}>
            {'编辑'}
          </ElButton>
          <ElPopconfirm title={'确认删除吗？'} onConfirm={() => handleDelete(row.id)}>
            {{
              reference: () => (
                <ElButton type="danger" plain size="small">
                  {'删除'}
                </ElButton>
              )
            }}
          </ElPopconfirm>
        </div>
      )
    }
  ]
});

const { checkedRowKeys, onBatchDeleted, onDeleted } = useTableOperate(data, getData);

const operateType = ref<OperateType>('add');

function handleAdd() {
  operateType.value = 'add';
  openModal();
}

async function handleBatchDelete() {
  // request

  onBatchDeleted();
}

function handleDelete(id: number) {
  // eslint-disable-next-line no-console
  console.log(id);
  // request

  onDeleted();
}

/** the edit menu data or the parent menu data when adding a child menu */
const editingData: Ref<Api.SystemManage.Menu | null> = ref(null);

function handleEdit(item: Api.SystemManage.Menu) {
  operateType.value = 'edit';
  editingData.value = { ...item };

  openModal();
}

function handleAddChildMenu(item: Api.SystemManage.Menu) {
  operateType.value = 'addChild';

  editingData.value = { ...item };

  openModal();
}

const allPages = ref<string[]>([]);

async function getAllPages() {
  const { data: pages } = await fetchGetAllPages();

  allPages.value = pages || [];
}

function init() {
  getAllPages();
}

// init
init();
</script>

<template>
  <div ref="wrapperRef" class="flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <ElCard class="sm:flex-1-hidden card-wrapper" body-class="ht50">
      <template #header>
        <div class="flex items-center justify-between">
          <p>菜单列表</p>
          <TableHeaderOperation
            v-model:columns="columnChecks"
            :disabled-delete="checkedRowKeys.length === 0"
            :loading="loading"
            @add="handleAdd"
            @delete="handleBatchDelete"
            @refresh="getData"
          />
        </div>
      </template>
      <div class="h-[calc(100%-50px)]">
        <ElTable
          v-loading="loading"
          height="100%"
          border
          class="sm:h-full"
          :data="data"
          row-key="id"
          @selection-change="checkedRowKeys = $event"
        >
          <ElTableColumn v-for="col in columns" :key="col.prop" v-bind="col" />
        </ElTable>
        <div class="mt-20px flex justify-end">
          <ElPagination
            v-if="pagination.total"
            layout="total,prev,pager,next,sizes"
            v-bind="pagination"
            @current-change="pagination['current-change']"
            @size-change="pagination['size-change']"
          />
        </div>
      </div>
      <MenuOperateModal
        v-model:visible="visible"
        :operate-type="operateType"
        :row-data="editingData"
        :all-pages="allPages"
        @submitted="getDataByPage"
      />
    </ElCard>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-card) {
  .ht50 {
    height: calc(100% - 50px);
  }
}
</style>
