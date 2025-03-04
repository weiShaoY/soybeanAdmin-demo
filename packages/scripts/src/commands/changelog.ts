import type { ChangelogOption } from '@soybeanjs/changelog'

import { generateChangelog, generateTotalChangelog } from '@soybeanjs/changelog'

/**
 * 生成变更日志
 *
 * @param options - 变更日志的选项，支持部分配置覆盖
 * @param total - 是否生成所有标签的变更日志，默认为 `false`
 * @returns {Promise<void>} - 生成变更日志的异步任务
 */
export async function genChangelog(options?: Partial<ChangelogOption>, total = false): Promise<void> {
  if (total) {
    // 生成基于所有标签的完整变更日志
    await generateTotalChangelog(options)
  }
  else {
    // 生成基于当前版本的变更日志
    await generateChangelog(options)
  }
}
