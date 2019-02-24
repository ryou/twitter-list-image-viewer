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
      <keep-alive include="HomePage">
        <router-view />
      </keep-alive>
    </q-page-container>
  </q-layout>
</template>

<script>
import ErrorDialogsMixin from '@/mixins/ErrorDialogs'

export default {
  mixins: [ ErrorDialogsMixin ],
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
}
</style>
