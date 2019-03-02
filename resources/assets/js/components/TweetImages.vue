<template>
  <div
    ref="wrapper"
    class="TweetImages"
  >
    <div
      ref="scroller"
      class="TweetImages_images"
    >
      <div
        v-for="image in images"
        :key="image.url"
        class="TweetImages_image"
      >
        <img :src="image.url">
      </div>
    </div>
    <div
      v-if="showArrow"
      class="TweetImages_arrows"
    >
      <div
        v-show="existPrevImage"
        class="TweetImages_arrow -prev"
        @click="prevSlide"
      >
        <q-icon name="chevron_left" />
      </div>
      <div
        v-show="existNextImage"
        class="TweetImages_arrow -next"
        @click="nextSlide"
      >
        <q-icon name="chevron_right" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TweetImages',
  props: {
    images: {
      type: Array,
      default () {
        return []
      },
    },
    showArrow: {
      type: Boolean,
      default: true,
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  data () {
    return {
      currentIndex: 0,
    }
  },
  computed: {
    existPrevImage () {
      return this.currentIndex > 0
    },
    existNextImage () {
      return this.currentIndex < (this.images.length - 1)
    },
  },
  created () {
    this.currentIndex = this.index
  },
  mounted () {
    this.slideTo(this.currentIndex)
  },
  methods: {
    slideTo (index, isSmooth = false) {
      const width = this.$refs.wrapper.clientWidth
      this.$refs.scroller.scrollTo({
        left: width * index,
        behavior: (isSmooth) ? 'smooth' : 'auto',
      })
    },
    prevSlide () {
      if (!this.existPrevImage) {
        return
      }

      this.currentIndex--
      this.slideTo(this.currentIndex, true)
    },
    nextSlide () {
      if (!this.existNextImage) {
        return
      }

      this.currentIndex++
      this.slideTo(this.currentIndex, true)
    },
  },
}
</script>

<style lang="scss" scoped>
.TweetImages_images {
  overflow-x: auto;
  overflow-y: hidden;

  position: relative;

  display: flex;

  height: calc(100vh - 50px);

  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
}
.TweetImages_image {
  flex-shrink: 0;
  flex-grow: 0;
  flex-basis: 100%;

  height: calc(100vh - 50px);

  scroll-snap-align: center;

  img {
    vertical-align: top;
    object-fit: contain;

    width: 100%;
    height: 100%;
  }
}
.TweetImages_arrows {
  position: absolute;
  left: 0; right: 0;
  top: 50%;
  height: 0;

  color: #fff;
}
.TweetImages_arrow {
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
</style>
