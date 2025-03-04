import { computed, reactive, ref } from 'vue';

import { useRoute } from 'vue-router';

import { defineStore } from 'pinia';

import { useLoading } from '@sa/hooks';

import { SetupStoreId } from '@/enum';

import { useRouterPush } from '@/hooks/common/router';

import { fetchGetUserInfo, fetchLogin } from '@/service/api';

import { localStg } from '@/utils/storage';

import { useRouteStore } from '../route';

import { useTabStore } from '../tab';

import { clearAuthStorage, getToken } from './shared';

export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const route = useRoute();

  const routeStore = useRouteStore();

  const tabStore = useTabStore();

  const { toLogin, redirectFromLogin } = useRouterPush(false);

  const { loading: loginLoading, startLoading, endLoading } = useLoading();

  /** 用户 token */
  const token = ref(getToken());

  /** 用户信息 */
  const userInfo: Api.Auth.UserInfo = reactive({
    userId: '',
    userName: '',
    roles: [],
    buttons: []
  });

  /** 是否具有静态超级角色 */
  const isStaticSuper = computed(() => {
    const { VITE_AUTH_ROUTE_MODE, VITE_STATIC_SUPER_ROLE } = import.meta.env;

    return VITE_AUTH_ROUTE_MODE === 'static' && userInfo.roles.includes(VITE_STATIC_SUPER_ROLE);
  });

  /** 是否登录 */
  const isLogin = computed(() => Boolean(token.value));

  /** 重置认证存储 */
  async function resetStore() {
    const authStore = useAuthStore();

    clearAuthStorage();

    authStore.$reset();

    if (!route.meta.constant) {
      await toLogin();
    }

    tabStore.cacheTabs();
    routeStore.resetStore();
  }

  /**
   * 登录
   *
   * @param userName 用户名
   * @param password 密码
   * @param redirect 登录后是否重定向。默认为 `true`. Default is `true`
   */
  async function login(userName: string, password: string, redirect = true) {
    startLoading();

    const { data: loginToken, error } = await fetchLogin(userName, password);

    if (!error) {
      const pass = await loginByToken(loginToken);

      if (pass) {
        await redirectFromLogin(redirect);

        window.$notification?.success({
          title: '登录成功',
          message: `欢迎回来，${userInfo.userName}`,
          duration: 4500
        });
      }
    } else {
      resetStore();
    }

    endLoading();
  }

  /**
   * 通过 token 登录
   *
   * @param loginToken 登录 token
   */
  async function loginByToken(loginToken: Api.Auth.LoginToken) {
    // 1. 将 token 存储在本地存储中，以便后续请求需要在 headers 中使用
    localStg.set('token', loginToken.token);
    localStg.set('refreshToken', loginToken.refreshToken);

    // 2. 获取用户信息
    const pass = await getUserInfo();

    if (pass) {
      token.value = loginToken.token;

      return true;
    }

    return false;
  }

  /**
   * 获取用户信息
   *
   * @returns 是否获取成功
   */
  async function getUserInfo() {
    const { data: info, error } = await fetchGetUserInfo();

    if (!error) {
      // 更新存储
      Object.assign(userInfo, info);

      return true;
    }

    return false;
  }

  /** 初始化用户信息 */
  async function initUserInfo() {
    const hasToken = getToken();

    if (hasToken) {
      const pass = await getUserInfo();

      if (!pass) {
        resetStore();
      }
    }
  }

  return {
    token,
    userInfo,
    isStaticSuper,
    isLogin,
    loginLoading,
    resetStore,
    login,
    initUserInfo
  };
});
