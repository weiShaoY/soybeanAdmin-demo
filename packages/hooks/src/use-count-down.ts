import { useRafFn } from '@vueuse/core';

import { type ComputedRef, computed, onScopeDispose, ref } from 'vue';

/** 倒计时 Hook 返回类型 */
type UseCountDownReturn = {
  /** 剩余的秒数 */
  count: ComputedRef<number>;
  /** 是否正在倒计时 */
  isCounting: ComputedRef<boolean>;
  /** 开始倒计时 */
  start: (updateSeconds?: number) => void;
  /** 停止倒计时 */
  stop: () => void;
};

/**
 * 倒计时功能
 *
 * @param seconds - 倒计时的秒数
 */
export default function useCountDown(seconds: number): UseCountDownReturn {
  /** 每秒的帧数 */
  const FPS_PER_SECOND = 60;

  /** 当前帧数 */
  const fps = ref(0);

  /** 剩余的秒数 */
  const count = computed(() => Math.ceil(fps.value / FPS_PER_SECOND));

  /** 是否正在倒计时 */
  const isCounting = computed(() => fps.value > 0);

  // 使用 requestAnimationFrame 实现定时更新
  const { pause, resume } = useRafFn(
    () => {
      if (fps.value > 0) {
        fps.value -= 1; // 每帧减少一帧数
      } else {
        pause(); // 如果倒计时结束，暂停计时
      }
    },
    {
      immediate: false // 初始时不立即执行
    }
  );

  /**
   * 开始倒计时
   *
   * @param updateSeconds - 可选的自定义倒计时秒数，默认为传入的 seconds
   */
  function start(updateSeconds: number = seconds) {
    fps.value = FPS_PER_SECOND * updateSeconds; // 根据秒数设置帧数

    // 开始倒计时
    resume();
  }

  /** 停止倒计时 */
  function stop() {
    fps.value = 0; // 重置帧数
    pause(); // 停止倒计时
  }

  // 在作用域销毁时清除定时器
  onScopeDispose(() => {
    pause();
  });

  return {
    count,
    isCounting,
    start,
    stop
  };
}
