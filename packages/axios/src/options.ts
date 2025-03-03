import type { CreateAxiosDefaults } from 'axios';
import type { IAxiosRetryConfig } from 'axios-retry';
import { stringify } from 'qs';
import { isHttpSuccess } from './shared';
import type { RequestOption } from './type';

/**
 * 创建默认的请求选项
 *
 * @param options - 部分请求选项
 * @returns 完整的请求选项
 */
export function createDefaultOptions<ResponseData = any>(options?: Partial<RequestOption<ResponseData>>) {
  /** 定义默认的请求选项 */
  const opts: RequestOption<ResponseData> = {
    /** 请求前的钩子函数，默认直接返回 config */
    onRequest: async config => config,

    /** 判断后端请求是否成功，默认总是返回 true */
    isBackendSuccess: _response => true,

    /** 处理后端请求失败的回调，默认不执行任何操作 */
    onBackendFail: async () => {},

    /** 转换后端返回的响应数据，默认直接返回 response.data */
    transformBackendResponse: async response => response.data,

    /** 处理请求错误的回调，默认不执行任何操作 */
    onError: async () => {}
  };

  Object.assign(opts, options);

  return opts;
}

/**
 * 创建请求重试选项
 *
 * @param config - 可选的 Axios 配置
 * @returns 请求重试的配置
 */
export function createRetryOptions(config?: Partial<CreateAxiosDefaults>) {
  /** 定义默认的重试配置，默认不重试 */
  const retryConfig: IAxiosRetryConfig = {
    retries: 0
  };

  Object.assign(retryConfig, config);

  return retryConfig;
}

/**
 * 创建 Axios 配置
 *
 * @param config - 可选的 Axios 配置
 * @returns 完整的 Axios 配置
 */
export function createAxiosConfig(config?: Partial<CreateAxiosDefaults>) {
  const TEN_SECONDS = 10 * 1000;

  const axiosConfig: CreateAxiosDefaults = {
    /** 超时时间 */
    timeout: TEN_SECONDS,
    /** 默认请求头，设置为 JSON 格式 */
    headers: {
      'Content-Type': 'application/json'
    },

    /** 验证 HTTP 响应状态码，使用 isHttpSuccess 函数 */
    validateStatus: isHttpSuccess,
    /** 序列化请求参数，使用 qs 库的 stringify 方法s */
    paramsSerializer: params => {
      return stringify(params);
    }
  };
  // 合并传入的 config 配置
  Object.assign(axiosConfig, config);

  return axiosConfig;
}
