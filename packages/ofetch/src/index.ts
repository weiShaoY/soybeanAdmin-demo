import { ofetch } from 'ofetch';
import type { FetchOptions } from 'ofetch';

/**
 * 创建请求实例
 *
 * @param options Fetch 配置选项
 * @returns 请求实例
 */
export function createRequest(options: FetchOptions) {
  const request = ofetch.create(options);

  return request;
}

export default createRequest;
