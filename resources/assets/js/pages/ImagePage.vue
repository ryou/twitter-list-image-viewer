<template>
  <q-layout view="hHh Lpr lFf">
    <transition
      enter-active-class="animated fadeInDown"
      leave-active-class="animated fadeOutUp"
    >
      <q-layout-header
        v-show="showInfo"
        class="no-shadow"
      >
        <q-toolbar
          color="transparent"
        >
          <q-btn
            flat
            round
            dense
            icon="arrow_back"
            @click="historyBack"
          />
          <q-toolbar-title />
        </q-toolbar>
      </q-layout-header>
    </transition>

    <q-page-container style="padding-top: 0;">
      <q-page style="height: 100vh;">
        <div
          class="ImageViewer"
        >
          <div class="ImageViewer_overlay" />
          <template v-if="status !== undefined">
            <TweetImages
              v-touch-hold="() => showActionSheet = true"
              :images="images"
              :show-arrow="showArrow"
              :index="Number($route.params.index)"
              @click.native="showInfo = !showInfo"
            />
            <transition
              enter-active-class="animated fadeInUp"
              leave-active-class="animated fadeOutDown"
            >
              <div
                v-show="showInfo"
                class="ImageViewer_status"
              >
                <Status
                  :status="status"
                />
              </div>
            </transition>
          </template>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import Status from '@/components/Status'
import TweetImages from '@/components/TweetImages'

export default {
  name: 'ImagePage',
  components: {
    Status,
    TweetImages,
  },
  data () {
    return {
      showInfo: true,
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
      if (this.$q.screen.lt.lg) {
        return false
      }

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

  padding: 20px 10px 10px;

  // 「！」や「？」が連続で大量に入っているツイートだと、
  // なぜか改行されないので暫定対策
  overflow: hidden;
}
</style>
