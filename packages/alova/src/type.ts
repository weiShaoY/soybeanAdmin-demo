import type {
  AlovaGenerics,
  AlovaOptions,
  AlovaRequestAdapter,
  Method,
  ResponseCompleteHandler,
} from 'alova'

/**
 * 自定义 Alova 配置类型
 *
 * @template AG Alova 泛型参数
 */
export type CustomAlovaConfig<AG extends AlovaGenerics> = Omit<
  AlovaOptions<AG>,
  'statesHook' | 'beforeRequest' | 'responded' | 'requestAdapter'
> & {

  /** 请求适配器，Alova 的所有请求都将通过此适配器发送 */
  requestAdapter?: AlovaRequestAdapter<AG['RequestConfig'], AG['Response'], AG['ResponseHeader']>
}

/**
 * 请求选项接口
 *
 * @template AG Alova 泛型参数
 */
export type RequestOptions<AG extends AlovaGenerics> = {

  /**
   * 请求前的钩子
   *
   * 例如：可以在此钩子中添加请求头的 Token
   *
   * @param method Alova Method 实例
   */
  onRequest?: AlovaOptions<AG>['beforeRequest']

  /**
   * 校验后端响应是否成功
   *
   * @param response Alova 响应数据
   */
  isBackendSuccess: (response: AG['Response']) => Promise<boolean>

  /** 刷新 Token 的配置 */
  tokenRefresher?: {

    /** 检测 Token 是否过期 */
    isExpired: (response: AG['Response'], Method: Method<AG>) => Promise<boolean> | boolean

    /** 刷新 Token 的处理函数 */
    handler: (response: AG['Response'], Method: Method<AG>) => Promise<void>
  }

  /** 后端请求完成后的钩子 */
  onComplete?: ResponseCompleteHandler<AG>

  /**
   * 处理错误的钩子
   *
   * 例如：可以在此钩子中展示错误消息
   *
   * @param error 错误信息
   * @param response Alova 响应数据（可能为空）
   * @param methodInstance Alova Method 实例
   */
  onError?: (error: any, response: AG['Response'] | null, methodInstance: Method<AG>) => any | Promise<any>

  /**
   * 当响应类型为 JSON 时，转换后端响应数据
   *
   * @param response Alova 响应数据
   */
  transformBackendResponse: (response: AG['Response']) => any
}
