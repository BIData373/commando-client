/** @type {import("stylelint").Config} */
export default {
  ignoreFiles: ['node_modules/**/*'],
  plugins: [
    'stylelint-order'
  ],
  extends: [
    'stylelint-config-rational-order'
  ],
  customSyntax: 'postcss-styled-syntax'
};
