import { versionBump } from 'bumpp'

/**
 * 执行版本发布流程
 *
 * @param execute 执行的命令（默认为 'pnpm sa changelog'）
 * @param push 是否推送到远程仓库（默认为 true）
 */
export async function release(execute = 'pnpm sa changelog', push = true) {
  await versionBump({
    files: ['**/package.json', '!**/node_modules'],
    execute,
    all: true,
    tag: true,
    commit: 'chore(projects): release v%s',
    push,
  })
}
