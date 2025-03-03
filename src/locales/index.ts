import type { App } from 'vue';
import { createI18n } from 'vue-i18n';
import { localStg } from '@/utils/storage';
import messages from './locale';

/** 创建 i18n 实例 */
const i18n = createI18n({
  locale: localStg.get('lang') || 'zh-CN',
  fallbackLocale: 'en',
  messages,
  legacy: false
});

/**
 * 设置插件 i18n
 *
 * @param {App} app Vue 应用实例
 */
export function setupI18n(app: App) {
  app.use(i18n);
}

/** 全局翻译函数 */
export const $t = i18n.global.t as App.I18n.$T;

/**
 * 设置语言
 *
 * @param {App.I18n.LangType} locale 语言类型
 */
export function setLocale(locale: App.I18n.LangType) {
  i18n.global.locale.value = locale;
}
