<template>
  <keep-alive include="HomePage">
    <router-view />
  </keep-alive>
</template>

<script>
import ErrorDialogsMixin from '@/mixins/ErrorDialogs'

export default {
  mixins: [ ErrorDialogsMixin ],
  data () {
    return {}
  },
  created () {
    if (this.$store.state.user !== null && this.$store.state.lists.length > 0) return

    this.$q.loading.show()

    const verifyPromise = this.$store.dispatch('fetchUserInfo')
    const listPromise = this.$store.dispatch('fetchLists')

    Promise.all([verifyPromise, listPromise])
      .then(() => {
        this.$q.loading.hide()
      })
      .catch(error => {
        if (error.response.status === 401) this.showLoginDialog()
        else this.showErrorDialog(error)
      })
  },
}
</script>

<style lang="scss">
body {
  overscroll-behavior: contain;
}
</style>
