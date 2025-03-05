import { request } from '../request'

/**
 * return custom backend error
 *
 * @param code error code
 * @param msg error message
 */
export function fetchCustomBackendError(code: string, msg: string) {
  return request({
    url: '/auth/error',
    params: {
      code,
      msg,
    },
  })
}
