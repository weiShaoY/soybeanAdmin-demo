import type { PiniaPluginContext } from 'pinia'

import { SetupStoreId } from '@/enum'

import { jsonClone } from '@sa/utils'

/**
 * 插件用于重置使用 setup 语法编写的 store 的状态
 *
 * @param context Pinia 插件上下文
 */
export function resetSetupStore(context: PiniaPluginContext) {
  const setupSyntaxIds = Object.values(SetupStoreId) as string[]

  if (setupSyntaxIds.includes(context.store.$id)) {
    const { $state } = context.store

    const defaultStore = jsonClone($state)

    context.store.$reset = () => {
      context.store.$patch(defaultStore)
    }
  }
}
