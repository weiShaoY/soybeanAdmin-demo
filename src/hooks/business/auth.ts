import { useAuthStore } from '@/store/modules/auth'

/**
 * 自定义认证 Hook
 *
 * @returns 包含认证方法的对象
 */
export function useAuth() {
  /** 认证存储对象 */
  const authStore = useAuthStore()

  /**
   * 检查用户是否具有指定权限
   *
   * @param {string | string[]} codes 权限代码或权限代码数组
   * @returns {boolean} 如果用户具有指定权限，返回 true，否则返回 false
   */
  function hasAuth(codes: string | string[]): boolean {
    if (!authStore.isLogin) {
      return false
    }

    if (typeof codes === 'string') {
      return authStore.userInfo.buttons.includes(codes)
    }

    return codes.some(code => authStore.userInfo.buttons.includes(code))
  }

  return {
    hasAuth,
  }
}
