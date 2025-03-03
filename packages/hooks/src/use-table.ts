import { computed, reactive, ref } from 'vue';
import type { Ref } from 'vue';
import { jsonClone } from '@sa/utils';
import useBoolean from './use-boolean';
import useLoading from './use-loading';

/**
 * `MaybePromise` 类型，用于表示可能是普通值也可能是 Promise 的值
 *
 * @template T - 值的类型
 */
export type MaybePromise<T> = T | Promise<T>;

/**
 * `ApiFn` 类型，表示一个接受参数并返回 `Promise` 的 API 函数
 *
 * @param args - API 函数的参数
 * @returns 返回一个 `Promise` 对象
 */
export type ApiFn = (args: any) => Promise<unknown>;

/** 表格列的选择状态 */
export type TableColumnCheck = {
  /** 列的属性名称 */
  prop: string;
  /** 列的显示名称 */
  label: string;
  /** 是否选中 */
  checked: boolean;
};

/** 表格数据，每一项数据包含索引值 */
export type TableDataWithIndex<T> = T & {
  /** 数据的索引 */
  index: number;
};

/** 转换后的数据，包括分页信息和数据内容 */
export type TransformedData<T> = {
  /** 表格数据，包含索引 */
  data: TableDataWithIndex<T>[];
  /** 当前页码 */
  pageNum: number;
  /** 每页数据条数 */
  pageSize: number;
  /** 总数据条数 */
  total: number;
};

/**
 * 数据转换函数类型，用于转换 API 响应数据为表格数据格式
 *
 * @param response - API 响应数据
 * @returns 转换后的表格数据
 */
export type Transformer<T, Response> = (response: Response) => TransformedData<T>;

/** 表格配置项类型 */
export type TableConfig<A extends ApiFn, T, C> = {
  /** 获取表格数据的 API 函数 */
  apiFn: A;

  /** API 请求的参数 */
  apiParams?: Parameters<A>[0];

  /** 转换 API 响应为表格数据 */
  transformer: Transformer<T, Awaited<ReturnType<A>>>;

  /** 列工厂函数 */
  columns: () => C[];

  /**
   * 获取列的选择状态
   *
   * @param columns 列数组
   * @returns 列的选择状态数组
   */
  getColumnChecks: (columns: C[]) => TableColumnCheck[];

  /**
   * 根据列和选择状态获取列
   *
   * @param columns 列数组
   * @param checks 列检查数组
   * @returns 列数组
   */
  getColumns: (columns: C[], checks: TableColumnCheck[]) => C[];

  /**
   * 当数据获取成功后回调
   *
   * @param transformed 转换后的数据
   */
  onFetched?: (transformed: TransformedData<T>) => MaybePromise<void>;

  /**
   * 是否立即获取数据
   *
   * @default true
   */
  immediate?: boolean;
};

/** 表格钩子返回类型 */
export type UseHookTableReturn<A extends ApiFn, T, C> = {
  /** 加载状态 */
  loading: Ref<boolean>;
  /** 空状态 */
  empty: Ref<boolean>;
  /** 数据 */
  data: Ref<TableDataWithIndex<T>[]>;
  /** 列 */
  columns: Ref<C[]>;
  /** 列的选择状态 */
  columnChecks: Ref<TableColumnCheck[]>;
  /** 重新加载列 */
  reloadColumns: () => void;
  /** 获取数据 */
  getData: () => Promise<void>;
  /** 搜索参数 */
  searchParams: NonNullable<Parameters<A>[0]>;
  /** 更新搜索参数 */
  updateSearchParams: (params: Partial<Parameters<A>[0]>) => void;
  /** 重置搜索参数 */
  resetSearchParams: () => void;
};
/**
 * 使用表格钩子的自定义函数，提供了表格数据、列设置、搜索参数等
 *
 * @param config - 表格配置项
 * @returns 提供表格的各种功能，如加载状态、表格数据、列、搜索参数等
 */
export default function useHookTable<A extends ApiFn, T, C>(config: TableConfig<A, T, C>): UseHookTableReturn<A, T, C> {
  // 加载状态和控制函数
  const { loading, startLoading, endLoading } = useLoading();

  //  空状态和控制函数
  const { bool: empty, setBool: setEmpty } = useBoolean();

  // 解构配置项
  const { apiFn, apiParams, transformer, immediate = true, getColumnChecks, getColumns } = config;

  /** 初始化搜索参数 */
  const searchParams: NonNullable<Parameters<A>[0]> = reactive(jsonClone({ ...apiParams }));

  /** 所有列的引用 */
  const allColumns = ref(config.columns()) as Ref<C[]>;

  /** 表格数据，包含索引 */
  const data: Ref<TableDataWithIndex<T>[]> = ref([]);

  /** 列的选择状态 */
  const columnChecks: Ref<TableColumnCheck[]> = ref(getColumnChecks(config.columns()));

  /** 根据列和选择状态生成最终列 */
  const columns = computed(() => getColumns(allColumns.value, columnChecks.value));

  /** 重新加载列 */
  function reloadColumns() {
    // 重新获取所有列
    allColumns.value = config.columns();

    /** 创建列检查 Map */
    const checkMap = new Map(columnChecks.value.map(col => [col.prop, col.checked]));

    /** 获取默认列检查 */
    const defaultChecks = getColumnChecks(allColumns.value);

    columnChecks.value = defaultChecks.map(col => ({
      ...col,
      // 更新列检查状态
      checked: checkMap.get(col.prop) ?? col.checked
    }));
  }

  /** 获取数据并更新表格内容 */
  async function getData() {
    // 开始加载
    startLoading();
    /** 格式化搜索参数 */
    const formattedParams = formatSearchParams(searchParams);

    /** 调用 API 获取数据 */
    const response = await apiFn(formattedParams);

    /** 转换响应数据 */
    const transformed = transformer(response as Awaited<ReturnType<A>>);

    // 更新表格数据
    data.value = transformed.data;

    // 设置数据是否为空
    setEmpty(transformed.data.length === 0);

    // 获取数据后触发回调
    await config.onFetched?.(transformed);

    // 结束加载
    endLoading();
  }

  /**
   * 格式化搜索参数，去除无效参数
   *
   * @param params - 搜索参数
   * @returns 格式化后的参数
   */
  function formatSearchParams(params: Record<string, unknown>) {
    const formattedParams: Record<string, unknown> = {};

    Object.entries(params).forEach(([key, value]) => {
      // 过滤掉 null 和 undefined 的参数
      if (value !== null && value !== undefined) {
        formattedParams[key] = value;
      }
    });

    return formattedParams;
  }

  /**
   * 更新搜索参数
   *
   * @param params 新的搜索参数
   */
  function updateSearchParams(params: Partial<Parameters<A>[0]>) {
    // 合并新的搜索参数
    Object.assign(searchParams, params);
  }

  /** 重置搜索参数 */
  function resetSearchParams() {
    // 重置为初始的 API 参数
    Object.assign(searchParams, jsonClone(apiParams));
  }

  if (immediate) {
    // 如果立即获取数据，调用 getData
    getData();
  }

  return {
    loading,
    empty,
    data,
    columns,
    columnChecks,
    reloadColumns,
    getData,
    searchParams,
    updateSearchParams,
    resetSearchParams
  };
}
