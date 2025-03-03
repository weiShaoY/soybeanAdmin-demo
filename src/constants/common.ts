import { transformRecordToOption } from '@/utils/common';

/**
 * 是或否记录
 *
 * @type {Record<CommonType.YesOrNo, App.I18n.I18nKey>}
 */
export const yesOrNoRecord: Record<CommonType.YesOrNo, App.I18n.I18nKey> = {
  /** 是 */
  Y: 'common.yesOrNo.yes',
  /** 否 */
  N: 'common.yesOrNo.no'
};

/** 是或否选项 */
export const yesOrNoOptions = transformRecordToOption(yesOrNoRecord);
