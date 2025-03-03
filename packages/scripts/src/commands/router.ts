import process from 'node:process';
import path from 'node:path';
import { writeFile } from 'node:fs/promises';
import { existsSync, mkdirSync } from 'node:fs';
import { prompt } from 'enquirer';
import { green, red } from 'kolorist';

/** Prompt 对象类型定义 */
type PromptObject = {
  /** 路由名称 */
  routeName: string;
  /** 是否添加路由参数 */
  addRouteParams: boolean;
  /** 路由参数 */
  routeParams: string;
};

/**
 * 生成路由
 *
 * @returns {Promise<void>} 返回一个 Promise 对象
 */
export async function generateRoute(): Promise<void> {
  /** 获取用户输入 */
  const result = await prompt<PromptObject>([
    {
      /** 路由名称 */
      name: 'routeName',
      /** 输入类型 */
      type: 'text',
      /** 提示信息 */
      message: '请输入路由名称',
      /** 初始值 */
      initial: 'demo-route_child'
    },
    {
      /** 是否添加路由参数 */
      name: 'addRouteParams',
      /** 输入类型 */
      type: 'confirm',
      /** 提示信息 */
      message: '是否添加路由参数？',
      /** 初始值 */
      initial: false
    }
  ]);

  // 如果用户选择添加路由参数，获取参数输入
  if (result.addRouteParams) {
    const answers = await prompt<PromptObject>({
      /** 路由参数 */
      name: 'routeParams',
      /** 输入类型 */
      type: 'text',
      /** 提示信息 */
      message: '请输入路由参数名称',
      /** 初始值 */
      initial: 'id'
    });

    Object.assign(result, answers);
  }

  /** 路由名称模式s */
  const PAGE_DIR_NAME_PATTERN = /^[\w-]+[0-9a-zA-Z]+$/;

  // 校验路由名称格式
  if (!PAGE_DIR_NAME_PATTERN.test(result.routeName)) {
    throw new Error(`${red('路由名称不合法，仅允许字母、数字、"-" 或 "_"')}。
示例:
(1) 一级路由: ${green('demo-route')}
(2) 二级路由: ${green('demo-route_child')}
(3) 多级路由: ${green('demo-route_child_child')}
(4) 分组路由: ${green('_ignore_demo-route')}
`);
  }

  /** 路由参数模式s */
  const PARAM_REG = /^\w+$/g;

  // 校验路由参数格式
  if (result.routeParams && !PARAM_REG.test(result.routeParams)) {
    throw new Error(red('route params is invalid, it only allow letters, numbers or "_".'));
  }

  const cwd = process.cwd();

  // 分割路由名称，获取目录路径
  const [dir, ...rest] = result.routeName.split('_') as string[];

  let routeDir = path.join(cwd, 'src', 'views', dir);

  if (rest.length) {
    routeDir = path.join(routeDir, rest.join('_'));
  }

  // 检查目录是否存在，不存在则创建
  if (!existsSync(routeDir)) {
    mkdirSync(routeDir, { recursive: true });
  } else {
    throw new Error(red('route already exists'));
  }

  /** 如果用户添加了路由参数，则文件名格式为 `[参数名].vue`，否则为 `index.vue` */
  const fileName = result.routeParams ? `[${result.routeParams}].vue` : 'index.vue';

  /** Vue 文件模板 */
  const vueTemplate = `<script setup lang="ts"></script>

<template>
  <div>${result.routeName}</div>
</template>

<style scoped></style>
`;

  const filePath = path.join(routeDir, fileName);

  // 写入文件
  await writeFile(filePath, vueTemplate);
}
