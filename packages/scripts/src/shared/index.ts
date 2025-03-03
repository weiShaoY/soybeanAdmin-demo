import type { Options } from 'execa';

/**
 * 执行 shell 命令
 *
 * @param cmd 要执行的命令
 * @param args 传递给命令的参数数组
 * @param options `execa` 选项（可选）
 * @returns 返回命令执行的标准输出内容（去除首尾空格）
 */
export async function execCommand(cmd: string, args: string[], options?: Options): Promise<string> {
  const { execa } = await import('execa');

  const res = await execa(cmd, args, options);

  return (res?.stdout as string)?.trim() || '';
}
