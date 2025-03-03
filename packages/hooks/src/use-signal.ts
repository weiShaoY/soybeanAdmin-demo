import { computed, ref, shallowRef, triggerRef } from 'vue';
import type {
  ComputedGetter,
  DebuggerOptions,
  Ref,
  ShallowRef,
  WritableComputedOptions,
  WritableComputedRef
} from 'vue';

/** 更新器类型定义，接收一个值并返回更新后的值s */
type Updater<T> = (value: T) => T;

/** 变更器类型定义，接收一个值并对其进行变更 */
type Mutator<T> = (value: T) => void;

/**
 * Signal 是一个可以设置、更新或变更的响应式值
 *
 * @example
 *   ```ts
 *   const count = useSignal(0);
 *
 *   // `watchEffect`
 *   watchEffect(() => {
 *   console.log(count());
 *   });
 *
 *   // watch
 *   watch(count, value => {
 *   console.log(value);
 *   });
 *
 *   // useComputed
 *   const double = useComputed(() => count() * 2);
 *   const writeableDouble = useComputed({
 *   get: () => count() * 2,
 *   set: value => count.set(value / 2)
 *   });
 *   ```
 */
export type Signal<T> = {
  (): Readonly<T>; // 获取当前信号值
  /**
   * 设置信号的值
   *
   * 推荐对于原始值使用 `set`
   *
   * @param value
   */
  set(value: T): void;

  /**
   * 使用更新器函数更新信号的值
   *
   * 推荐对于非原始值使用 `update`，只有对象的第一层会是响应式的。
   *
   * @param updater
   */
  update(updater: Updater<T>): void;

  /**
   * 使用变更器函数变更信号的值
   *
   * 此操作会调用 `triggerRef`，因此该值会在 `watchEffect` 中被追踪。
   *
   * 推荐对于非原始值使用 `mutate`，对象的所有层次都会是响应式的。
   *
   * @param mutator
   */
  mutate(mutator: Mutator<T>): void;

  /**
   * 获取信号的引用
   *
   * 有时这对于使 `v-model` 与信号一起工作是有用的
   *
   * ```vue
   * <template>
   *   <input v-model="model.count" />
   * </template>;
   *
   * <script setup lang="ts">
   *  const state = useSignal({ count: 0 }, { useRef: true });
   *
   *  const model = state.getRef();
   * </script>
   * ```
   */
  getRef(): Readonly<ShallowRef<Readonly<T>>>;
};

/** 只读信号 */
export type ReadonlySignal<T> = {
  (): Readonly<T>; // 返回只读信号
};

// 信号选项的类型定义
export type SignalOptions = {
  /**
   * 是否使用 `ref` 来存储值
   *
   * @default false 使用 `sharedRef` 来存储值
   */
  useRef?: boolean;
};

/**
 * 创建一个信号
 *
 * @param initialValue 初始值
 * @param options 可选配置
 */
export function useSignal<T>(initialValue: T, options?: SignalOptions): Signal<T> {
  // 从选项中解构出 useRef 参数
  const { useRef } = options || {};

  // 根据 useRef 选项选择使用 `ref` 或 `shallowRef` 来存储值
  const state = useRef ? (ref(initialValue) as Ref<T>) : shallowRef(initialValue);

  // 创建并返回信号
  return createSignal(state);
}

/**
 * 创建计算属性信号
 *
 * @param getter 计算器函数或选项
 * @param debugOptions 调试选项
 */
export function useComputed<T>(getter: ComputedGetter<T>, debugOptions?: DebuggerOptions): ReadonlySignal<T>;

export function useComputed<T>(options: WritableComputedOptions<T>, debugOptions?: DebuggerOptions): Signal<T>;

export function useComputed<T>(
  getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>,
  debugOptions?: DebuggerOptions
) {
  const isGetter = typeof getterOrOptions === 'function';

  const computedValue = computed(getterOrOptions as any, debugOptions);

  // 如果是 getter 返回只读信号
  if (isGetter) {
    return () => computedValue.value as ReadonlySignal<T>;
  }
  // 否则返回可以写入的信号
  return createSignal(computedValue);
}

/**
 * 创建信号
 *
 * @param state 存储信号值的 `shallowRef` 或 `WritableComputedRef`
 */
function createSignal<T>(state: ShallowRef<T> | WritableComputedRef<T>): Signal<T> {
  /** 信号的主体函数，用于获取当前值 */
  const signal = () => state.value;

  // 设置信号值的函数
  signal.set = (value: T) => {
    state.value = value;
  };

  // 更新信号值的函数
  signal.update = (updater: Updater<T>) => {
    state.value = updater(state.value);
  };

  // 变更信号值的函数
  signal.mutate = (mutator: Mutator<T>) => {
    mutator(state.value);
    triggerRef(state);
  };

  // 获取信号引用的函数
  signal.getRef = () => state as Readonly<ShallowRef<Readonly<T>>>;

  return signal;
}
