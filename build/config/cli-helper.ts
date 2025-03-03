/* eslint-disable */
import process from 'node:process'
import readline from 'node:readline'

/**
 * 清空终端屏幕的内容，并将光标重置到屏幕顶部
 */
function clearScreen() {
  // 计算屏幕剩余的行数，用于清空终端内容
  const repeatCount = process.stdout.rows - 2
  // 如果行数大于 0，则用换行符填充清空屏幕的空间
  const blank = repeatCount > 0 ? '\n'.repeat(repeatCount) : ''
  console.log(blank)
  // 将光标移动到终端的第一个位置
  readline.cursorTo(process.stdout, 0, 0)
  // 清除光标下的所有内容
  readline.clearScreenDown(process.stdout)
}

/**
 * 格式化文本，加上起始符号和结束符号，支持自定义替换的关闭符号
 *
 * @param open - 开始符号
 * @param close - 结束符号
 * @param replace - 替换关闭符号，默认和 `open` 一致
 * @returns 返回格式化函数
 */
function formatter(open: string, close: string, replace = open) {
  return (input: string) => {
    const string = `${input}` // 确保输入为字符串
    const index = string.indexOf(close, open.length) // 找到关闭符号的位置
    // 如果找到了关闭符号，执行替换操作
    return ~index ? open + replaceClose(string, close, replace, index) + close : open + string + close
  }
}

/**
 * 替换关闭符号后的内容，支持递归处理嵌套结构
 *
 * @param string - 输入字符串
 * @param close - 结束符号
 * @param replace - 替换关闭符号
 * @param index - 当前关闭符号的位置
 * @returns 返回替换后的字符串
 */
function replaceClose(string: string, close: string, replace: string, index: number): string {
  const start = string.substring(0, index) + replace // 获取替换后的开头部分
  const end = string.substring(index + close.length) // 获取关闭符号后的部分
  const nextIndex = end.indexOf(close) // 查找下一个关闭符号
  // 如果存在嵌套的关闭符号，递归替换
  return ~nextIndex ? start + replaceClose(end, close, replace, nextIndex) : start + end
}

/**
 * 创建一系列颜色格式化函数
 *
 * @returns 返回包含不同颜色样式的对象
 */
function createColors() {
  return {
    /**
     * 黑色背景
     */
    bgBlack: formatter('\x1B[40m', '\x1B[49m'),

    /**
     * 蓝色背景
     */
    bgBlue: formatter('\x1B[44m', '\x1B[49m'),

    /**
     * 青色背景
     */
    bgCyan: formatter('\x1B[46m', '\x1B[49m'),

    /**
     * 绿色背景
     */
    bgGreen: formatter('\x1B[42m', '\x1B[49m'),

    /**
     * 品红色背景
     */
    bgMagenta: formatter('\x1B[45m', '\x1B[49m'),

    /**
     * 红色背景，特殊格式
     */
    bgRed: formatter('\x1B[41m', '\x1B[49m', '\x1B[22m\x1B[1m'),

    /**
     * 白色背景
     */
    bgWhite: formatter('\x1B[47m', '\x1B[49m'),

    /**
     * 黄色背景
     */
    bgYellow: formatter('\x1B[43m', '\x1B[49m'),

    /**
     * 黑色字体
     */
    black: formatter('\x1B[30m', '\x1B[39m'),

    /**
     * 蓝色字体
     */
    blue: formatter('\x1B[34m', '\x1B[39m'),

    /**
     * 加粗字体
     */
    bold: formatter('\x1B[1m', '\x1B[22m', '\x1B[22m\x1B[1m'),

    /**
     * 青色字体
     */
    cyan: formatter('\x1B[36m', '\x1B[39m'),

    /**
     * 昏暗字体
     */
    dim: formatter('\x1B[2m', '\x1B[22m', '\x1B[22m\x1B[2m'),

    /**
     * 灰色字体
     */
    gray: formatter('\x1B[90m', '\x1B[39m'),

    /**
     * 绿色字体
     */
    green: formatter('\x1B[32m', '\x1B[39m'),

    /**
     * 隐藏文本
     */
    hidden: formatter('\x1B[8m', '\x1B[28m'),

    /**
     * 反转颜色
     */
    inverse: formatter('\x1B[7m', '\x1B[27m'),

    /**
     * 斜体字体
     */
    italic: formatter('\x1B[3m', '\x1B[23m'),

    /**
     * 品红色字体
     */
    magenta: formatter('\x1B[35m', '\x1B[39m'),

    /**
     * 红色字体
     */
    red: formatter('\x1B[31m', '\x1B[39m'),

    /**
     * 重置样式
     *
     * @param s - 输入的字符串
     * @returns 返回重置样式后的字符串
     */
    reset: (s: string) => `\x1B[0m${s}\x1B[0m`,

    /**
     * 删除线
     */
    strikethrough: formatter('\x1B[9m', '\x1B[29m'),

    /**
     * 下划线
     */
    underline: formatter('\x1B[4m', '\x1B[24m'),

    /**
     * 白色字体
     */
    white: formatter('\x1B[37m', '\x1B[39m'),

    /**
     * 黄色字体
     */
    yellow: formatter('\x1B[33m', '\x1B[39m'),
  }
}

export { clearScreen, createColors }
