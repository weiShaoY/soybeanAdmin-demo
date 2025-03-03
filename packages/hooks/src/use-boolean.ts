import { type Ref, ref } from 'vue';

type UseBooleanReturn = {
  /** 响应式布尔值 */
  bool: Ref<boolean>;
  /** 设置布尔值 */
  setBool: (value: boolean) => void;
  /** 设置布尔值为 true */
  setTrue: () => void;
  /** 设置布尔值为 false */
  setFalse: () => void;
  /** 切换布尔值 */
  toggle: () => void;
};

/**
 * 布尔值处理
 *
 * @param initValue 初始值，默认值为 false
 */
export default function useBoolean(initValue = false): UseBooleanReturn {
  /** 使用 ref 创建响应式布尔值 */
  const bool = ref(initValue);

  /**
   * 设置布尔值
   *
   * @param value 布尔值
   */
  function setBool(value: boolean) {
    bool.value = value;
  }

  /** 设置布尔值为 true */
  function setTrue() {
    setBool(true);
  }

  /** 设置布尔值为 false */
  function setFalse() {
    setBool(false);
  }

  /** 切换布尔值 */
  function toggle() {
    setBool(!bool.value);
  }

  // 返回相关的响应式数据和操作方法
  return {
    bool,
    setBool,
    setTrue,
    setFalse,
    toggle
  };
}
