import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import vue from 'eslint-plugin-vue/lib/configs/vue3-recommended.js'

export default [
  js.configs.recommended,
  eslintConfigPrettier,
  {
    files: ['**/*.vue'],
    ...vue,
    rules: {
      'no-unused-vars': 'warn',
      'vue/no-unused-components': 'warn',
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
      'vue/no-v-html': 'off'
    }
  },
  {
    files: ['**/*.js'],
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-unused-vars': 'warn'
    }
  }
]