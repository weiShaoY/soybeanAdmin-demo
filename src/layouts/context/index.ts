import { useRouteStore } from '@/store/modules/route'

import { useContext } from '@sa/hooks'

import {
  computed,
  ref,
  watch,
} from 'vue'

import { useRoute } from 'vue-router'

/**
 * 绑定 `mix-menu` 上下文，提供 `setupStore` 和 `useStore` 以在其他组件中使用。
 */
export const { setupStore: setupMixMenuContext, useStore: useMixMenuContext } = useContext('mix-menu', useMixMenu)

/**
 * 提供菜单相关的逻辑处理，包括获取菜单列表、计算当前激活的一级菜单等
 */
function useMixMenu() {
  const route = useRoute()

  const routeStore = useRouteStore()

  const { selectedKey } = useMenu()

  /**
   * 当前激活的一级菜单 key
   */
  const activeFirstLevelMenuKey = ref('')

  /**
   * 设置当前激活的一级菜单 key
   * @param {string} key - 需要设置的一级菜单 key
   */
  function setActiveFirstLevelMenuKey(key: string) {
    activeFirstLevelMenuKey.value = key
  }

  /**
   * 获取当前激活的一级菜单 key，并更新 `activeFirstLevelMenuKey`
   */
  function getActiveFirstLevelMenuKey() {
    const [firstLevelRouteName] = selectedKey.value.split('_')

    setActiveFirstLevelMenuKey(firstLevelRouteName)
  }

  /** 所有菜单项 */
  const allMenus = computed<App.Global.Menu[]>(() => routeStore.menus)

  /** 一级菜单（去除子菜单，仅保留顶层菜单项） */
  const firstLevelMenus = computed<App.Global.Menu[]>(() =>
    routeStore.menus.map((menu) => {
      const { children: _, ...rest } = menu

      return rest
    }),
  )

  /**
   *  当前激活的一级菜单下的子菜单
   */
  const childLevelMenus = computed<App.Global.Menu[]>(
    () => routeStore.menus.find(menu => menu.key === activeFirstLevelMenuKey.value)?.children || [],
  )

  /**
   * 计算当前激活的一级菜单是否有子菜单
   */
  const isActiveFirstLevelMenuHasChildren = computed(() => {
    if (!activeFirstLevelMenuKey.value) {
      return false
    }

    const findItem = allMenus.value.find(item => item.key === activeFirstLevelMenuKey.value)

    return Boolean(findItem?.children?.length)
  })

  /** 监听路由变化，自动更新当前激活的一级菜单 key */
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
    /**
     * 所有菜单项
     */
    allMenus,

    /**
     * 一级菜单（仅包含顶层菜单项，不包含子菜单）
     */
    firstLevelMenus,

    /**
     * 当前激活的一级菜单下的子菜单
     */
    childLevelMenus,

    /**
     * 当前激活的一级菜单是否有子菜单
     */
    isActiveFirstLevelMenuHasChildren,

    /**
     * 当前激活的一级菜单 key
     */
    activeFirstLevelMenuKey,

    /**
     * 设置当前激活的一级菜单 key
     */
    setActiveFirstLevelMenuKey,

    /**
     * 计算并设置当前激活的一级菜单 key
     */
    getActiveFirstLevelMenuKey,
  }
}

/**
 * 计算当前选中的菜单项 key
 *
 * @returns 当前选中的菜单 key
 * @description 返回一个包含 `selectedKey` 的对象，`selectedKey` 是一个计算属性，表示当前选中的菜单项的 key。
 */
export function useMenu() {
  const route = useRoute()

  /** 当前选中的菜单 key，可能受到 `hideInMenu` 和 `activeMenu` 影响 */
  const selectedKey = computed(() => {
    const { hideInMenu, activeMenu } = route.meta

    const name = route.name as string

    return (hideInMenu ? activeMenu : name) || name
  })

  return {
    selectedKey,
  }
}
