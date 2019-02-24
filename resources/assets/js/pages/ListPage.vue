<template>
  <router-view />
</template>

<script>
import store from '@/store'
import { Loading } from 'quasar-framework/dist/quasar.mat.esm'
import ErrorDialogsMixin from '@/mixins/ErrorDialogs'

export default {
  name: 'ListPage',
  mixins: [ ErrorDialogsMixin ],
  beforeRouteEnter (route, redirect, next) {
    if (store.getters.statusesOfList(route.params.id).length > 0) {
      next()
      return
    }
    Loading.show()

    store.dispatch('fetchStatuses', route.params.id)
      .then(res => {
        Loading.hide()

        next()
      })
      .catch(error => {
        if (error.response.status === 401) this.showLoginDialog()
        else this.showErrorDialog(error)
      })
  },
}
</script>
