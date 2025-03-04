import type { ChangelogOption } from '@soybeanjs/changelog'

/** CLI 配置选项 */
export type CliOption = {

  /** 项目根目录 */
  cwd: string

  /**
   * 需要清理的目录或文件路径（支持 Glob 语法）
   *
   * 语法参考 {@link https://github.com/isaacs/minimatch}
   *
   * @default
   * ```json
   * ["** /dist", "** /pnpm-lock.yaml", "** /node_modules", "!node_modules/**"]
   * ```
   */
  cleanupDirs: string[]

  /**
   * `npm-check-updates` 的命令参数
   *
   * @default ['--deep', '-u']
   */
  ncuCommandArgs: string[]

  /**
   * 生成 `changelog` 的配置选项
   *
   * @link https://github.com/soybeanjs/changelog
   */
  changelogOptions: Partial<ChangelogOption>

  /** Git 提交验证时的忽略模式列表 */
  gitCommitVerifyIgnores: RegExp[]
}
