import type { RequestInstanceState } from './type'

import { getServiceBaseURL } from '@/utils/service'

import { localStg } from '@/utils/storage'

import {
  BACKEND_ERROR_CODE,
  createFlatRequest,
  createRequest,
} from '@sa/axios'

import { showErrorMsg } from './shared'

/** 是否使用 HTTP 代理 */
const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y'

/** 基础 URL 和其他基础 URL */
const { baseURL, otherBaseURL } = getServiceBaseURL(import.meta.env, isHttpProxy)

/** 创建请求实例 */
export const request = createFlatRequest<App.Service.Response, RequestInstanceState>(
  {
    baseURL,
    headers: {
      apifoxToken: 'XL299LiMEDZ0H5h3A29PxwQXdMJqWyY2', // 请求头中的 apifoxToken
    },
  },
  {
    /** 请求拦截器 */
    async onRequest(config) {
      return config
    },

    /** 判断后端请求是否成功 */
    isBackendSuccess(response) {
      // 当后端响应代码是 "0000"（默认值）时，表示请求成功
      // 如果要更改此逻辑，可以修改 `.env` 文件中的 `VITE_SERVICE_SUCCESS_CODE`
      return String(response.data.code) === import.meta.env.VITE_SERVICE_SUCCESS_CODE
    },

    /** 后端请求失败时的处理逻辑 */
    async onBackendFail(response, instance) {
      console.log('%c Line:53 🎂 response', 'color:#42b983', response)
      console.log('%c Line:53 🌭 instance', 'color:#e41a6a', instance)
      return null
    },

    /** 转换后端响应数据 */
    transformBackendResponse(response) {
      return response.data.data
    },

    /** 请求错误时的处理逻辑 */
    onError(error) {
      // 当请求失败时，可以显示错误信息

      let message = error.message

      let backendErrorCode = ''

      // 获取后端错误信息和代码
      if (error.code === BACKEND_ERROR_CODE) {
        message = error.response?.data?.msg || message
        backendErrorCode = String(error.response?.data?.code || '')
      }

      // 错误信息显示在模态框中
      const modalLogoutCodes = import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || []

      if (modalLogoutCodes.includes(backendErrorCode)) {
        return
      }

      // 当令牌过期时，刷新令牌并重试请求，因此无需显示错误信息
      const expiredTokenCodes = import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',') || []

      if (expiredTokenCodes.includes(backendErrorCode)) {
        return
      }

      showErrorMsg(request.state, message)
    },
  },
)

/** 创建演示请求实例 */
export const demoRequest = createRequest<App.Service.DemoResponse>(
  {
    baseURL: otherBaseURL.demo,
  },
  {
    /** 请求拦截器 */
    async onRequest(config) {
      const { headers } = config

      // 设置令牌
      const token = localStg.get('token')

      const Authorization = token ? `Bearer ${token}` : null

      Object.assign(headers, {
        Authorization,
      })

      return config
    },

    /** 判断后端请求是否成功 */
    isBackendSuccess(response) {
      // 当后端响应代码是 "200" 时，表示请求成功
      // 可以自行更改此逻辑
      return response.data.status === '200'
    },

    /** 后端请求失败时的处理逻辑 */
    async onBackendFail(_response) {
      // 当后端响应代码不是 "200" 时，表示请求失败
      // 例如：令牌过期，刷新令牌并重试请求
    },

    /** 转换后端响应数据 */
    transformBackendResponse(response) {
      return response.data.result
    },

    /** 请求错误时的处理逻辑 */
    onError(error) {
      // 当请求失败时，可以显示错误信息

      let message = error.message

      // 显示后端错误信息
      if (error.code === BACKEND_ERROR_CODE) {
        message = error.response?.data?.message || message
      }

      window.$message?.error(message)
    },
  },
)
