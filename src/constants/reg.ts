/** 用户名正则 */
export const REG_USER_NAME = /^[\u4E00-\u9FA5\w-]{4,16}$/

/** 手机号正则 */
export const REG_PHONE
  = /^1((3\d)|(4[014-9])|(5[0-35-9])|(6[2567])|(7[0-8])|(8\d)|(9[0-35-9]))\d{8}$/

/**
 * 密码正则
 *
 * 6-18 个字符，包括字母、数字和下划线
 */
export const REG_PWD = /^\w{6,18}$/

/** 邮箱正则 */
export const REG_EMAIL = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

/** 六位验证码正则 */
export const REG_CODE_SIX = /^\d{6}$/

/** 四位验证码正则 */
export const REG_CODE_FOUR = /^\d{4}$/

/** URL 正则 */
export const REG_URL
  = /(((^https?:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-]*)?\??[-+=&;%@.\w]*(?:#\w*)?)?)$/
