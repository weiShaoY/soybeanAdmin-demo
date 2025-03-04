import type {
  AxiosError,
  CreateAxiosDefaults,
  CustomAxiosRequestConfig,
  MappedType,
  RequestOption,
  ResponseType,
} from '@sa/axios'

import type { Ref } from 'vue'

import { createFlatRequest } from '@sa/axios'

import { ref } from 'vue'

import useLoading from './use-loading'

/** 请求成功时的数据类型 */
export type HookRequestInstanceResponseSuccessData<T = any> = {

  /** 请求成功时的数据 */
  data: Ref<T>

  /** 请求成功时的错误为 null */
  error: Ref<null>
}

/** 请求失败时的数据类型 */
export type HookRequestInstanceResponseFailData<ResponseData = any> = {

  /** 请求失败时的数据为 null */
  data: Ref<null>

  /** 请求失败时的错误信息 */
  error: Ref<AxiosError<ResponseData>>
}

/** 请求实例返回的数据类型 */
export type HookRequestInstanceResponseData<T = any, ResponseData = any> = {

  /** 请求的加载状态 */
  loading: Ref<boolean>
} & (HookRequestInstanceResponseSuccessData<T> | HookRequestInstanceResponseFailData<ResponseData>)

/** 请求实例类型 */
export type HookRequestInstance<ResponseData = any> = {

  /**
   * 发送请求的函数
   *
   * @param config 请求配置
   */
  <T = any, R extends ResponseType = 'json'>(
    config: CustomAxiosRequestConfig
  ): HookRequestInstanceResponseData<MappedType<R, T>, ResponseData>

  /**
   * 取消特定的请求
   *
   * @param requestId 请求ID
   */
  cancelRequest: (requestId: string) => void

  /** 取消所有请求 */
  cancelAllRequest: () => void
}

/**
 * 创建一个 hook 请求实例
 *
 * @param axiosConfig Axios 配置
 * @param options 请求选项
 * @returns 返回请求函数，支持状态管理及请求取消功能
 */
export default function createHookRequest<ResponseData = any>(
  axiosConfig?: CreateAxiosDefaults,
  options?: Partial<RequestOption<ResponseData>>,
) {
  // 创建一个扁平化请求
  const request = createFlatRequest<ResponseData>(axiosConfig, options)

  /** 创建 hook 请求实例 */
  const hookRequest: HookRequestInstance<ResponseData> = function hookRequest<T = any, R extends ResponseType = 'json'>(
    config: CustomAxiosRequestConfig,
  ) {
    const { loading, startLoading, endLoading } = useLoading() // 使用 loading 钩子

    /** 请求数据 */
    const data = ref<MappedType<R, T> | null>(null) as Ref<MappedType<R, T>>

    /** 请求错误 */
    const error = ref<AxiosError<ResponseData> | null>(null) as Ref<AxiosError<ResponseData> | null>

    // 开始加载
    startLoading()

    request(config).then((res) => {
      if (res.data) {
        // 请求成功，赋值数据
        data.value = res.data
      }
      else {
        // 请求失败，赋值错误
        error.value = res.error
      }

      endLoading() // 结束加载
    })

    return {
      loading,
      data,
      error,
    }
  } as HookRequestInstance<ResponseData>

  // 添加取消请求的方法
  hookRequest.cancelRequest = request.cancelRequest
  hookRequest.cancelAllRequest = request.cancelAllRequest

  return hookRequest
}
