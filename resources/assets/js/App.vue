<template>
  <keep-alive include="HomePage,ListPage">
    <router-view />
  </keep-alive>
</template>

<script>
import ErrorDialogsMixin from '@/mixins/ErrorDialogs'

export default {
  mixins: [ ErrorDialogsMixin ],
  created () {
    if (this.$store.state.user !== null && this.$store.state.lists.length > 0) {
      return
    }

    this.$q.loading.show()

    const verifyPromise = this.$store.dispatch('fetchUserInfo')
    const listPromise = this.$store.dispatch('fetchLists')

    Promise.all([verifyPromise, listPromise])
      .then(() => {
        this.$q.loading.hide()
      })
      .catch(error => {
        if (error.response.status === 401) {
          this.showLoginDialog()
        } else {
          this.showErrorDialog(error)
        }
      })

    // ページがバックグラウンドから戻ってきた際に、認証が切れていないか確認
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.confirmAuthentication()
      }
    })
  },
  methods: {
    confirmAuthentication () {
      this.$q.loading.show()
      this.$store.dispatch('fetchUserInfo')
        .then(() => {
          this.$q.loading.hide()
        })
        .catch(error => {
          if (error.response.status === 401) {
            this.showLoginDialog()
          } else {
            this.showErrorDialog(error)
          }
        })
    },
    historyBack () {
      window.history.back()
    },
  },
}
</script>

<style lang="scss">
body {
  overscroll-behavior: contain;
  word-break: break-all;
}

.animated {
  animation-duration: .2s;
}
</style>
