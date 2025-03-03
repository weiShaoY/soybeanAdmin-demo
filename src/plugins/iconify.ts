import { addAPIProvider, disableCache } from '@iconify/vue';

/** 配置 Iconify 以支持离线模式 */
export function setupIconifyOffline() {
  const { VITE_ICONIFY_URL } = import.meta.env;

  // 如果环境变量中配置了 ICONIFY_URL，则设置自定义图标资源
  if (VITE_ICONIFY_URL) {
    addAPIProvider('', {
      resources: [VITE_ICONIFY_URL]
    });

    // 禁用缓存以确保图标实时更新
    disableCache('all');
  }
}
