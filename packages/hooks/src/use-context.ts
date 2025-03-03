import { inject, provide } from 'vue';
import type { InjectionKey } from 'vue';

/**
 * 使用上下文提供和注入功能
 *
 * @example
 *   ```ts
 *   // 有三个 Vue 文件：A.vue, B.vue, C.vue，A.vue 是 B.vue 和 C.vue 的父组件
 *
 *   // context.ts
 *   import { ref } from 'vue';
 *   import { useContext } from '@sa/hooks';
 *
 *   export const { setupStore, useStore } = useContext('demo', () => {
 *     const count = ref(0);
 *
 *     function increment() {
 *       count.value++;
 *     }
 *
 *     function decrement() {
 *       count.value--;
 *     }
 *
 *     return {
 *       count,
 *       increment,
 *       decrement
 *     };
 *   })
 *   ``` // A.vue
 *   ```vue
 *   <template>
 *     <div>A</div>
 *   </template>
 *   <script setup lang="ts">
 *   import { setupStore } from './context';
 *
 *   setupStore();
 *   // const { increment } = setupStore(); // 父组件也可以控制 store
 *   </script>
 *   ``` // B.vue
 *   ```vue
 *   <template>
 *    <div>B</div>
 *   </template>
 *   <script setup lang="ts">
 *   import { useStore } from './context';
 *
 *   const { count, increment } = useStore();
 *   </script>
 *   ```;
 *
 *   // C.vue is same as B.vue
 *
 * @param contextName 上下文名称
 * @param fn 上下文函数
 */
export default function useContext<T extends (...args: any[]) => any>(contextName: string, fn: T) {
  type Context = ReturnType<T>;

  // 创建上下文时获取提供和注入方法
  const { useProvide, useInject: useStore } = createContext<Context>(contextName);

  function setupStore(...args: Parameters<T>) {
    const context: Context = fn(...args);
    return useProvide(context);
  }

  return {
    /** 在父组件中设置 store */
    setupStore,
    /** 在子组件中使用 store */
    useStore
  };
}

/** 创建上下文 */
function createContext<T>(contextName: string) {
  const injectKey: InjectionKey<T> = Symbol(contextName);

  /**
   * 提供上下文给后代组件
   *
   * @param context 上下文数据
   */
  function useProvide(context: T) {
    provide(injectKey, context);

    return context;
  }

  /** 注入上下文到当前组件 */
  function useInject() {
    return inject(injectKey) as T;
  }

  return {
    useProvide,
    useInject
  };
}
