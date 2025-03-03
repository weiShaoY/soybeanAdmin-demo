import { extend } from 'dayjs';

import localeData from 'dayjs/plugin/localeData';

import { setDayjsLocale } from '../locales/dayjs';

/** 配置 Day.js 以支持本地化数据 */
export function setupDayjs() {
  // 扩展 Day.js 以支持 localeData 插件
  extend(localeData);

  // 设置 Day.js 的本地化语言
  setDayjsLocale();
}
