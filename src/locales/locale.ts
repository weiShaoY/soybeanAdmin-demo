import zhCN from './langs/zh-cn';
import enUS from './langs/en-us';

/**
 * 本地化语言映射
 *
 * @type {Record<App.I18n.LangType, App.I18n.Schema>}
 */
const locales: Record<App.I18n.LangType, App.I18n.Schema> = {
  'zh-CN': zhCN,
  'en-US': enUS
};

export default locales;
