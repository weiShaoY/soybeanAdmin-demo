import { defineConfig } from "@soybeanjs/eslint-config";

export default defineConfig(
  { vue: true, unocss: true },
  {
    rules: {
      "vue/multi-word-component-names": [
        "warn",
        {
          ignores: ["index", "App", "Register", "[id]", "[url]"],
        },
      ],
      "vue/component-name-in-template-casing": [
        "warn",
        "PascalCase",
        {
          registeredComponentsOnly: false,
          ignores: ["/^icon-/"],
        },
      ],
      "unocss/order-attributify": "off",

      // /////////////////////////  自定义规则 /////////////////////////
      // 强制使用 type 定义对象类型
      "@typescript-eslint/consistent-type-definitions": ["warn", "type"],

      // 强制链式调用在每次调用后换行
      "newline-per-chained-call": "warn",

      // 强制将对象属性放在单独的行上
      "object-property-newline": "warn",

      // 强制在开括号后和闭括号前使用一致的换行符
      "object-curly-newline": [
        "warn",
        {
          ImportDeclaration: { multiline: true, minProperties: 3 },
          ExportDeclaration: { multiline: true, minProperties: 1 },
          ObjectExpression: "always",
          ObjectPattern: { multiline: true },
        },
      ],

      // 强制使用一致的换行风格
      curly: "warn",

      // 行注释位置
      // 'line-comment-position': ['warn', { position: 'above' }],

      // 强制在注释中 // 或 /* 使用一致的空行
      "lines-around-comment": [
        "warn",
        {
          beforeBlockComment: true,
          beforeLineComment: true,
          allowBlockStart: true,
          allowObjectStart: true,
          allowArrayStart: true,
          ignorePattern:
            "eslint|jshint|jslint|istanbul|global|exported|jscs|组件|弹窗",
        },
      ],

      // 在特定语句之前和之后添加空行
      "padding-line-between-statements": [
        "warn",
        {
          blankLine: "always",
          prev: [
            "const",
            "let",
            "var",
            "block",
            "block-like",
            "import",
            "export",
            "class",
            "try",
            "return",
          ],
          next: "*",
        },
      ],

      // 强制所有的对象类型定义使用 type
      "ts/consistent-type-definitions": ["warn", "type"],

      // 在注释中的 // 或 /*后面强制保持一致的间距
      "spaced-comment": [
        "warn",
        "always",
        {
          markers: ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"],
        },
      ],

      // 要求三元表达式始终使用多行格式，除了在 JSX 中忽略此规则
      "style/multiline-ternary": [
        "warn",
        "always-multiline",
        { ignoreJSX: true },
      ],

      // 限制每行的最大语句数
      "max-statements-per-line": [
        "warn",
        {
          max: 1,
        },
      ],
    },
  },
);
