import { useAuthStore } from '@/store/modules/auth';
import { localStg } from '@/utils/storage';
import { fetchRefreshToken } from '../api';
import type { RequestInstanceState } from './type';

/**
 * 获取授权信息
 *
 * @returns 授权信息
 */
export function getAuthorization() {
  const token = localStg.get('token');
  const Authorization = token ? `Bearer ${token}` : null;
  return Authorization;
}

/** 刷新令牌 */
export async function handleRefreshToken() {
  const { resetStore } = useAuthStore();
  const rToken = localStg.get('refreshToken') || '';
  const refreshTokenMethod = fetchRefreshToken(rToken);

  // 设置 refreshToken 角色，以便请求不会被拦截
  refreshTokenMethod.meta.authRole = 'refreshToken';

  try {
    const data = await refreshTokenMethod;
    localStg.set('token', data.token);
    localStg.set('refreshToken', data.refreshToken);
  } catch (error) {
    resetStore();
    throw error;
  }
}

/**
 * 显示错误信息
 *
 * @param state 请求实例状态
 * @param message 错误信息
 */
export function showErrorMsg(state: RequestInstanceState, message: string) {
  if (!state.errMsgStack?.length) {
    state.errMsgStack = [];
  }

  const isExist = state.errMsgStack.includes(message);

  if (!isExist) {
    state.errMsgStack.push(message);

    if (window.$message) {
      window.$message({
        type: 'error',
        message,
        onClose: () => {
          state.errMsgStack = state.errMsgStack.filter(msg => msg !== message);

          setTimeout(() => {
            state.errMsgStack = [];
          }, 5000);
        }
      });
    }
  }
}
