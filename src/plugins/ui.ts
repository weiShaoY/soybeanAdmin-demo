import type { App } from 'vue';

import ElementPlus, { ElCard, ElTable } from 'element-plus';

/** 全局表格列对齐方式 */
ElTable.TableColumn.props.align = {
  type: String,
  default: 'center'
};

/** 全局 ElCard 阴影效果 */
ElCard.props.shadow = {
  type: String,
  default: 'never'
};

/** 全量引入 ElementPlus 并进行全局注册 */
export function setupUI(app: App) {
  app.use(ElementPlus);
}
