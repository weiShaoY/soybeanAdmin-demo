import { alova } from '../request';

/**
 * 登录
 *
 * @param userName 用户名
 * @param password 密码
 */
export function fetchLogin(userName: string, password: string) {
  return alova.Post<Api.Auth.LoginToken>('/auth/login', { userName, password });
}

/** 获取用户信息 */
export function fetchGetUserInfo() {
  return alova.Get<Api.Auth.UserInfo>('/auth/getUserInfo');
}

/** 发送验证码到目标手机 */
export function sendCaptcha(phone: string) {
  return alova.Post<null>('/auth/sendCaptcha', { phone });
}

/** 验证验证码 */
export function verifyCaptcha(phone: string, code: string) {
  return alova.Post<null>('/auth/verifyCaptcha', { phone, code });
}

/**
 * 刷新令牌
 *
 * @param refreshToken 刷新令牌
 */
export function fetchRefreshToken(refreshToken: string) {
  return alova.Post<Api.Auth.LoginToken>(
    '/auth/refreshToken',
    { refreshToken },
    {
      meta: {
        authRole: 'refreshToken'
      }
    }
  );
}

/**
 * 返回自定义后端错误
 *
 * @param code 错误代码
 * @param msg 错误信息
 */
export function fetchCustomBackendError(code: string, msg: string) {
  return alova.Get('/auth/error', {
    params: { code, msg },
    shareRequest: false
  });
}
