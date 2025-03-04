import dayjs from 'dayjs'

import timezone from 'dayjs/plugin/timezone'

import utc from 'dayjs/plugin/utc'

/**
 * 获取当前构建时间（北京时间）
 *
 * @returns 格式化后的构建时间，例如："2025-03-02 12:34:56"
 */
export function getBuildTime() {
  dayjs.extend(utc)
  dayjs.extend(timezone)

  const buildTime = dayjs.tz(Date.now(), 'Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')

  return buildTime
}
