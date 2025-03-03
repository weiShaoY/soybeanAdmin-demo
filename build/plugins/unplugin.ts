import process from 'node:process';
import path from 'node:path';
import type { PluginOption } from 'vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

/**
 * 配置 Unplugin 相关插件
 *
 * @param viteEnv - 当前环境变量
 * @returns 返回 Vite 插件数组
 */
export function setupUnplugin(viteEnv: Env.ImportMeta) {
  const { VITE_ICON_PREFIX, VITE_ICON_LOCAL_PREFIX } = viteEnv;

  // 本地 SVG 图标存放路径
  const localIconPath = path.join(process.cwd(), 'src/assets/svg-icon');

  /** 本地图标集合的名称 */
  const collectionName = VITE_ICON_LOCAL_PREFIX.replace(`${VITE_ICON_PREFIX}-`, '');

  const plugins: PluginOption[] = [
    /**
     * `unplugin-icons` 插件：
     *
     * 1. 支持自动按需导入图标
     * 2. 允许使用自定义本地图标集合
     */
    Icons({
      compiler: 'vue3',
      customCollections: {
        [collectionName]: FileSystemIconLoader(localIconPath, svg =>
          svg.replace(/^<svg\s/, '<svg width="1em" height="1em" ')
        )
      },
      scale: 1,
      defaultClass: 'inline-block'
    }),

    /**
     * `unplugin-vue-components` 插件：
     *
     * 1. 支持 Vue 组件的自动导入
     * 2. 允许解析 Element Plus 组件
     * 3. 允许解析 `unplugin-icons` 生成的图标组件
     */
    Components({
      dts: 'src/typings/components.d.ts', // 生成的组件类型声明文件
      types: [{ from: 'vue-router', names: ['RouterLink', 'RouterView'] }],
      resolvers: [
        // 自动导入 Element Plus 组件，完整导入可查看 /src/plugins/ui.ts
        ElementPlusResolver({
          importStyle: false // 不自动导入样式，完整导入可查看 /src/plugins/assets.ts
        }),
        // 自动解析自定义图标，结合 `unplugin-icons`
        IconsResolver({ customCollections: [collectionName], componentPrefix: VITE_ICON_PREFIX })
      ]
    }),

    /**
     * `vite-plugin-svg-icons` 插件：
     *
     * 1. 允许以 Symbol 方式使用 SVG 图标
     * 2. 支持按目录自动导入 SVG 图标
     * 3. 提供 `symbolId` 规则自定义
     */
    createSvgIconsPlugin({
      iconDirs: [localIconPath], // 指定 SVG 图标目录
      symbolId: `${VITE_ICON_LOCAL_PREFIX}-[dir]-[name]`, // 生成的 symbol ID 规则
      inject: 'body-last', // 将 SVG 注入到 body 末尾
      customDomId: '__SVG_ICON_LOCAL__' // 自定义 DOM ID
    })
  ];

  return plugins;
}
