import { rimraf } from 'rimraf'

/**
 * 清理指定的目录
 *
 * @param paths - 目录清理的选项
 * @returns {Promise<void>} - 异步任务，无返回值
 */
export async function cleanup(paths: string[]): Promise<void> {
  await rimraf(paths, {
    glob: true,
  })
}
