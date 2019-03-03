<template>
  <transition
    mode="out-in"
    :enter-active-class="transition.enterActiveClass"
    @after-leave="$root.$emit('triggerScroll')"
  >
    <keep-alive include="HomePage,ListPage">
      <router-view />
    </keep-alive>
  </transition>
</template>

<script>
import ErrorDialogsMixin from '@/mixins/ErrorDialogs'

export default {
  mixins: [ ErrorDialogsMixin ],
  data () {
    return {
      transition: {
        enterActiveClass: '',
        leaveActiveClass: '',
      },
    }
  },
  watch: {
    '$route' (to, from) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      this.transition.enterActiveClass = toDepth < fromDepth ? 'animated fadeInLeft' : 'animated fadeInRight'
      this.transition.leaveActiveClass = toDepth < fromDepth ? 'animated fadeOutRight' : 'animated fadeOutLeft'
    },
  },
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
  animation-duration: .15s;
}
</style>
