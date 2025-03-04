import type { CliOption } from '../types'

import process from 'node:process'

import { loadConfig } from 'c12'

/** 默认选项 */
const defaultOptions: CliOption = {
  /** 当前工作目录 */
  cwd: process.cwd(),

  /** 清理文件夹 */
  cleanupDirs: [
    '**/dist',
    '**/package-lock.json',
    '**/yarn.lock',
    '**/pnpm-lock.yaml',
    '**/node_modules',
    '!node_modules/**',
  ],

  /** Npm-check-updates 命令参数 */
  ncuCommandArgs: ['--deep', '-u'],

  /** 生成 changelog 的选项 */
  changelogOptions: {
  },

  /** Git 提交验证忽略的模式列表 */
  gitCommitVerifyIgnores: [
    /^((Merge pull request)|(Merge (.*?) into (.*)|(Merge branch (.*)))(?:\r?\n)*$)/m,
    /^(Merge tag (.*))(?:\r?\n)*$/m,
    /^(R|r)evert (.*)/,
    /^(amend|fixup|squash)!/,
    /^(Merged (.*?)(in|into) (.*)|Merged PR (.*): (.*))/,
    /^Merge remote-tracking branch(\s*)(.*)/,
    /^Automatic merge(.*)/,
    /^Auto-merged (.*?) into (.*)/,
  ],
}

/**
 * 加载 CLI 选项
 *
 * @param overrides 覆盖默认选项
 * @param cwd 当前工作目录. Default is `process.cwd()`
 * @returns 返回一个 Promise 对象，包含 CLI 选项
 */
export async function loadCliOptions(overrides?: Partial<CliOption>, cwd = process.cwd()) {
  const { config } = await loadConfig<Partial<CliOption>>({
    name: 'soybean',
    defaults: defaultOptions,
    overrides,
    cwd,
    packageJson: true,
  })

  return config as CliOption
}
