import { useRouteStore } from '@/store/modules/route'

import { useContext } from '@sa/hooks'

import {
  computed,
  ref,
  watch,
} from 'vue'

import { useRoute } from 'vue-router'

// 创建和使用 MixMenu 的上下文
export const { setupStore: setupMixMenuContext, useStore: useMixMenuContext } = useContext('mix-menu', useMixMenu)

/**
 * MixMenu 逻辑处理函数
 */
function useMixMenu() {
  const route = useRoute()

  const routeStore = useRouteStore()

  const { selectedKey } = useMenu()

  // 存储当前激活的一级菜单 key
  const activeFirstLevelMenuKey = ref('')

  /**
   * 设置当前激活的一级菜单 key
   * @param  key - 菜单的 key
   */
  function setActiveFirstLevelMenuKey(key: string) {
    activeFirstLevelMenuKey.value = key
  }

  /**
   * 根据 routeKey 获取父级 routeKey
   *
   * @param routes 路由列表
   * @param targetKey 目标 routeKey
   * @returns 父级 routeKey，如果没有父级则返回自身的 routeKey
   */
  function getParentRouteKey(routes: any[], targetKey: string): string {
  /**
   * 递归查找函数
   * @param routes 当前遍历的路由数组
   * @param parentKey 父级 routeKey
   * @returns 找到的父级 routeKey 或 null
   */
    function findParent(routes: any[], parentKey: string | null = null): string | null {
      for (const route of routes) {
        if (route.routeKey === targetKey) {
          return parentKey ?? route.routeKey // 如果有父级则返回父级，否则返回自身
        }

        if (route.children) {
          const result = findParent(route.children, route.routeKey)

          if (result) {
            return result
          }
        }
      }

      return null
    }

    return findParent(routes) ?? targetKey // 如果没有找到，返回自身
  }

  /**
   * 获取当前激活的一级菜单 key
   */
  function getActiveFirstLevelMenuKey() {
    // const [firstLevelRouteName] = selectedKey.value.split('_')

    const key = getParentRouteKey(routeStore.menus, selectedKey.value)

    console.log('%c Line:79 🍫 key', 'color:#42b983', key)
    console.log('%c Line:43 🍕 routeStore.menus', 'color:#e41a6a', routeStore.menus)
    console.log('%c Line:42 🍊 selectedKey.value', 'color:#7f2b82', selectedKey.value)

    setActiveFirstLevelMenuKey(key)
  }

  // 获取所有菜单
  const allMenus = computed(() => routeStore.menus)

  // 获取一级菜单列表（去掉 children）
  const firstLevelMenus = computed(() =>
    routeStore.menus.map((menu) => {
      const { children: _, ...rest } = menu

      return rest
    }),
  )

  // 获取当前激活的一级菜单下的子菜单
  const childLevelMenus = computed(() =>
    routeStore.menus.find(menu => menu.key === activeFirstLevelMenuKey.value)?.children || [],
  )

  // 判断当前激活的一级菜单是否有子菜单
  const isActiveFirstLevelMenuHasChildren = computed(() => {
    if (!activeFirstLevelMenuKey.value) {
      return false
    }

    const findItem = allMenus.value.find(item => item.key === activeFirstLevelMenuKey.value)

    return Boolean(findItem?.children?.length)
  })

  // 监听路由变化，更新当前激活的一级菜单 key
  watch(
    () => route.name,
    () => {
      getActiveFirstLevelMenuKey()
    },
    {
      immediate: true,
    },
  )

  return {
    allMenus,
    firstLevelMenus,
    childLevelMenus,
    isActiveFirstLevelMenuHasChildren,
    activeFirstLevelMenuKey,
    setActiveFirstLevelMenuKey,
    getActiveFirstLevelMenuKey,
  }
}

/**
 * 处理菜单选中逻辑
 */
export function useMenu() {
  const route = useRoute()

  // 计算当前选中的菜单 key
  const selectedKey = computed(() => {
    const { hideInMenu, activeMenu } = route.meta

    const name = route.name as string

    return (hideInMenu ? activeMenu : name) || name
  })

  return {
    selectedKey,
  }
}
