import type { PaginationEmits, PaginationProps } from 'element-plus'

import type { Ref } from 'vue'

import { useAppStore } from '@/store/modules/app'

import { useBoolean, useHookTable } from '@sa/hooks'

import { jsonClone } from '@sa/utils'

import {
  computed,
  effectScope,
  onScopeDispose,
  reactive,
  ref,
} from 'vue'

/** 移除只读属性类型 */
type RemoveReadonly<T> = {
  -readonly [key in keyof T]: T[key];
}

/** 表格数据类型 */
type TableData = UI.TableData

/** 获取表格数据类型 */
type GetTableData<A extends UI.TableApiFn> = UI.GetTableData<A>

/** 表格列类型 */
type TableColumn<T> = UI.TableColumn<T>

/**
 * 使用表格数据
 *
 * @template A 表格 API 函数类型
 * @param {UI.NaiveTableConfig<A>} config 表格配置
 * @returns 包含表格数据、加载状态、分页等的对象
 */
export function useTable<A extends UI.TableApiFn>(config: UI.NaiveTableConfig<A>) {
  /** 作用域 */
  const scope = effectScope()

  /** 应用存储 */
  const appStore = useAppStore()

  /** 是否为移动设备 */
  const isMobile = computed(() => appStore.isMobile)

  const { apiFn, apiParams, immediate } = config

  /** 选择列键 */
  const SELECTION_KEY = '__selection__'

  /** 展开列键 */
  const EXPAND_KEY = '__expand__'

  /** 索引列键 */
  const INDEX_KEY = '__index__'

  const {
    loading,
    empty,
    data,
    columns,
    columnChecks,
    reloadColumns,
    getData,
    searchParams,
    updateSearchParams,
    resetSearchParams,
  } = useHookTable<A, GetTableData<A>, TableColumn<UI.TableDataWithIndex<GetTableData<A>>>>({
    apiFn,
    apiParams,
    columns: config.columns,
    transformer: (res) => {
      const { records = [], current = 1, size = 10, total = 0 } = res.data || {
      }

      // 确保 size 大于 0，如果小于 0 则会导致分页计算错误。
      const pageSize = size <= 0 ? 10 : size

      const recordsWithIndex = records.map((item, index) => {
        return {
          ...item,
          index: (current - 1) * pageSize + index + 1,
        }
      })

      return {
        data: recordsWithIndex,
        pageNum: current,
        pageSize,
        total,
      }
    },
    getColumnChecks: (cols) => {
      const checks: UI.TableColumnCheck[] = []

      cols.forEach((column) => {
        if (column.type === 'selection') {
          checks.push({
            prop: SELECTION_KEY,
            label: '勾选',
            checked: true,
          })
        }
        else if (column.type === 'expand') {
          checks.push({
            prop: EXPAND_KEY,
            label: '展开列',
            checked: true,
          })
        }
        else if (column.type === 'index') {
          checks.push({
            prop: INDEX_KEY,
            label: '序号',
            checked: true,
          })
        }
        else {
          checks.push({
            prop: column.prop as string,
            label: column.label as string,
            checked: true,
          })
        }
      })

      return checks
    },
    getColumns: (cols, checks) => {
      const columnMap = new Map<string, TableColumn<GetTableData<A>>>()

      cols.forEach((column) => {
        if (column.type === 'selection') {
          columnMap.set(SELECTION_KEY, column)
        }
        else if (column.type === 'expand') {
          columnMap.set(EXPAND_KEY, column)
        }
        else if (column.type === 'index') {
          columnMap.set(INDEX_KEY, column)
        }
        else {
          columnMap.set(column.prop as string, column)
        }
      })

      const filteredColumns = checks
        .filter(item => item.checked)
        .map(check => columnMap.get(check.prop) as TableColumn<GetTableData<A>>)

      return filteredColumns
    },
    onFetched: async (transformed) => {
      const { pageNum, pageSize, total } = transformed

      updatePagination({
        currentPage: pageNum,
        pageSize,
        total,
      })
    },
    immediate,
  })

  /** 分页配置 */
  const pagination: Partial<RemoveReadonly<PaginationProps & PaginationEmits>> = reactive({
    'currentPage': 1,
    'pageSize': 10,
    'pageSizes': [10, 15, 20, 25, 30],
    'current-change': (page: number) => {
      pagination.currentPage = page

      updateSearchParams({
        current: page,
        size: pagination.pageSize!,
      })

      getData()

      return true
    },
    'size-change': (pageSize: number) => {
      pagination.currentPage = 1
      pagination.pageSize = pageSize

      updateSearchParams({
        current: pagination.currentPage,
        size: pageSize,
      })

      getData()
      return true
    },
  })

  // 适用于移动设备的分页，如果系统不支持移动设备，可以直接使用 `pagination`
  const mobilePagination = computed(() => {
    const p: Partial<RemoveReadonly<PaginationProps & PaginationEmits>> = {
      ...pagination,
      pagerCount: isMobile.value ? 3 : 9,
    }

    return p
  })

  /**
   * 更新分页配置
   *
   * @param {Partial<PaginationProps>} update 分页更新参数
   */
  function updatePagination(update: Partial<PaginationProps>) {
    Object.assign(pagination, update)
  }

  /**
   * 根据页码获取数据
   *
   * @param {number} [pageNum] 页码，默认值为 1. Default is `1`
   */
  async function getDataByPage(pageNum: number = 1) {
    updatePagination({
      currentPage: pageNum,
    })

    updateSearchParams({
      current: pageNum,
      size: pagination.pageSize!,
    })

    await getData()
  }

  onScopeDispose(() => {
    scope.stop()
  })

  return {
    loading,
    empty,
    data,
    columns,
    columnChecks,
    reloadColumns,
    pagination,
    mobilePagination,
    updatePagination,
    getData,
    getDataByPage,
    searchParams,
    updateSearchParams,
    resetSearchParams,
  }
}

/**
 * 使用表格操作
 *
 * @template T 表格数据类型
 * @param {Ref<T[]>} data 表格数据引用
 * @param {Function} getData 获取数据的函数
 * @returns {object} 包含表格操作方法的对象
 */
export function useTableOperate<T extends TableData = TableData>(data: Ref<T[]>, getData: () => Promise<void>) {
  /** 抽屉可见状态 */
  const { bool: drawerVisible, setTrue: openDrawer, setFalse: closeDrawer } = useBoolean()

  /** 操作类型 */
  const operateType = ref<UI.TableOperateType>('add')

  /** 处理新增操作 */
  function handleAdd() {
    operateType.value = 'add'
    openDrawer()
  }

  /** 编辑的行数据 */
  const editingData: Ref<T | null> = ref(null)

  /**
   * 处理编辑操作
   *
   * @param {T['id']} id 编辑的行数据的 ID
   */
  function handleEdit(id: T['id']) {
    operateType.value = 'edit'
    const findItem = data.value.find(item => item.id === id) || null

    editingData.value = jsonClone(findItem)

    openDrawer()
  }

  /** 表格选中行的键 */
  const checkedRowKeys = ref<string[]>([])

  /** 批量删除操作完成后的钩子 */
  async function onBatchDeleted() {
    window.$message?.success('删除成功')

    checkedRowKeys.value = []

    await getData()
  }

  /** 删除操作完成后的钩子 */
  async function onDeleted() {
    window.$message?.success('删除成功')

    await getData()
  }

  return {
    drawerVisible,
    openDrawer,
    closeDrawer,
    operateType,
    handleAdd,
    editingData,
    handleEdit,
    checkedRowKeys,
    onBatchDeleted,
    onDeleted,
  }
}
