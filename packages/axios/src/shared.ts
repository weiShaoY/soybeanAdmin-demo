import type {
  AxiosHeaderValue,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

/**
 * 获取请求的 `Content-Type`
 *
 * @param config - Axios 请求配置
 * @returns 请求的 `Content-Type`，默认为 `'application/json'`
 */
export function getContentType(config: InternalAxiosRequestConfig) {
  const contentType: AxiosHeaderValue = config.headers?.['Content-Type'] || 'application/json'

  return contentType
}

/**
 * 检查 HTTP 状态码是否表示请求成功
 *
 * @param status - HTTP 状态码
 * @returns 是否成功 (2xx 或 304)
 */
export function isHttpSuccess(status: number) {
  const isSuccessCode = status >= 200 && status < 300

  return isSuccessCode || status === 304
}

/**
 * 判断响应是否为 JSON 类型
 *
 * @param response - Axios 响应对象
 * @returns 是否为 JSON 类型
 */
export function isResponseJson(response: AxiosResponse) {
  const { responseType } = response.config

  return responseType === 'json' || responseType === undefined
}
