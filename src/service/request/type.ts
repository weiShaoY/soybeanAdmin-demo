/** 请求实例状态类型 */
export type RequestInstanceState = {

  /** 是否正在刷新令牌 */
  refreshTokenFn: Promise<boolean> | null

  /** 请求错误信息堆栈 */
  errMsgStack: string[]
}
