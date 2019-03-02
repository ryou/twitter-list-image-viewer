<template>
  <q-layout view="hHh Lpr lFf">
    <q-layout-header v-if="$route.meta.header !== undefined">
      <q-toolbar color="primary">
        <q-btn
          v-if="$route.meta.header.back === true"
          flat
          round
          dense
          icon="arrow_back"
          @click="historyBack"
        />
        <q-toolbar-title>{{ $route.meta.header.title }}</q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-page-container>
      <transition
        mode="out-in"
        :enter-active-class="transition.enterActiveClass"
        :leave-active-class="transition.leaveActiveClass"
        @after-leave="$root.$emit('triggerScroll')"
      >
        <keep-alive include="HomePage,ListPage">
          <router-view />
        </keep-alive>
      </transition>
    </q-page-container>
  </q-layout>
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
  },
  methods: {
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
