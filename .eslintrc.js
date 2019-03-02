module.exports = {
  env: {
    es6: true,
  },
  extends: [
    'standard',
    'plugin:vue/recommended',
  ],
  plugins: ['vue'],
  parserOptions: {
    // 「sourceType: 'module'」にしないと、imoportがエラーになる
    // デフォだとWebpackとか使っていない環境向けになってるとか多分そういうあれ
    // https://eslint.org/docs/user-guide/configuring
    sourceType: 'module',
  },
  rules: {
    // ケツカンマは複数行で必ずついていて欲しい
    'comma-dangle': ['error', 'always-multiline'],

    // if文等で中括弧を必須にして、必ず中括弧後は改行するように
    'curly': ['error', 'all'],
    'brace-style': [
      'error',
      '1tbs',
      {
        'allowSingleLine': false
      },
    ],
  },
}
