export default {
  methods: {
    showLoginDialog () {
      this.$q.loading.hide()
      this.$q.dialog({
        title: '認証エラー',
        message: 'ログインしますか？',
        ok: 'はい',
        cancel: 'いいえ',
      }).then(() => {
        window.location.href = '/auth/login'
      }).catch(() => {
        //
      })
    },
    showErrorDialog (error) {
      this.$q.loading.hide()
      this.$q.dialog({
        title: String(error.response.status),
        message: error.response.statusText,
      })
    },
  },
}
