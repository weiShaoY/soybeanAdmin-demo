import type { AxiosResponse, CreateAxiosDefaults, InternalAxiosRequestConfig } from 'axios';

import { nanoid } from '@sa/utils';

import axios, { AxiosError } from 'axios';

import axiosRetry from 'axios-retry';
import type {
  CustomAxiosRequestConfig,
  FlatRequestInstance,
  MappedType,
  RequestInstance,
  RequestOption,
  ResponseType
} from './type';

import { BACKEND_ERROR_CODE, REQUEST_ID_KEY } from './constant';

import { createAxiosConfig, createDefaultOptions, createRetryOptions } from './options';

/**
 * 创建通用请求实例
 *
 * @param axiosConfig Axios 配置对象
 * @param options 请求选项，支持部分自定义配置
 * @returns 返回请求实例、选项、取消请求方法、取消所有请求方法
 */
function createCommonRequest<ResponseData = any>(
  axiosConfig?: CreateAxiosDefaults,
  options?: Partial<RequestOption<ResponseData>>
) {
  // 创建默认选项
  const opts = createDefaultOptions<ResponseData>(options);

  // 创建 Axios 配置
  const axiosConf = createAxiosConfig(axiosConfig);

  // 创建 Axios 实例
  const instance = axios.create(axiosConf);

  // 存储请求的 AbortController
  const abortControllerMap = new Map<string, AbortController>();

  // 配置请求重试策略
  const retryOptions = createRetryOptions(axiosConf);

  axiosRetry(instance, retryOptions);

  // 请求拦截器
  instance.interceptors.request.use(conf => {
    const config: InternalAxiosRequestConfig = {
      ...conf
    };

    // 生成请求唯一 ID
    const requestId = nanoid();

    config.headers.set(REQUEST_ID_KEY, requestId);

    // 配置请求取消控制器
    if (!config.signal) {
      const abortController = new AbortController();

      config.signal = abortController.signal;
      abortControllerMap.set(requestId, abortController);
    }

    // 通过 Hook 处理请求配置
    const handledConfig = opts.onRequest?.(config) || config;

    return handledConfig;
  });

  // 响应拦截器
  instance.interceptors.response.use(
    async response => {
      const responseType: ResponseType = (response.config?.responseType as ResponseType) || 'json';

      if (responseType !== 'json' || opts.isBackendSuccess(response)) {
        return Promise.resolve(response);
      }

      const fail = await opts.onBackendFail(response, instance);

      if (fail) {
        return fail;
      }

      const backendError = new AxiosError<ResponseData>(
        '后端请求错误',
        BACKEND_ERROR_CODE,
        response.config,
        response.request,
        response
      );

      await opts.onError(backendError);
      return Promise.reject(backendError);
    },
    async (error: AxiosError<ResponseData>) => {
      await opts.onError(error);
      return Promise.reject(error);
    }
  );

  /**
   * 取消指定请求
   *
   * @param requestId 请求 ID
   */
  function cancelRequest(requestId: string) {
    const abortController = abortControllerMap.get(requestId);

    if (abortController) {
      abortController.abort();
      abortControllerMap.delete(requestId);
    }
  }

  /** 取消所有请求 */
  function cancelAllRequest() {
    abortControllerMap.forEach(abortController => {
      abortController.abort();
    });
    abortControllerMap.clear();
  }

  return {
    instance,
    opts,
    cancelRequest,
    cancelAllRequest
  };
}

/**
 * 创建请求实例
 *
 * @param axiosConfig Axios 配置
 * @param options 请求选项
 * @returns 返回请求函数，支持状态管理及请求取消功能
 */
export function createRequest<ResponseData = any, State = Record<string, unknown>>(
  axiosConfig?: CreateAxiosDefaults,
  options?: Partial<RequestOption<ResponseData>>
) {
  const { instance, opts, cancelRequest, cancelAllRequest } = createCommonRequest<ResponseData>(axiosConfig, options);

  const request: RequestInstance<State> = async function request<T = any, R extends ResponseType = 'json'>(
    config: CustomAxiosRequestConfig
  ) {
    const response: AxiosResponse<ResponseData> = await instance(config);

    const responseType = response.config?.responseType || 'json';

    return responseType === 'json' ? opts.transformBackendResponse(response) : (response.data as MappedType<R, T>);
  } as RequestInstance<State>;

  request.cancelRequest = cancelRequest;
  request.cancelAllRequest = cancelAllRequest;
  request.state = {} as State;

  return request;
}

/**
 * 创建扁平化请求实例 响应数据格式为 `{ data: any, error: AxiosError }`
 *
 * @param axiosConfig Axios 配置
 * @param options 请求选项
 * @returns 返回请求函数，支持错误捕获及请求取消功能
 */
export function createFlatRequest<ResponseData = any, State = Record<string, unknown>>(
  axiosConfig?: CreateAxiosDefaults,
  options?: Partial<RequestOption<ResponseData>>
) {
  const { instance, opts, cancelRequest, cancelAllRequest } = createCommonRequest<ResponseData>(axiosConfig, options);

  const flatRequest: FlatRequestInstance<State, ResponseData> = async function flatRequest<
    T = any,
    R extends ResponseType = 'json'
  >(config: CustomAxiosRequestConfig) {
    try {
      const response: AxiosResponse<ResponseData> = await instance(config);

      const responseType = response.config?.responseType || 'json';

      const data =
        responseType === 'json' ? opts.transformBackendResponse(response) : (response.data as MappedType<R, T>);

      return {
        data,
        error: null,
        response
      };
    } catch (error) {
      return {
        data: null,
        error,
        response: (error as AxiosError<ResponseData>).response
      };
    }
  } as FlatRequestInstance<State, ResponseData>;

  flatRequest.cancelRequest = cancelRequest;
  flatRequest.cancelAllRequest = cancelAllRequest;
  flatRequest.state = {} as State;

  return flatRequest;
}

export { BACKEND_ERROR_CODE, REQUEST_ID_KEY };

export type * from './type';

export type { AxiosError, CreateAxiosDefaults };
