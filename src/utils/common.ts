/**
 * 将记录转换为选项
 *
 * @example
 *   ```ts
 *   const record = {
 *     key1: 'label1',
 *     key2: 'label2'
 *   };
 *   const options = transformRecordToOption(record);
 *   // [
 *   //   { value: 'key1', label: 'label1' },
 *   //   { value: 'key2', label: 'label2' }
 *   // ]
 *   ```;
 *
 * @param {Record<string, string>} record 要转换的记录
 * @returns {CommonType.Option<keyof T>[]} 转换后的选项数组
 */
export function transformRecordToOption<T extends Record<string, string>>(record: T): CommonType.Option<keyof T>[] {
  return Object.entries(record).map(([value, label]) => ({
    value,
    label,
  })) as CommonType.Option<keyof T>[]
}

/**
 * 翻译选项
 *
 * @param {CommonType.Option<string>[]} options 需要翻译的选项数组
 * @returns {CommonType.Option<string>[]} 翻译后的选项数组
 */
export function translateOptions(options: CommonType.Option<string>[]): CommonType.Option<string>[] {
  return options.map(option => ({
    ...option,
    label: option.label,
  }))
}

/**
 * 切换 HTML 类
 *
 * @param {string} className 要切换的类名
 * @returns {object} 包含添加和移除类的方法
 */
export function toggleHtmlClass(className: string): { add: () => void, remove: () => void } {
  /** 添加类 */
  function add() {
    document.documentElement.classList.add(className)
  }

  /** 移除类 */
  function remove() {
    document.documentElement.classList.remove(className)
  }

  return {
    add,
    remove,
  }
}
