import { createAlova } from 'alova';

import type { AlovaDefaultCacheAdapter, AlovaGenerics, AlovaGlobalCacheAdapter, AlovaRequestAdapter } from 'alova';

import VueHook from 'alova/vue';

import type { VueHookType } from 'alova/vue';

import adapterFetch from 'alova/fetch';

import { createServerTokenAuthentication } from 'alova/client';

import type { FetchRequestInit } from 'alova/fetch';

import { BACKEND_ERROR_CODE } from './constant';

import type { CustomAlovaConfig, RequestOptions } from './type';

/**
 * 创建 Alova 请求实例
 *
 * @template RequestConfig 请求配置类型
 * @template ResponseType 响应数据类型
 * @template ResponseHeader 响应头部类型
 * @template L1Cache 一级缓存适配器类型
 * @template L2Cache 二级缓存适配器类型
 * @param customConfig 自定义 Alova 配置
 * @param options 请求选项
 * @returns Alova 实例
 */
export const createAlovaRequest = <
  RequestConfig = FetchRequestInit,
  ResponseType = Response,
  ResponseHeader = Headers,
  L1Cache extends AlovaGlobalCacheAdapter = AlovaDefaultCacheAdapter,
  L2Cache extends AlovaGlobalCacheAdapter = AlovaDefaultCacheAdapter
>(
  customConfig: CustomAlovaConfig<
    AlovaGenerics<any, any, RequestConfig, ResponseType, ResponseHeader, L1Cache, L2Cache, any>
  >,

  options: RequestOptions<AlovaGenerics<any, any, RequestConfig, ResponseType, ResponseHeader, L1Cache, L2Cache, any>>
) => {
  /** 令牌刷新机制 */
  const { tokenRefresher } = options;

  /**
   * 创建服务器端 Token 认证
   *
   * - `onAuthRequired`：在请求前执行，确保请求带有有效的 Token
   * - `onResponseRefreshToken`：在响应后执行，判断是否需要刷新 Token
   */
  const { onAuthRequired, onResponseRefreshToken } = createServerTokenAuthentication<
    VueHookType,
    AlovaRequestAdapter<RequestConfig, ResponseType, ResponseHeader>
  >({
    refreshTokenOnSuccess: {
      /**
       * 判断请求是否需要刷新 Token
       *
       * @param response - 请求返回的响应
       * @param method - Alova 请求方法
       * @returns 是否需要刷新 Token
       */
      isExpired: (response, method) => tokenRefresher?.isExpired(response, method) || false,

      /**
       * 处理 Token 刷新逻辑
       *
       * @param response - 请求返回的响应
       * @param method - Alova 请求方法
       * @returns 处理结果
       */
      handler: async (response, method) => tokenRefresher?.handler(response, method)
    },
    refreshTokenOnError: {
      /**
       * 检测 Token 是否过期
       *
       * @param response - 请求返回的响应
       * @param method - Alova 请求方法
       * @returns 是否过期
       */
      isExpired: (response, method) => tokenRefresher?.isExpired(response, method) || false,

      /**
       * 处理 Token 刷新逻辑
       *
       * @param response - 请求返回的响应
       * @param method - Alova 请求方法
       * @returns 处理结果
       */
      handler: async (response, method) => tokenRefresher?.handler(response, method)
    }
  });

  /** 创建 Alova 请求实例 */
  const instance = createAlova({
    /** 用户自定义配置 */
    ...customConfig,
    /** 请求超时时间，默认为 10 秒 */
    timeout: customConfig.timeout ?? 10 * 1000,
    /** 请求适配器，默认为 `fetch` 适配器 */
    requestAdapter: (customConfig.requestAdapter as any) ?? adapterFetch(),
    /** Vue 相关的状态管理 Hook */
    statesHook: VueHook,
    /** 请求前的拦截逻辑（如：Token 认证） */
    beforeRequest: onAuthRequired(options.onRequest as any),
    /** 响应后的拦截逻辑（如：Token 续期、错误处理） */
    responded: onResponseRefreshToken({
      /**
       * 处理成功的响应
       *
       * @param response - 请求返回的响应
       * @param method - Alova 请求方法
       * @returns 处理后的数据
       */
      onSuccess: async (response, method) => {
        // 检查 HTTP 状态是否成功
        let error: any = null;

        let transformedData: any = null;

        try {
          // 判断后端是否返回成功状态
          if (await options.isBackendSuccess(response)) {
            transformedData = await options.transformBackendResponse(response);
          } else {
            error = new Error('后端请求错误');
            error.code = BACKEND_ERROR_CODE;
          }
        } catch (err) {
          error = err;
        }

        // 触发错误回调
        if (error) {
          await options.onError?.(error, response, method);
          throw error;
        }

        return transformedData;
      },

      /** 请求完成时的回调 */
      onComplete: options.onComplete,

      /**
       * 处理请求失败的情况
       *
       * @param error - 请求错误
       * @param method - Alova 请求方法
       */
      onError: (error, method) => options.onError?.(error, null, method)
    })
  });

  return instance;
};

export { BACKEND_ERROR_CODE };

export type * from './type';

export type * from 'alova';
