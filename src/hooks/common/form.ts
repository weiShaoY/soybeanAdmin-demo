import { ref, toValue } from 'vue';
import type { ComputedRef, Ref } from 'vue';
import type { FormInstance } from 'element-plus';
import { REG_CODE_SIX, REG_EMAIL, REG_PHONE, REG_PWD, REG_USER_NAME } from '@/constants/reg';

/**
 * 使用表单规则
 *
 * @returns {object} 包含表单规则和创建规则的方法
 */
export function useFormRules() {
  /** 模式规则 */
  const patternRules = {
    userName: {
      pattern: REG_USER_NAME,
      message: '用户名格式不正确',
      trigger: 'change'
    },
    phone: {
      pattern: REG_PHONE,
      message: '手机号格式不正确',
      trigger: 'change'
    },
    pwd: {
      pattern: REG_PWD,
      message: '密码格式不正确，6-18位字符，包含字母、数字、下划线',
      trigger: 'change'
    },
    code: {
      pattern: REG_CODE_SIX,
      message: '验证码格式不正确',
      trigger: 'change'
    },
    email: {
      pattern: REG_EMAIL,
      message: '邮箱格式不正确',
      trigger: 'change'
    }
  } satisfies Record<string, App.Global.FormRule>;

  /** 表单规则 */
  const formRules = {
    userName: [createRequiredRule('请输入用户名'), patternRules.userName],
    phone: [createRequiredRule('请输入手机号'), patternRules.phone],
    pwd: [createRequiredRule('请输入密码'), patternRules.pwd],
    code: [createRequiredRule('请输入验证码'), patternRules.code],
    email: [createRequiredRule('请输入邮箱'), patternRules.email]
  } satisfies Record<string, App.Global.FormRule[]>;

  /** 默认必填规则 */
  const defaultRequiredRule = createRequiredRule('不能为空');

  /**
   * 创建必填规则
   *
   * @param {string} message 提示信息
   * @returns {App.Global.FormRule} 必填规则
   */
  function createRequiredRule(message: string): App.Global.FormRule {
    return {
      required: true,
      message
    };
  }

  /**
   * 创建确认密码规则
   *
   * @param {string | Ref<string> | ComputedRef<string>} pwd 密码
   * @returns {App.Global.FormRule[]} 确认密码规则
   */
  function createConfirmPwdRule(pwd: string | Ref<string> | ComputedRef<string>): App.Global.FormRule[] {
    const confirmPwdRule: App.Global.FormRule[] = [
      { required: true, message: '请输入确认密码' },
      {
        asyncValidator: (rule, value) => {
          if (value.trim() !== '' && value !== toValue(pwd)) {
            return Promise.reject(rule.message);
          }
          return Promise.resolve();
        },
        message: ('两次输入的密码不一致'),
        trigger: 'input'
      }
    ];
    return confirmPwdRule;
  }

  return {
    patternRules,
    formRules,
    defaultRequiredRule,
    createRequiredRule,
    createConfirmPwdRule
  };
}

/**
 * 使用表单
 *
 * @returns {object} 包含表单引用和验证方法
 */
export function useForm() {
  /** 表单引用 */
  const formRef = ref<FormInstance | null>(null);

  /**
   * 验证表单
   *
   * @returns {Promise<void>}
   */
  async function validate(): Promise<void> {
    await formRef.value?.validate();
  }

  /** 恢复表单验证 */
  async function restoreValidation(): Promise<void> {
    formRef.value?.resetFields();
  }

  return {
    formRef,
    validate,
    restoreValidation
  };
}
