import { createAlovaRequest } from '@sa/alova';
import { createAlovaMockAdapter } from '@sa/alova/mock';
import adapterFetch from '@sa/alova/fetch';
import { useAuthStore } from '@/store/modules/auth';
import { getServiceBaseURL } from '@/utils/service';
import featureUsers20241014 from '../mocks/feature-users-20241014';
import { getAuthorization, handleRefreshToken, showErrorMsg } from './shared';
import type { RequestInstanceState } from './type';

/** 是否使用 HTTP 代理 */
const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';
const { baseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);

/** 请求实例状态 */
const state: RequestInstanceState = {
  errMsgStack: []
};
const mockAdapter = createAlovaMockAdapter([featureUsers20241014], {
  // 如果请求不匹配 mock 请求则使用 httpAdapter
  httpAdapter: adapterFetch(),

  // 响应延迟时间
  delay: 1000,

  // 全局 mock 开关
  enable: true,
  matchMode: 'methodurl'
});

/** Alova 请求实例 */
export const alova = createAlovaRequest(
  {
    baseURL,
    requestAdapter: import.meta.env.DEV ? mockAdapter : adapterFetch()
  },
  {
    onRequest({ config }) {
      const Authorization = getAuthorization();
      config.headers.Authorization = Authorization;
      config.headers.apifoxToken = 'XL299LiMEDZ0H5h3A29PxwQXdMJqWyY2';
    },
    tokenRefresher: {
      async isExpired(response) {
        const expiredTokenCodes = import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',') || [];
        const { code } = await response.clone().json();
        return expiredTokenCodes.includes(String(code));
      },
      async handler() {
        await handleRefreshToken();
      }
    },
    async isBackendSuccess(response) {
      // 当后端响应代码是 "0000"（默认值）时，表示请求成功
      // 如果要更改此逻辑，可以修改 `.env` 文件中的 `VITE_SERVICE_SUCCESS_CODE`
      const resp = response.clone();
      const data = await resp.json();
      return String(data.code) === import.meta.env.VITE_SERVICE_SUCCESS_CODE;
    },
    async transformBackendResponse(response) {
      return (await response.clone().json()).data;
    },
    async onError(error, response) {
      const authStore = useAuthStore();

      let message = error.message;
      let responseCode = '';
      if (response) {
        const data = await response?.clone().json();
        message = data.msg;
        responseCode = String(data.code);
      }

      function handleLogout() {
        showErrorMsg(state, message);
        authStore.resetStore();
      }

      function logoutAndCleanup() {
        handleLogout();
        window.removeEventListener('beforeunload', handleLogout);
        state.errMsgStack = state.errMsgStack.filter(msg => msg !== message);
      }

      // 当后端响应代码在 `logoutCodes` 中时，表示用户将被注销并重定向到登录页面
      const logoutCodes = import.meta.env.VITE_SERVICE_LOGOUT_CODES?.split(',') || [];
      if (logoutCodes.includes(responseCode)) {
        handleLogout();
        throw error;
      }

      // 当后端响应代码在 `modalLogoutCodes` 中时，表示用户将通过显示一个模态框被注销
      const modalLogoutCodes = import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || [];
      if (modalLogoutCodes.includes(responseCode) && !state.errMsgStack?.includes(message)) {
        state.errMsgStack = [...(state.errMsgStack || []), message];

        // 防止用户刷新页面
        window.addEventListener('beforeunload', handleLogout);

        if (window.$messageBox) {
          window.$messageBox({
            type: 'error',
            title: '错误',
            message,
            confirmButtonText: '确认',
            closeOnClickModal: false,
            closeOnPressEscape: false,
            callback() {
              logoutAndCleanup();
            }
          });
        }
        throw error;
      }
      showErrorMsg(state, message);
      throw error;
    }
  }
);
