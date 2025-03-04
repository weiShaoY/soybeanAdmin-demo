declare namespace UI {

  /** 主题颜色类型 */
  type ThemeColor = 'danger' | 'primary' | 'info' | 'success' | 'warning'

  type TableColumnCheck = import('@sa/hooks').TableColumnCheck
  type TableDataWithIndex<T> = import('@sa/hooks').TableDataWithIndex<T>
  type FlatResponseData<T> = import('@sa/axios').FlatResponseData<T>

  /**
   * 自定义列键
   *
   * 如果要添加自定义列，应向此类型添加键
   */
  type CustomColumnKey = 'operate'

  type SetTableColumnKey<C, T> = Omit<C, 'key'> & { key: keyof T | `CustomColumnKey` }

  type TableData = Api.Common.CommonRecord<object>

  type TableColumnWithKey<T> = Partial<import('element-plus').TableColumnCtx<T>>

  type TableColumn<T> = TableColumnWithKey<T>

  type TableApiFn<T = any, R = Api.Common.CommonSearchParams> = (
    params: R
  ) => Promise<FlatResponseData<Api.Common.PaginatingQueryRecord<T>>>

  /**
   * 表操作的类型
   *
   * - add: 添加表项
   * - edit: 编辑表项
   */
  type TableOperateType = 'add' | 'edit'

  type GetTableData<A extends TableApiFn> = A extends TableApiFn<infer T> ? T : never

  type NaiveTableConfig<A extends TableApiFn> = Pick<
    import('@sa/hooks').TableConfig<A, GetTableData<A>, TableColumn<TableDataWithIndex<GetTableData<A>>>>,
    'apiFn' | 'apiParams' | 'columns' | 'immediate'
  > & {

    /**
     * 是否显示总条目数
     *
     * @default false
     */
    showTotal?: boolean
  }
}

// ======================================== element-plus ========================================

declare module 'element-plus/dist/locale/zh-cn.mjs' {
  const locale: any
  export default locale
}

declare module 'element-plus/dist/locale/en.mjs' {
  const locale: any
  export default locale
}
