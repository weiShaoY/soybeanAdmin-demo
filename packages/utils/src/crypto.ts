import CryptoJS from 'crypto-js'

/**
 * 加密类
 *
 * @template T 数据类型
 */
export class Crypto<T extends object> {
  /** 密钥 */
  secret: string

  /**
   * 构造函数
   *
   * @param {string} secret 密钥
   */
  constructor(secret: string) {
    this.secret = secret
  }

  /**
   * 加密数据
   *
   * @param {T} data 要加密的数据
   * @returns {string} 加密后的字符串
   */
  encrypt(data: T): string {
    const dataString = JSON.stringify(data)

    const encrypted = CryptoJS.AES.encrypt(dataString, this.secret)

    return encrypted.toString()
  }

  /**
   * 解密数据
   *
   * @param {string} encrypted 加密后的字符串
   * @returns {T | null} 解密后的数据或 null（如果解析错误）
   */
  decrypt(encrypted: string): T | null {
    const decrypted = CryptoJS.AES.decrypt(encrypted, this.secret)

    const dataString = decrypted.toString(CryptoJS.enc.Utf8)

    try {
      return JSON.parse(dataString) as T
    }
    catch {
      // 避免解析错误
      return null
    }
  }
}
