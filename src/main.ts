import { createApp } from 'vue';
import './plugins/assets';
import {
  setupAppVersionNotification,
  setupDayjs,
  setupIconifyOffline,
  setupLoading,
  setupNProgress,
  setupUI
} from './plugins';
import { setupStore } from './store';
import { setupRouter } from './router';
import App from './App.vue';

/** 设置应用程序 */
async function setupApp() {
  // 设置加载指示器
  setupLoading();

  // 设置顶部进度条
  setupNProgress();

  // 设置离线图标库
  setupIconifyOffline();

  // 设置 dayjs 日期处理库
  setupDayjs();

  // 创建 Vue 应用实例
  const app = createApp(App);

  // 设置 UI 框架
  setupUI(app);

  // 设置状态管理
  setupStore(app);

  // 设置路由
  await setupRouter(app);



  // 设置应用程序版本通知
  setupAppVersionNotification();

  // 挂载应用实例到 DOM
  app.mount('#app');
}

// 初始化应用程序
setupApp();
