<template>
  <div
    class="ImageViewer"
    :class="{ '-visible': visible }"
  >
    <div class="ImageViewer_overlay" />
    <template v-if="status !== null">
      <div
        ref="scroller"
        v-touch-swipe.vertical="imagesSwiped"
        class="ImageViewer_images"
      >
        <div
          v-for="image in images"
          :key="image.id_str"
          class="ImageViewer_image"
          @click="$emit('hide')"
        >
          <img
            :src="image.media_url_https"
            @click.stop="showInfo = !showInfo"
          >
        </div>
      </div>
      <div
        class="ImageViewer_tools"
        :class="{ '-visible': showInfo }"
      >
        <div
          class="ImageViewer_close"
          @click="$emit('hide')"
        >
          <q-icon name="close" />
        </div>
        <div
          v-if="showArrow"
          class="ImageViewer_arrows"
        >
          <div
            v-show="existPrevImage"
            class="ImageViewer_arrow -prev"
            @click="prevSlide"
          >
            <q-icon name="chevron_left" />
          </div>
          <div
            v-show="existNextImage"
            class="ImageViewer_arrow -next"
            @click="nextSlide"
          >
            <q-icon name="chevron_right" />
          </div>
        </div>
        <div class="ImageViewer_status">
          <div class="Status">
            <div class="Status_content">
              <div
                v-if="status.retweeted_status !== undefined"
                class="Status_row"
              >
                <div class="Status_leftCol">
                  <q-icon
                    class="text-positive"
                    name="repeat"
                  />
                </div>
                <div class="Status_rightCol">
                  <div class="Status_retweet q-caption">
                    <a
                      :href="`https://twitter.com/${status.user.screen_name}`"
                      target="_blank"
                    >{{ status.user.name }}</a>さんがリツイートしました
                  </div>
                </div>
              </div>
              <div class="Status_row">
                <div class="Status_leftCol">
                  <div class="Status_profileImage">
                    <img :src="tweet.user.profile_image_url_https">
                  </div>
                </div>
                <div class="Status_rightCol">
                  <div class="Status_info">
                    <a
                      :href="`https://twitter.com/${tweet.user.screen_name}`"
                      target="_blank"
                      class="Status_name"
                    >{{ tweet.user.name }}</a>
                    <a
                      :href="`https://twitter.com/${tweet.user.screen_name}`"
                      target="_blank"
                      class="Status_screenName"
                    >@{{ tweet.user.screen_name }}</a>・
                    <a
                      :href="`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`"
                      target="_blank"
                      class="Status_created"
                    >1/23 14:00</a>
                  </div>
                  <div class="Status_body">
                    {{ tweet.text }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ImageViewer',
  props: {
    index: {
      type: Number,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    },
    status: {
      type: Object,
      default: null,
    },
  },
  data () {
    return {
      currentIndex: 0,
      showInfo: true,
    }
  },
  computed: {
    existPrevImage () {
      return this.currentIndex > 0
    },
    existNextImage () {
      return this.currentIndex < (this.images.length - 1)
    },
    showArrow () {
      if (this.$q.screen.lt.lg) return false

      return this.showInfo
    },
    tweet () {
      if (this.status.retweeted_status !== undefined) return this.status.retweeted_status

      return this.status
    },
    images () {
      return this.status.extended_entities.media
    },
  },
  watch: {
    visible (visibility) {
      if (visibility === true) this.onShow()
      else this.onHide()
    },
  },
  methods: {
    imagesSwiped () {
      this.$emit('hide')
    },
    onShow () {
      this.currentIndex = this.index
      this.slideTo(this.currentIndex)
    },
    onHide () {
      this.showInfo = true
    },
    slideTo (index, isSmooth = false) {
      const width = window.innerWidth
      this.$refs.scroller.scrollTo({
        left: width * index,
        behavior: (isSmooth) ? 'smooth' : 'auto',
      })
    },
    prevSlide () {
      if (!this.existPrevImage) return

      this.currentIndex--
      this.slideTo(this.currentIndex, true)
    },
    nextSlide () {
      if (!this.existNextImage) return

      this.currentIndex++
      this.slideTo(this.currentIndex, true)
    },
  },
}
</script>

<style lang="scss" scoped>
.ImageViewer {
  position: fixed;
  z-index: 100000;
  top: 0; bottom: 0;
  left: 0; right: 0;

  transition: opacity .2s;

  &:not(.-visible) {
    opacity: 0;
    pointer-events: none;
  }
}
.ImageViewer_overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  background: #000;
}
.ImageViewer_images {
  overflow-x: auto;
  overflow-y: hidden;

  position: relative;

  display: flex;

  height: 100vh;

  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
}
.ImageViewer_image {
  flex-shrink: 0;
  flex-grow: 0;
  flex-basis: 100%;

  height: 100vh;

  scroll-snap-align: center;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
    vertical-align: top;
    object-fit: contain;

    max-width: 100%;
    max-height: 100%;
  }
}
.ImageViewer_tools {
  transition: opacity .2s;

  &:not(.-visible) {
    opacity: 0;
    pointer-events: none;
  }
}
.ImageViewer_close {
  position: absolute;
  top: 0;
  right: 0;

  padding: 15px;

  font-size: 24px;
  color: #fff;
  background: rgba(#000, .8);

  cursor: pointer;
}
.ImageViewer_arrows {
  position: absolute;
  left: 0; right: 0;
  top: 50%;
  height: 0;

  color: #fff;
}
.ImageViewer_arrow {
  position: absolute;
  top: -20px;

  background-color: rgba(#000, .8);
  text-align: center;
  font-size: 30px;

  width: 40px; height: 40px;
  border-radius: 9999px;

  cursor: pointer;

  &.-prev {
    left: 20px;
  }
  &.-next {
    right: 20px;
  }
}
.ImageViewer_status {
  position: absolute;
  left: 0; right: 0;
  bottom: 0;

  text-align: center;
  background: rgba(#000, .8);

  padding: 20px 10px;
}
.Status {
  display: inline-block;
  vertical-align: top;

  text-align: left;
  color: #fff;

  width: 100%;
  max-width: 600px;

  a {
    color: #fff;
    text-decoration: none;
  }
}
.Status_row {
  display: flex;

  &:not(:last-child) {
    margin-bottom: 5px;
  }
}
.Status_leftCol {
  flex-shrink: 0;
  flex-grow: 0;
  flex-basis: 35px;

  text-align: right;
}
.Status_rightCol {
  flex-shrink: 1;
  flex-grow: 1;

  padding-left: 10px;
}
.Status_profileImage {
  img {
    vertical-align: top;
    width: 35px; height: 35px;
    object-fit: cover;

    border-radius: 5px;
  }
}
.Status_info {
  line-height: 1.2;

  margin-bottom: 3px;
}
.Status_name {
  font-size: 15px;
  font-weight: bold;
}
.Status_screenName {
  font-size: 12px;
}
.Status_created {
  font-size: 12px;
}
.Status_body {
  font-size: 14px;
}
</style>
