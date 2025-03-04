import { transformRecordToOption } from '@/utils/common'

/**
 * 是或否记录
 */
export const yesOrNoRecord = {
  /** 是 */
  Y: '是',

  /** 否 */
  N: '否',
}

/** 是或否选项 */
export const yesOrNoOptions = transformRecordToOption(yesOrNoRecord)
