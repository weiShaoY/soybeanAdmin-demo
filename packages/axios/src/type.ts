import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

/** 请求支持的 `Content-Type` 类型 */
export type ContentType =
  | 'text/html'
  | 'text/plain'
  | 'multipart/form-data'
  | 'application/json'
  | 'application/x-www-form-urlencoded'
  | 'application/octet-stream'

/** 请求选项 */
export type RequestOption<ResponseData = any> = {

  /**
   * 请求前的钩子函数
   *
   * 例如：可以在该钩子中添加 `Authorization` 头部
   *
   * @param config - Axios 请求配置
   * @returns 处理后的请求配置
   */
  onRequest: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>

  /**
   * 判断后端返回是否成功
   *
   * @param response - Axios 响应对象
   * @returns 是否成功
   */
  isBackendSuccess: (response: AxiosResponse<ResponseData>) => boolean

  /**
   * 处理后端请求失败的钩子
   *
   * 例如：可以在该钩子中处理过期的 `token`
   *
   * @param response - Axios 响应对象
   * @param instance - Axios 实例
   */
  onBackendFail: (
    response: AxiosResponse<ResponseData>,
    instance: AxiosInstance
  ) => Promise<AxiosResponse | null> | Promise<void>

  /**
   * 处理后端 JSON 响应数据
   *
   * @param response - Axios 响应对象
   * @returns 处理后的响应数据
   */
  transformBackendResponse: (response: AxiosResponse<ResponseData>) => any | Promise<any>

  /**
   * 处理请求错误的钩子
   *
   * 例如：可以在该钩子中显示错误消息
   *
   * @param error - Axios 错误对象
   */
  onError: (error: AxiosError<ResponseData>) => void | Promise<void>
}

/** Axios 响应类型映射 */
type ResponseMap = {
  blob: Blob
  text: string
  arrayBuffer: ArrayBuffer
  stream: ReadableStream<Uint8Array>
  document: Document
}

/** 支持的响应类型 */
export type ResponseType = keyof ResponseMap | 'json'

/**
 * 根据响应类型获取具体的数据类型
 *
 * @template R - 响应类型
 * @template JsonType - JSON 类型（默认 `any`）
 */
export type MappedType<R extends ResponseType, JsonType = any> = R extends keyof ResponseMap
  ? ResponseMap[R]
  : JsonType

/** 自定义的 Axios 请求配置 */
export type CustomAxiosRequestConfig<R extends ResponseType = 'json'> = Omit<AxiosRequestConfig, 'responseType'> & {
  responseType?: R
}

/** 请求实例的通用方法 */
export type RequestInstanceCommon<T> = {

  /**
   * 通过 `requestId` 取消请求
   *
   * 如果请求配置中提供了 `AbortController`，则不会被存入 `AbortController` 映射中
   *
   * @param requestId - 请求 ID
   */
  cancelRequest: (requestId: string) => void

  /**
   * 取消所有请求
   *
   * 如果请求配置中提供了 `AbortController`，则不会被存入 `AbortController` 映射中
   */
  cancelAllRequest: () => void

  /** 请求实例的自定义状态 */
  state: T
}

/** 请求实例 */
export type RequestInstance<S = Record<string, unknown>> = {

  /**
   * 发起请求
   *
   * @template T - 解析后的数据类型
   * @template R - 响应类型，默认为 `json`
   * @param config - 自定义的 Axios 请求配置
   * @returns 解析后的数据
   */
  <T = any, R extends ResponseType = 'json'>(config: CustomAxiosRequestConfig<R>): Promise<MappedType<R, T>>
} & RequestInstanceCommon<S>

/** 扁平化成功的响应数据 */
export type FlatResponseSuccessData<T = any, ResponseData = any> = {

  /** 解析后的数据 */
  data: T

  /** 错误信息（成功时为 `null`） */
  error: null

  /** 原始的 Axios 响应对象 */
  response: AxiosResponse<ResponseData>
}

/** 扁平化失败的响应数据 */
export type FlatResponseFailData<ResponseData = any> = {

  /** 解析后的数据（失败时为 `null`） */
  data: null

  /** 错误对象 */
  error: AxiosError<ResponseData>

  /** 原始的 Axios 响应对象 */
  response: AxiosResponse<ResponseData>
}

/** 扁平化的响应数据 */
export type FlatResponseData<T = any, ResponseData = any> =
  | FlatResponseSuccessData<T, ResponseData>
  | FlatResponseFailData<ResponseData>

/** 扁平化的请求实例 */
export type FlatRequestInstance<S = Record<string, unknown>, ResponseData = any> = {

  /**
   * 发起请求
   *
   * @template T - 解析后的数据类型
   * @template R - 响应类型，默认为 `json`
   * @param config - 自定义的 Axios 请求配置
   * @returns 扁平化的响应数据
   */
  <T = any, R extends ResponseType = 'json'>(
    config: CustomAxiosRequestConfig<R>
  ): Promise<FlatResponseData<MappedType<R, T>, ResponseData>>
} & RequestInstanceCommon<S>
