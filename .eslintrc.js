module.exports = {
  root: true, // 标记为根配置文件
  parserOptions: {
    parser: '@babel/eslint-parser', // 使用 babel-eslint 解析 JavaScript
    ecmaVersion: 2021, // 支持最新的 ECMAScript 版本
    sourceType: 'module', // 使用 ES 模块
  },
  env: {
    browser: true, // 启用浏览器环境
    node: true, // 启用 Node.js 环境
    es6: true, // 启用 ES6 全局变量
  },
  extends: [
    'eslint:recommended', // 启用 ESLint 推荐规则
    'plugin:vue/recommended', // 启用 Vue 2 推荐规则
    'plugin:prettier/recommended', // 集成 Prettier
  ],
  plugins: ['vue', 'prettier'], // 启用插件
  rules: {
    'prettier/prettier': 'error', // 将 Prettier 规则作为 ESLint 错误
    'no-unused-vars': 'warn', // 未使用的变量警告
    'no-console': 'off', // 允许使用 console
    'vue/multi-word-component-names': 'off', // 禁用强制多词组件命名规则
    semi: ['error', 'always'], // 强制使用分号
    quotes: ['error', 'single'], // 强制使用单引号
  },
};
