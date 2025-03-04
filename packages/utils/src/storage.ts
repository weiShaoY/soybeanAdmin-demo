import localforage from 'localforage'

/** 存储类型 */
export type StorageType = 'local' | 'session'

/**
 * 创建存储对象
 *
 * @param type 存储类型
 * @param storagePrefix 存储前缀
 * @returns 存储对象
 */
export function createStorage<T extends object>(type: StorageType, storagePrefix: string) {
  /** 存储对象 */
  const stg = type === 'session' ? window.sessionStorage : window.localStorage

  /** 存储对象 */
  const storage = {
    /**
     * 设置存储项
     *
     * @param {K} key 存储项的键
     * @param {T[K]} value 存储项的值
     */
    set<K extends keyof T>(key: K, value: T[K]) {
      /** 序列化后的 JSON 字符串 */
      const json = JSON.stringify(value)

      stg.setItem(`${storagePrefix}${key as string}`, json)
    },

    /**
     * 获取存储项
     *
     * @param {K} key 存储项的键
     * @returns {T[K] | null} 存储项的值或 null
     */
    get<K extends keyof T>(key: K): T[K] | null {
      /** 获取存储项的 JSON 字符串 */
      const json = stg.getItem(`${storagePrefix}${key as string}`)

      if (json) {
        /** 解析后的存储项数据 */
        let storageData: T[K] | null = null

        try {
          storageData = JSON.parse(json)
        }
        catch {}

        if (storageData) {
          return storageData as T[K]
        }
      }

      stg.removeItem(`${storagePrefix}${key as string}`)

      return null
    },

    /**
     * 移除存储项
     *
     * @param {K} key 存储项的键
     */
    remove(key: keyof T) {
      stg.removeItem(`${storagePrefix}${key as string}`)
    },

    /** 清空存储 */
    clear() {
      stg.clear()
    },
  }

  return storage
}

/** localforage 存储接口，扩展 getItem、setItem 和 removeItem 的泛型能力 */
type LocalForage<T extends object> = Omit<typeof localforage, 'getItem' | 'setItem' | 'removeItem'> & {

  /**
   * 获取存储项
   *
   * @param {K} key 存储项的键
   * @param {(err: any, value: T[K] | null) => void} [callback] 回调函数
   * @returns {Promise<T[K] | null>} 存储项的值或 Promise
   */
  getItem: <K extends keyof T>(key: K, callback?: (err: any, value: T[K] | null) => void) => Promise<T[K] | null>

  /**
   * 设置存储项
   *
   * @param {K} key 存储项的键
   * @param {T[K]} value 存储项的值
   * @param {(err: any, value: T[K]) => void} [callback] 回调函数
   * @returns {Promise<T[K]>} 存储项的值或 Promise
   */
  setItem: <K extends keyof T>(key: K, value: T[K], callback?: (err: any, value: T[K]) => void) => Promise<T[K]>

  /**
   * 移除存储项
   *
   * @param {K} key 存储项的键
   * @param {(err: any) => void} [callback] 回调函数
   * @returns {Promise<void>} Promise
   */
  removeItem: (key: keyof T, callback?: (err: any) => void) => Promise<void>
}

/** LocalForage 驱动类型 */
type LocalforageDriver = 'local' | 'indexedDB' | 'webSQL'

/**
 * 创建 LocalForage 存储对象
 *
 * @template T 存储对象类型
 * @param driver 存储驱动
 * @returns LocalForage 存储对象
 */
export function createLocalforage<T extends object>(driver: LocalforageDriver): LocalForage<T> {
  /** 驱动映射表 */
  const driverMap: Record<LocalforageDriver, string> = {
    local: localforage.LOCALSTORAGE,
    indexedDB: localforage.INDEXEDDB,
    webSQL: localforage.WEBSQL,
  }

  localforage.config({
    driver: driverMap[driver],
  })

  return localforage as LocalForage<T>
}
