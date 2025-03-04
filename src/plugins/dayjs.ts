import { extend, locale } from 'dayjs'

import localeData from 'dayjs/plugin/localeData'

import 'dayjs/locale/zh-cn'

import 'dayjs/locale/en'

/** 配置 Day.js 以支持本地化数据 */
export function setupDayjs() {
  // 扩展 Day.js 以支持 localeData 插件
  extend(localeData)

  // 设置 Day.js 的本地化语言
  locale('zh-CN')
}
