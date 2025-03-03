import { readFileSync } from 'node:fs';

import path from 'node:path';

import { prompt } from 'enquirer';
import type { Lang } from '../locales';

import { locales } from '../locales';

import { execCommand } from '../shared';

/** 提示用户输入的 Git 提交信息对象 */
type PromptObject = {
  /** 提交类型（如 feat、fix） */
  types: string;

  /** 提交作用域（如 core、ui） */
  scopes: string;

  /** 提交描述 */
  description: string;
};

/**
 * 生成符合 Conventional Commits 规范的 Git 提交信息
 *
 * @param {Lang} [lang] - 选择的语言，默认为 'en-us'
 * @returns {Promise<void>} - 异步函数，无返回值
 */
export async function gitCommit(lang: Lang = 'en-us'): Promise<void> {
  const { gitCommitMessages, gitCommitTypes, gitCommitScopes } = locales[lang];

  /** 生成类型选择列表 */
  const typesChoices = gitCommitTypes.map(([value, msg]) => ({
    name: value,
    message: `${value.padEnd(12)}${msg}`
  }));

  /** 生成作用域选择列表 */
  const scopesChoices = gitCommitScopes.map(([value, msg]) => ({
    name: value,
    message: `${value.padEnd(30)} (${msg})`
  }));

  /** 提示用户选择或输入提交信息 */
  const result = await prompt<PromptObject>([
    {
      name: 'types',
      type: 'select',
      message: gitCommitMessages.types,
      choices: typesChoices
    },
    {
      name: 'scopes',
      type: 'select',
      message: gitCommitMessages.scopes,
      choices: scopesChoices
    },
    {
      name: 'description',
      type: 'text',
      message: gitCommitMessages.description
    }
  ]);

  /** 判断是否为破坏性更改 */
  const breaking = result.description.startsWith('!') ? '!' : '';

  /** 清除破坏性更改标记 */
  const description = result.description.replace(/^!/, '').trim();

  /** 生成符合 Conventional Commits 规范的 Git 提交信息 */
  const commitMsg = `${result.types}(${result.scopes})${breaking}: ${description}`;

  // 执行 Git 提交命令
  await execCommand('git', ['commit', '-m', commitMsg], {
    stdio: 'inherit'
  });
}

/**
 * 验证 Git 提交信息是否符合 Conventional Commits 规范
 *
 * @param {Lang} [lang] - 选择的语言，默认为 'en-us'
 * @param {RegExp[]} [ignores] - 需要忽略的提交信息匹配规则
 * @returns {Promise<void>} - 异步函数，无返回值
 * @throws {Error} 如果提交信息不符合规范，则抛出错误
 */
export async function gitCommitVerify(lang: Lang = 'en-us', ignores: RegExp[] = []): Promise<void> {
  /** 获取 Git 项目根目录路径 */
  const gitPath = await execCommand('git', ['rev-parse', '--show-toplevel']);

  /** 读取 Git 提交信息文件 */
  const gitMsgPath = path.join(gitPath, '.git', 'COMMIT_EDITMSG');

  /** 读取 Git 提交信息 */
  const commitMsg = readFileSync(gitMsgPath, 'utf8').trim();

  // 如果提交信息符合忽略规则，则跳过验证
  if (ignores.some(regExp => regExp.test(commitMsg))) {
    return;
  }

  /** Conventional Commits 规范的正则匹配s */
  const REG_EXP = /(?<type>[a-z]+)(?:\((?<scope>.+)\))?(?<breaking>!)?: (?<description>.+)/i;

  if (!REG_EXP.test(commitMsg)) {
    const errorMsg = locales[lang].gitCommitVerify;

    throw new Error(errorMsg);
  }
}
