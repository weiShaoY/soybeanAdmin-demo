import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { useEventListener } from '@vueuse/core';
import type { RouteKey } from '@elegant-router/types';
import { router } from '@/router';
import { SetupStoreId } from '@/enum';
import { useRouterPush } from '@/hooks/common/router';
import { localStg } from '@/utils/storage';
import { useRouteStore } from '@/store/modules/route';
import { useThemeStore } from '../theme';
import {
  extractTabsByAllRoutes,
  filterTabsById,
  filterTabsByIds,
  findTabByRouteName,
  getAllTabs,
  getDefaultHomeTab,
  getFixedTabIds,
  getTabByRoute,
  getTabIdByRoute,
  isTabInTabs,
} from './shared';

/** Tab 状态管理 */
export const useTabStore = defineStore(SetupStoreId.Tab, () => {
  /** 路由状态管理 */
  const routeStore = useRouteStore();
  /** 主题状态管理 */
  const themeStore = useThemeStore();
  /** 路由跳转工具 */
  const { routerPush } = useRouterPush(false);

  /** Tab 列表 */
  const tabs = ref<App.Global.Tab[]>([]);

  /** 首页 Tab */
  const homeTab = ref<App.Global.Tab>();

  /** 初始化首页 Tab */
  function initHomeTab() {
    homeTab.value = getDefaultHomeTab(router, routeStore.routeHome);
  }

  /** 所有 Tab（包括首页 Tab） */
  const allTabs = computed(() => getAllTabs(tabs.value, homeTab.value));

  /** 当前激活的 Tab ID */
  const activeTabId = ref<string>('');

  /**
   * 设置当前激活的 Tab ID
   *
   * @param id Tab ID
   */
  function setActiveTabId(id: string) {
    activeTabId.value = id;
  }

  /**
   * 初始化 Tab 状态管理
   *
   * @param currentRoute 当前路由
   */
  function initTabStore(currentRoute: App.Global.TabRoute) {
    const storageTabs = localStg.get('globalTabs');

    if (themeStore.tab.cache && storageTabs) {
      const extractedTabs = extractTabsByAllRoutes(router, storageTabs);
      tabs.value = extractedTabs;
    }

    addTab(currentRoute);
  }

  /**
   * 添加 Tab
   *
   * @param route 路由信息
   * @param active 是否激活该 Tab
   */
  function addTab(route: App.Global.TabRoute, active = true) {
    const tab = getTabByRoute(route);

    const isHomeTab = tab.id === homeTab.value?.id;

    if (!isHomeTab && !isTabInTabs(tab.id, tabs.value)) {
      tabs.value.push(tab);
    }

    if (active) {
      setActiveTabId(tab.id);
    }
  }

  /**
   * 移除 Tab
   *
   * @param tabId Tab ID
   */
  async function removeTab(tabId: string) {
    const isRemoveActiveTab = activeTabId.value === tabId;
    const updatedTabs = filterTabsById(tabId, tabs.value);

    function update() {
      tabs.value = updatedTabs;
    }

    if (!isRemoveActiveTab) {
      update();
      return;
    }

    const activeTab = updatedTabs.at(-1) || homeTab.value;

    if (activeTab) {
      await switchRouteByTab(activeTab);
      update();
    }
  }

  /** 移除当前激活的 Tab */
  async function removeActiveTab() {
    await removeTab(activeTabId.value);
  }

  /**
   * 根据路由名称移除 Tab
   *
   * @param routeName 路由名称
   */
  async function removeTabByRouteName(routeName: RouteKey) {
    const tab = findTabByRouteName(routeName, tabs.value);
    if (!tab) return;

    await removeTab(tab.id);
  }

  /**
   * 清除所有 Tab（排除指定的 Tab）
   *
   * @param excludes 需要排除的 Tab ID 列表
   */
  async function clearTabs(excludes: string[] = []) {
    const remainTabIds = [...getFixedTabIds(tabs.value), ...excludes];
    const removedTabsIds = tabs.value.map(tab => tab.id).filter(id => !remainTabIds.includes(id));

    const isRemoveActiveTab = removedTabsIds.includes(activeTabId.value);
    const updatedTabs = filterTabsByIds(removedTabsIds, tabs.value);

    function update() {
      tabs.value = updatedTabs;
    }

    if (!isRemoveActiveTab) {
      update();
      return;
    }

    const activeTab = updatedTabs[updatedTabs.length - 1] || homeTab.value;

    await switchRouteByTab(activeTab);
    update();
  }

  /**
   * 根据 Tab 切换路由
   *
   * @param tab Tab 信息
   */
  async function switchRouteByTab(tab: App.Global.Tab) {
    const fail = await routerPush(tab.fullPath);
    if (!fail) {
      setActiveTabId(tab.id);
    }
  }

  /**
   * 清除左侧 Tab
   *
   * @param tabId 当前 Tab ID
   */
  async function clearLeftTabs(tabId: string) {
    const tabIds = tabs.value.map(tab => tab.id);
    const index = tabIds.indexOf(tabId);
    if (index === -1) return;

    const excludes = tabIds.slice(index);
    await clearTabs(excludes);
  }

  /**
   * 清除右侧 Tab
   *
   * @param tabId 当前 Tab ID
   */
  async function clearRightTabs(tabId: string) {
    const isHomeTab = tabId === homeTab.value?.id;
    if (isHomeTab) {
      clearTabs();
      return;
    }

    const tabIds = tabs.value.map(tab => tab.id);
    const index = tabIds.indexOf(tabId);
    if (index === -1) return;

    const excludes = tabIds.slice(0, index + 1);
    await clearTabs(excludes);
  }

  /**
   * 设置 Tab 的新标签
   *
   * @param label 新标签
   * @param tabId Tab ID（默认为当前激活的 Tab ID）
   */
  function setTabLabel(label: string, tabId?: string) {
    const id = tabId || activeTabId.value;

    const tab = tabs.value.find(item => item.id === id);
    if (!tab) return;

    tab.oldLabel = tab.label;
    tab.newLabel = label;
  }

  /**
   * 重置 Tab 的标签
   *
   * @param tabId Tab ID（默认为当前激活的 Tab ID）
   */
  function resetTabLabel(tabId?: string) {
    const id = tabId || activeTabId.value;

    const tab = tabs.value.find(item => item.id === id);
    if (!tab) return;

    tab.newLabel = undefined;
  }

  /**
   * 判断 Tab 是否固定
   *
   * @param tabId Tab ID
   */
  function isTabRetain(tabId: string) {
    if (tabId === homeTab.value?.id) return true;

    const fixedTabIds = getFixedTabIds(tabs.value);

    return fixedTabIds.includes(tabId);
  }



  /** 缓存 Tab */
  function cacheTabs() {
    if (!themeStore.tab.cache) return;

    localStg.set('globalTabs', tabs.value);
  }

  // 在页面关闭或刷新时缓存 Tab
  useEventListener(window, 'beforeunload', () => {
    cacheTabs();
  });

  return {
    /** 所有 Tab */
    tabs: allTabs,
    /** 当前激活的 Tab ID */
    activeTabId,
    /** 初始化首页 Tab */
    initHomeTab,
    /** 初始化 Tab 状态管理 */
    initTabStore,
    /** 添加 Tab */
    addTab,
    /** 移除 Tab */
    removeTab,
    /** 移除当前激活的 Tab */
    removeActiveTab,
    /** 根据路由名称移除 Tab */
    removeTabByRouteName,
    /** 清除所有 Tab */
    clearTabs,
    /** 清除左侧 Tab */
    clearLeftTabs,
    /** 清除右侧 Tab */
    clearRightTabs,
    /** 根据 Tab 切换路由 */
    switchRouteByTab,
    /** 设置 Tab 的新标签 */
    setTabLabel,
    /** 重置 Tab 的标签 */
    resetTabLabel,
    /** 判断 Tab 是否固定 */
    isTabRetain,

    /** 根据路由获取 Tab ID */
    getTabIdByRoute,
    /** 缓存 Tab */
    cacheTabs
  };
});
