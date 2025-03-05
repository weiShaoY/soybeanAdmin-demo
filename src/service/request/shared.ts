import type { RequestInstanceState } from './type'

/**
 * 显示错误信息
 *
 * @param state 请求实例状态
 * @param message 错误信息
 */
export function showErrorMsg(state: RequestInstanceState, message: string) {
  if (!state.errMsgStack?.length) {
    state.errMsgStack = []
  }

  const isExist = state.errMsgStack.includes(message)

  if (!isExist) {
    state.errMsgStack.push(message)

    window.$message?.error({
      message,
      onClose: () => {
        state.errMsgStack = state.errMsgStack.filter(msg => msg !== message)

        setTimeout(() => {
          state.errMsgStack = []
        }, 5000)
      },
    })
  }
}
