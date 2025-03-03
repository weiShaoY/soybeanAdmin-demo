import { computed } from 'vue';
import { useCountDown, useLoading } from '@sa/hooks';
import { $t } from '@/locales';
import { REG_PHONE } from '@/constants/reg';

/**
 * 自定义验证码 Hook
 *
 * @returns {object} 包含验证码相关方法和状态的对象
 */
export function useCaptcha() {
  const { loading, startLoading, endLoading } = useLoading();
  const { count, start, stop, isCounting } = useCountDown(10);

  /**
   * 计算验证码按钮的文本
   *
   * @returns {string} 验证码按钮的文本
   */
  const label = computed(() => {
    let text = $t('page.login.codeLogin.getCode');

    const countingLabel = $t('page.login.codeLogin.reGetCode', { time: count.value });

    if (loading.value) {
      text = '';
    }

    if (isCounting.value) {
      text = countingLabel;
    }

    return text;
  });

  /**
   * 检查手机号是否有效
   *
   * @param {string} phone 手机号
   * @returns {boolean} 如果手机号有效，返回 true，否则返回 false
   */
  function isPhoneValid(phone: string): boolean {
    if (phone.trim() === '') {
      window.$message?.error?.($t('form.phone.required'));

      return false;
    }

    if (!REG_PHONE.test(phone)) {
      window.$message?.error?.($t('form.phone.invalid'));

      return false;
    }

    return true;
  }

  /**
   * 获取验证码
   *
   * @param {string} phone 手机号
   * @returns {Promise<void>}
   */
  async function getCaptcha(phone: string): Promise<void> {
    const valid = isPhoneValid(phone);

    if (!valid || loading.value) {
      return;
    }

    startLoading();

    // 模拟请求
    await new Promise(resolve => {
      setTimeout(resolve, 500);
    });

    window.$message?.success?.($t('page.login.codeLogin.sendCodeSuccess'));

    start();

    endLoading();
  }

  return {
    label,
    start,
    stop,
    isCounting,
    loading,
    getCaptcha
  };
}
