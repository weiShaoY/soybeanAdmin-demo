import { transformRecordToOption } from '@/utils/common'

/**
 * 启用状态记录
 */
export const enableStatusRecord = {
  /** 启用 */
  1: '启用',

  /** 禁用 */
  2: '禁用',
}

/** 启用状态选项 */
export const enableStatusOptions = transformRecordToOption(enableStatusRecord)

/**
 * 用户性别记录
 */
export const userGenderRecord = {
  /** 男性 */
  1: '男',

  /** 女性 */
  2: '女',
}

/** 用户性别选项 */
export const userGenderOptions = transformRecordToOption(userGenderRecord)

/**
 * 菜单类型记录
 */
export const menuTypeRecord = {
  /** 目录 */
  1: '目录',

  /** 菜单 */
  2: '菜单',
}

/** 菜单类型选项 */
export const menuTypeOptions = transformRecordToOption(menuTypeRecord)

/**
 * 菜单图标类型记录
 */
export const menuIconTypeRecord = {
  /** Iconify 图标 */
  1: 'iconify图标',

  /** 本地图标 */
  2: '本地图标',
}

/** 菜单图标类型选项 */
export const menuIconTypeOptions = transformRecordToOption(menuIconTypeRecord)
