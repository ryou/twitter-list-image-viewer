<template>
  <router-view />
</template>

<script>
import ErrorDialogsMixin from '@/mixins/ErrorDialogs'

export default {
  name: 'ListPage',
  mixins: [ ErrorDialogsMixin ],
  created () {
    if (this.$store.getters.statusesOfList(this.$route.params.id).length > 0) return
    this.$q.loading.show()

    this.$store.dispatch('fetchStatuses', this.$route.params.id)
      .then(res => {
        this.$q.loading.hide()

        window.scrollTo({ top: 0 })
      })
      .catch(error => {
        if (error.response.status === 401) this.showLoginDialog()
        else this.showErrorDialog(error)
      })
  },
}
</script>
