import cac from 'cac';

import { blue, lightGreen } from 'kolorist';

import { version } from '../package.json';
import type { Lang } from './locales';

import {
  cleanup,
  genChangelog,
  generateRoute,
  gitCommit,
  gitCommitVerify,
  printSoybean,
  release,
  updatePkg
} from './commands';

import { loadCliOptions } from './config';

/** CLI 命令类型 */
type Command =
  | 'cleanup'
  | 'update-pkg'
  | 'git-commit'
  | 'git-commit-verify'
  | 'changelog'
  | 'release'
  | 'gen-route'
  | 'print-soybean';

/**
 * 命令执行函数类型
 *
 * @template A - 命令参数类型
 */
type CommandAction<A extends object> = (args?: A) => Promise<void> | void;

/**
 * 具有描述信息的命令对象
 *
 * @template A - 命令参数类型
 */
type CommandWithAction<A extends object = object> = Record<Command, { desc: string; action: CommandAction<A> }>;

/** CLI 命令参数类型 */
type CommandArg = {
  /** 在版本提升后执行额外的命令，默认值为 'pnpm sa changelog' */
  execute?: string;

  /** 是否推送 git 提交和标签，默认值为 true */
  push?: boolean;

  /** 是否基于所有标签生成变更日志 */
  total?: boolean;

  /**
   * 要清理的目录的 glob 模式
   *
   * 如果没有设置，将使用默认值
   *
   * 多个值用逗号分隔
   */
  cleanupDir?: string;

  /**
   * CLI 界面显示语言
   *
   * @default 'en-us'
   */
  lang?: Lang;
};

/** 配置 CLI 命令行接口 */
export async function setupCli() {
  const cliOptions = await loadCliOptions();

  const cli = cac(blue('soybean-admin'));

  cli
    .version(lightGreen(version))
    .option('-e, --execute [command]', "在版本提升后执行额外的命令，默认值为 'npx soy changelog'")
    .option('-p, --push', '是否推送 git 提交和标签')
    .option('-t, --total', '是否基于所有标签生成变更日志')
    .option('-c, --cleanupDir <dir>', '要清理的目录的 glob 模式，如果没有设置，将使用默认值，多个值用逗号分隔')
    .option('-l, --lang <lang>', '显示 CLI 的语言', {
      default: 'en-us',
      type: [String]
    })
    .help();

  /** 定义 CLI 命令及其对应的操作 */
  const commands: CommandWithAction<CommandArg> = {
    cleanup: {
      desc: '删除目录：node_modules、dist 等。',
      action: async () => {
        await cleanup(cliOptions.cleanupDirs);
      }
    },
    'update-pkg': {
      desc: '更新 package.json 中的依赖版本',
      action: async () => {
        await updatePkg(cliOptions.ncuCommandArgs);
      }
    },
    'git-commit': {
      desc: 'git 提交，生成符合 Conventional Commits 标准的提交消息',
      action: async args => {
        await gitCommit(args?.lang);
      }
    },
    'git-commit-verify': {
      desc: '验证 git 提交消息，确保其符合 Conventional Commits 标准',
      action: async args => {
        await gitCommitVerify(args?.lang, cliOptions.gitCommitVerifyIgnores);
      }
    },
    changelog: {
      desc: '生成变更日志',
      action: async args => {
        await genChangelog(cliOptions.changelogOptions, args?.total);
      }
    },
    release: {
      desc: '发布：更新版本，生成变更日志，提交代码',
      action: async args => {
        await release(args?.execute, args?.push);
      }
    },
    'gen-route': {
      desc: '生成路由',
      action: async () => {
        await generateRoute();
      }
    },
    'print-soybean': {
      desc: '打印 soybean',
      action: async () => {
        await printSoybean();
      }
    }
  };

  // 遍历命令并注册到 CLI
  for (const [command, { desc, action }] of Object.entries(commands)) {
    cli.command(command, lightGreen(desc)).action(action);
  }

  // 解析 CLI 命令
  cli.parse();
}

// 运行 CLI 配置
setupCli();
