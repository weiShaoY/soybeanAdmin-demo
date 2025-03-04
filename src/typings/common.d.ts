/** 通用类型命名空间 */
declare namespace CommonType {

  /** 策略模式 */
  type StrategicPattern = {

    /** 条件 */
    condition: boolean

    /** 如果条件为 true，则调用回调函数 */
    callback: () => void
  }

  /**
   * 选项类型
   *
   * @property value - 选项值
   * @property label - 选项标签
   */
  type Option<K = string> = {

    /** 选项值 */
    value: K

    /** 选项标签 */
    label: string
  }

  /** 是或否 */
  type YesOrNo = 'Y' | 'N'

  /** 将所有属性设置为可为空 */
  type RecordNullable<T> = {

    /** 属性键 */
    [K in keyof T]?: T[K] | undefined;
  }
}
