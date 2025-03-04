import type { Ref } from 'vue'

import useBoolean from './use-boolean'

/** useLoading Hook 返回类型 */
type UseLoadingReturn = {

  /** 是否处于加载状态 */
  loading: Ref<boolean>

  /** 开始加载 */
  startLoading: () => void

  /** 结束加载 */
  endLoading: () => void
}

/**
 * Loading Hook
 *
 * @param initValue 初始加载状态，默认为 false
 * @returns 加载状态及控制方法
 */
export default function useLoading(initValue = false): UseLoadingReturn {
  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(initValue)

  return {
    loading,
    startLoading,
    endLoading,
  }
}
