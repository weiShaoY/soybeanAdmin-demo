import { localStg } from '@/utils/storage'

/**
 * 获取 token
 *
 * @returns {string} token
 */
export function getToken(): string {
  return localStg.get('token') || ''
}

/** 清除认证存储 */
export function clearAuthStorage(): void {
  localStg.remove('token')
  localStg.remove('refreshToken')
}
