module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
  rules: {
    // 声明前允许空一行
    'declaration-empty-line-before': null,

    // 允许选择器之后， 覆盖选择器的低特异性更高的特异性
    'no-descending-specificity': null,

    // 允许未知的伪类选择器
    'selector-pseudo-class-no-unknown': null,

    // 不区分伪元素使用特定的单、双引号
    'selector-pseudo-element-colon-notation': null,

    // 允许空的less文件
    'no-empty-source': null,

    // 允许重复的选择器
    'no-duplicate-selectors': null,

    // 允许字体缺少通用系列
    'font-family-no-missing-generic-family-keyword': null,

    // 允许未知的媒体功能的名字
    'media-feature-name-no-unknown': null,

    // 允许单位零长度
    'length-zero-no-unit': null,
  },
};
