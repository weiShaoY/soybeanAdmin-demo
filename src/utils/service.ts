import json5 from 'json5';

/**
 * 根据当前环境创建服务配置
 *
 * @param {Env.ImportMeta} env 当前环境
 * @returns {App.Service.ServiceConfig} 服务配置
 */
export function createServiceConfig(env: Env.ImportMeta): App.Service.ServiceConfig {
  const { VITE_SERVICE_BASE_URL, VITE_OTHER_SERVICE_BASE_URL } = env;

  /** 其他服务的基本 URL */
  let other = {} as Record<App.Service.OtherBaseURLKey, string>;

  try {
    other = json5.parse(VITE_OTHER_SERVICE_BASE_URL);
  } catch {
    // eslint-disable-next-line no-console
    console.error('VITE_OTHER_SERVICE_BASE_URL is not a valid json5 string');
  }

  /** 简单服务配置 */
  const httpConfig: App.Service.SimpleServiceConfig = {
    baseURL: VITE_SERVICE_BASE_URL,
    other
  };

  /** 其他服务的键 */
  const otherHttpKeys = Object.keys(httpConfig.other) as App.Service.OtherBaseURLKey[];

  /** 其他服务配置项 */
  const otherConfig: App.Service.OtherServiceConfigItem[] = otherHttpKeys.map(key => {
    return {
      key,
      baseURL: httpConfig.other[key],
      proxyPattern: createProxyPattern(key)
    };
  });

  /** 服务配置 */
  const config: App.Service.ServiceConfig = {
    baseURL: httpConfig.baseURL,
    proxyPattern: createProxyPattern(),
    other: otherConfig
  };

  return config;
}

/**
 * 获取后端服务的基本 URL
 *
 * @param {Env.ImportMeta} env 当前环境
 * @param {boolean} isProxy 是否使用代理
 * @returns {object} 后端服务的基本 URL
 */
export function getServiceBaseURL(
  env: Env.ImportMeta,
  isProxy: boolean
): { baseURL: string; otherBaseURL: Record<App.Service.OtherBaseURLKey, string> } {
  const { baseURL, other } = createServiceConfig(env);

  /** 其他服务的基本 URL */
  const otherBaseURL = {} as Record<App.Service.OtherBaseURLKey, string>;

  other.forEach(item => {
    otherBaseURL[item.key] = isProxy ? item.proxyPattern : item.baseURL;
  });

  return {
    baseURL: isProxy ? createProxyPattern() : baseURL,
    otherBaseURL
  };
}

/**
 * 获取后端服务的代理模式 URL
 *
 * @param {App.Service.OtherBaseURLKey} [key] 如果未设置，将使用默认键
 * @returns {string} 代理模式 URL
 */
function createProxyPattern(key?: App.Service.OtherBaseURLKey): string {
  if (!key) {
    return '/proxy-default';
  }

  return `/proxy-${key}`;
}
