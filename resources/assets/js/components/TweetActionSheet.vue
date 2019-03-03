<template>
  <q-action-sheet
    v-model="localActive"
    :actions="[
      {
        label: `@${status.user.screen_name}のホームを表示する`,
        icon: 'person',
        handler: jumpUserHome,
      },
      {
        label: 'このツイートを表示する',
        icon: 'message',
        handler: jumpTweetDetail,
      },
    ]"
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
  watch: {
    active (newValue) {
      this.localActive = newValue
    },
  },
  methods: {
    jumpUserHome () {
      open(`https://twitter.com/${this.status.user.screen_name}`, '_blank')
    },
    jumpTweetDetail () {
      open(`https://twitter.com/${this.status.user.screen_name}/status/${this.status.id_str}`, '_blank')
    },
  },
}
</script>
