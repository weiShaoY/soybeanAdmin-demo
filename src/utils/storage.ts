import { createLocalforage, createStorage } from '@sa/utils'

/** 存储前缀 */
const storagePrefix = import.meta.env.VITE_STORAGE_PREFIX || ''

/** 本地存储 */
export const localStg = createStorage<StorageType.Local>('local', storagePrefix)

/** 会话存储 */
export const sessionStg = createStorage<StorageType.Session>('session', storagePrefix)

/** LocalForage 本地存储 */
export const localforage = createLocalforage<StorageType.Local>('local')
