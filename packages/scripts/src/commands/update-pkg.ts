import { execCommand } from '../shared';

/**
 * 更新包
 *
 * @param args 更新包的参数- 传递给 `ncu`（npm-check-updates）的参数，默认为 `['--deep', '-u']`. Default is `['--deep', '-u']`
 * @returns 返回一个 Promise 对象
 */
export async function updatePkg(args: string[] = ['--deep', '-u']) {
  execCommand('npx', ['ncu', ...args], { stdio: 'inherit' });
}
