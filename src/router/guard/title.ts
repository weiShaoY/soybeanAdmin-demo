import { useTitle } from '@vueuse/core';
import type { Router } from 'vue-router';

/**
 * 创建文档标题守卫
 *
 * @param router - 路由实例
 */
export function createDocumentTitleGuard(router: Router) {
  router.afterEach(to => {
    /** 路由元信息中的国际化键 */
    const { title } = to.meta;

    /** 文档标题 */
    const documentTitle = title ? title : '';

    // 设置文档标题
    useTitle(documentTitle as string);
  });
}
