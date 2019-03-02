<template>
  <q-page>
    <div
      class="ImageViewer"
    >
      <div class="ImageViewer_overlay" />
      <template v-if="status !== undefined">
        <TweetImages
          v-touch-swipe.vertical="historyBack"
          v-touch-hold="() => showActionSheet = true"
          :images="images"
          :show-arrow="showArrow"
          :index="Number($route.params.index)"
          @click.native="showInfo = !showInfo"
        />
        <div
          v-show="showInfo"
          class="ImageViewer_status"
        >
          <Status
            :status="status"
          />
        </div>
      </template>
    </div>
    <TweetActionSheet
      :active="showActionSheet"
      :status="status"
      @hide="showActionSheet = false"
    />
  </q-page>
</template>

<script>
import Status from '@/components/Status'
import TweetImages from '@/components/TweetImages'
import TweetActionSheet from '@/components/TweetActionSheet'

export default {
  name: 'ImagePage',
  components: {
    Status,
    TweetImages,
    TweetActionSheet,
  },
  data () {
    return {
      showInfo: true,
      showActionSheet: false,
    }
  },
  computed: {
    status () {
      return this.$store.getters.statusFromList(
        this.$route.params.id,
        this.$route.params.status_id
      )
    },
    images () {
      if (this.status === undefined ||
          this.status.extended_entities === undefined ||
          this.status.extended_entities.media === undefined
      ) {
        return []
      }
      return this.status.extended_entities.media.map(image => {
        return { url: image.media_url_https }
      })
    },
    showArrow () {
      if (this.$q.screen.lt.lg) return false

      return this.showInfo
    },
  },
  methods: {
    historyBack () {
      window.history.back()
    },
  },
}
</script>

<style lang="scss" scoped>
.ImageViewer {
  width: 100%;
  height: calc(100vh - 50px);
}
.ImageViewer_overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  background: #000;
}
.ImageViewer_status {
  position: absolute;
  left: 0; right: 0;
  bottom: 0;

  text-align: center;
  background: rgba(#000, .8);

  padding: 20px 10px;
}
</style>
