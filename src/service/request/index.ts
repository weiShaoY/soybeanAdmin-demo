import type { AxiosResponse } from 'axios';
import { BACKEND_ERROR_CODE, createFlatRequest, createRequest } from '@sa/axios';
import { useAuthStore } from '@/store/modules/auth';
import { localStg } from '@/utils/storage';
import { getServiceBaseURL } from '@/utils/service';
import { getAuthorization, handleExpiredRequest, showErrorMsg } from './shared';
import type { RequestInstanceState } from './type';

/** 是否使用 HTTP 代理 */
const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';

/** 基础 URL 和其他基础 URL */
const { baseURL, otherBaseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);

/** 创建请求实例 */
export const request = createFlatRequest<App.Service.Response, RequestInstanceState>(
  {
    baseURL,
    headers: {
      apifoxToken: 'XL299LiMEDZ0H5h3A29PxwQXdMJqWyY2' // 请求头中的 apifoxToken
    }
  },
  {
    /** 请求拦截器 */
    async onRequest(config) {
      const Authorization = getAuthorization();
      Object.assign(config.headers, { Authorization });

      return config;
    },

    /** 判断后端请求是否成功 */
    isBackendSuccess(response) {
      // 当后端响应代码是 "0000"（默认值）时，表示请求成功
      // 如果要更改此逻辑，可以修改 `.env` 文件中的 `VITE_SERVICE_SUCCESS_CODE`
      return String(response.data.code) === import.meta.env.VITE_SERVICE_SUCCESS_CODE;
    },

    /** 后端请求失败时的处理逻辑 */
    async onBackendFail(response, instance) {
      const authStore = useAuthStore();
      const responseCode = String(response.data.code);

      /** 处理注销逻辑 */
      function handleLogout() {
        authStore.resetStore();
      }

      /** 注销并清理 */
      function logoutAndCleanup() {
        handleLogout();
        window.removeEventListener('beforeunload', handleLogout);

        request.state.errMsgStack = request.state.errMsgStack.filter(msg => msg !== response.data.msg);
      }

      // 当后端响应代码在 `logoutCodes` 中时，表示用户将被注销并重定向到登录页面
      const logoutCodes = import.meta.env.VITE_SERVICE_LOGOUT_CODES?.split(',') || [];
      if (logoutCodes.includes(responseCode)) {
        handleLogout();
        return null;
      }

      // 当后端响应代码在 `modalLogoutCodes` 中时，表示用户将通过显示一个模态框被注销
      const modalLogoutCodes = import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || [];
      if (modalLogoutCodes.includes(responseCode) && !request.state.errMsgStack?.includes(response.data.msg)) {
        request.state.errMsgStack = [...(request.state.errMsgStack || []), response.data.msg];

        // 防止用户刷新页面
        window.addEventListener('beforeunload', handleLogout);

        window.$messageBox
          ?.confirm(response.data.msg, '错误', {
            confirmButtonText:'确认',
            cancelButtonText: '取消',
            type: 'error',
            closeOnClickModal: false,
            closeOnPressEscape: false
          })
          .then(() => {
            logoutAndCleanup();
          });

        return null;
      }

      // 当后端响应代码在 `expiredTokenCodes` 中时，表示令牌已过期并刷新令牌
      // `refreshToken` 接口不能返回 `expiredTokenCodes` 中的错误代码，否则会形成死循环，应返回 `logoutCodes` 或 `modalLogoutCodes`
      const expiredTokenCodes = import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',') || [];
      if (expiredTokenCodes.includes(responseCode)) {
        const success = await handleExpiredRequest(request.state);
        if (success) {
          const Authorization = getAuthorization();
          Object.assign(response.config.headers, { Authorization });

          return instance.request(response.config) as Promise<AxiosResponse>;
        }
      }

      return null;
    },

    /** 转换后端响应数据 */
    transformBackendResponse(response) {
      return response.data.data;
    },

    /** 请求错误时的处理逻辑 */
    onError(error) {
      // 当请求失败时，可以显示错误信息

      let message = error.message;
      let backendErrorCode = '';

      // 获取后端错误信息和代码
      if (error.code === BACKEND_ERROR_CODE) {
        message = error.response?.data?.msg || message;
        backendErrorCode = String(error.response?.data?.code || '');
      }

      // 错误信息显示在模态框中
      const modalLogoutCodes = import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || [];
      if (modalLogoutCodes.includes(backendErrorCode)) {
        return;
      }

      // 当令牌过期时，刷新令牌并重试请求，因此无需显示错误信息
      const expiredTokenCodes = import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',') || [];
      if (expiredTokenCodes.includes(backendErrorCode)) {
        return;
      }

      showErrorMsg(request.state, message);
    }
  }
);

/** 创建演示请求实例 */
export const demoRequest = createRequest<App.Service.DemoResponse>(
  {
    baseURL: otherBaseURL.demo
  },
  {
    /** 请求拦截器 */
    async onRequest(config) {
      const { headers } = config;

      // 设置令牌
      const token = localStg.get('token');
      const Authorization = token ? `Bearer ${token}` : null;
      Object.assign(headers, { Authorization });

      return config;
    },

    /** 判断后端请求是否成功 */
    isBackendSuccess(response) {
      // 当后端响应代码是 "200" 时，表示请求成功
      // 可以自行更改此逻辑
      return response.data.status === '200';
    },

    /** 后端请求失败时的处理逻辑 */
    async onBackendFail(_response) {
      // 当后端响应代码不是 "200" 时，表示请求失败
      // 例如：令牌过期，刷新令牌并重试请求
    },

    /** 转换后端响应数据 */
    transformBackendResponse(response) {
      return response.data.result;
    },

    /** 请求错误时的处理逻辑 */
    onError(error) {
      // 当请求失败时，可以显示错误信息

      let message = error.message;

      // 显示后端错误信息
      if (error.code === BACKEND_ERROR_CODE) {
        message = error.response?.data?.message || message;
      }

      window.$message?.error(message);
    }
  }
);
