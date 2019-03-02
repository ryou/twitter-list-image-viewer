<template>
  <q-action-sheet
    v-model="localActive"
    :actions="actions"
    @hide="$emit('hide')"
  />
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      required: true,
    },
    status: {
      type: Object,
      required: true,
    },
  },
  data () {
    return {
      localActive: false,
    }
  },
  computed: {
    actions () {
      const outActions = []

      if (this.status.favorited) {
        outActions.push({
          label: 'UnFavorite',
          icon: 'favorite_border',
          color: 'gray',
          handler: this.unFavorite,
        })
      } else {
        outActions.push({
          label: 'Favorite',
          icon: 'favorite',
          color: 'red',
          handler: this.favorite,
        })
      }

      if (this.status.retweeted) {
        outActions.push({
          label: 'UnRetweet',
          icon: 'repeat',
          color: 'gray',
          handler: this.unRetweet,
        })
      } else {
        outActions.push({
          label: 'Retweet',
          icon: 'repeat',
          color: 'green',
          handler: this.retweet,
        })
      }

      outActions.push({
        label: 'Show original image',
        icon: 'photo_library',
        color: 'blue',
        handler: this.showOriginalImage,
      })

      return outActions
    },
  },
  watch: {
    active (newValue) {
      this.localActive = newValue
    },
  },
  methods: {
    favorite () {
      this.$store.dispatch('favorite', this.status.id_str)
        .then(() => {
          this.$q.notify({
            type: 'positive',
            message: 'favorite',
          })
        })
    },
    unFavorite () {
      this.$store.dispatch('unFavorite', this.status.id_str)
        .then(() => {
          this.$q.notify({
            type: 'negative',
            message: 'unfavorite',
          })
        })
    },
    retweet () {
      this.$store.dispatch('retweet', this.status.id_str)
        .then(() => {
          this.$q.notify({
            type: 'positive',
            message: 'retweet',
          })
        })
    },
    unRetweet () {
      this.$store.dispatch('unRetweet', this.status.id_str)
        .then(() => {
          this.$q.notify({
            type: 'negative',
            message: 'unretweet',
          })
        })
    },
    showOriginalImage () {

    },
  },
}
</script>
