<template>
  <!-- main wrapping component -->
  <q-layout>
    <q-layout-header reveal>
      <q-toolbar color="primary">
        <q-btn
          flat
          round
          dense
          icon="menu"
          @click="drawer = !drawer"
        />
        <q-toolbar-title>Twitter List Image Viewer</q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="drawer"
      content-class="bg-grey-3"
      side="left"
    >
      <q-list no-border>
        <q-item v-if="user !== null">
          <q-item-side>
            <q-item-tile avatar>
              <img
                :src="user.profile_image_url_https"
              >
            </q-item-tile>
          </q-item-side>
          <q-item-main :label="user.name" />
        </q-item>
        <q-item-separator />
        <q-list-header>Lists</q-list-header>
        <q-item
          v-for="list in lists"
          :key="list.id_str"
          link
          :class="{ active: currentListId === list.id_str }"
          @click.native="selectList(list.id_str)"
        >
          <q-item-main :label="list.name" />
        </q-item>
        <q-item-separator />
        <q-list-header>Settings</q-list-header>
        <q-item tag="label">
          <q-item-main>
            <q-item-tile label>
              Show retweets
            </q-item-tile>
          </q-item-main>
          <q-item-side right>
            <q-toggle v-model="showRetweets" />
          </q-item-side>
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <q-pull-to-refresh
        v-if="statuses.length > 0"
        :handler="refresh"
      >
        <q-infinite-scroll :handler="loadMore">
          <div
            class="row"
            no-wrap
          >
            <div
              v-for="image in images"
              :key="image.id_str"
              class="col-4"
            >
              <div
                class="thumb"
                :style="{ 'background-image': `url(${image.media_url_https})` }"
                @click="image.onClick"
              />
            </div>
          </div>

          <div
            slot="message"
            class="text-center"
          >
            <q-spinner-dots
              v-if="canLoadMore"
              :size="40"
            />
          </div>
        </q-infinite-scroll>
      </q-pull-to-refresh>
      <ImageViewer
        :status="imageViewer.status"
        :index="imageViewer.index"
        :visible="imageViewer.visible"
        @hide="imageViewer.visible = false"
      />
    </q-page-container>
  </q-layout>
</template>

<script>
import ImageViewer from '@/components/ImageViewer'
const axios = require('axios')
const _ = require('lodash')

const FETCH_COUNT = 200

export default {
  name: 'App',
  components: {
    ImageViewer,
  },
  data () {
    return {
      user: null,
      currentListId: null,
      lists: [],
      statuses: [],
      showRetweets: false,
      drawer: true,
      canLoadMore: false,
      imageViewer: {
        visible: false,
        status: null,
        index: 0,
      },
    }
  },
  computed: {
    filteredStatuses () {
      let outStatuses = this.statuses

      if (!this.showRetweets) {
        outStatuses = outStatuses.filter(status => status.retweeted_status === undefined)
      }

      return outStatuses
    },
    newestStatusId () {
      return this.statuses[0].id_str
    },
    oldestStatusId () {
      return this.statuses[this.statuses.length - 1].id_str
    },
    images () {
      const outImages = []
      this.filteredStatuses.forEach(status => {
        if (
          status.extended_entities !== undefined &&
          status.extended_entities.media !== undefined
        ) {
          const media = status.extended_entities.media
          media.forEach((item, index) => {
            const itemData = Object.assign(item, {
              onClick: () => this.showImageViewer(status, index),
            })
            outImages.push(itemData)
          })
        }
      })

      return outImages
    },
  },
  mounted () {
    this.$q.loading.show()

    const verifyPromise = axios.get('/api/account/verify_credentials')
      .then(res => {
        this.user = res.data
      })

    const listPromise = axios.get('/api/lists/list')
      .then(res => {
        this.lists = res.data
      })

    Promise.all([verifyPromise, listPromise])
      .then(() => {
        this.drawer = true
        this.$q.loading.hide()
      })
      .catch(error => {
        if (error.response.status === 401) this.showLoginDialog()
      })
  },
  methods: {
    refresh (done) {
      axios.get(`/api/lists/statuses/${this.currentListId}`, { params: { count: FETCH_COUNT, since_id: this.newestStatusId } })
        .then(res => {
          this.statuses = _.unionBy(res.data, this.statuses, 'id_str')
          done()
        })
        .catch(error => {
          if (error.response.status === 401) this.showLoginDialog()
          else this.showErrorDialog()
        })
    },
    loadMore (index, done) {
      if (!this.canLoadMore) {
        done()
        return
      }

      axios.get(`/api/lists/statuses/${this.currentListId}`, { params: { count: FETCH_COUNT, max_id: this.oldestStatusId } })
        .then(res => {
          if (res.data.length < FETCH_COUNT) this.canLoadMore = false
          this.statuses = _.unionBy(this.statuses, res.data, 'id_str')
          done()
        })
        .catch(error => {
          if (error.response.status === 401) this.showLoginDialog()
          else this.showErrorDialog()
        })
    },
    selectList (id) {
      if (this.$q.screen.lt.lg) this.drawer = false

      this.currentListId = id
      this.$q.loading.show()

      axios.get(`/api/lists/statuses/${id}`, { params: { count: FETCH_COUNT } })
        .then(res => {
          this.statuses = res.data
          this.canLoadMore = true
          this.$q.loading.hide()

          window.scrollTo({ top: 0 })
        })
        .catch(error => {
          if (error.response.status === 401) this.showLoginDialog()
          else this.showErrorDialog()
        })
    },
    showImageViewer (status, index) {
      this.imageViewer.index = index
      this.imageViewer.status = status
      // スクロール位置を正常にするために、indexの変更が適用されてからvisibleの変更を行う
      this.$nextTick()
        .then(() => {
          this.imageViewer.visible = true
        })
    },
    showLoginDialog () {
      this.$q.loading.hide()
      this.$q.dialog({
        title: '認証エラー',
        message: 'ログインしますか？',
        ok: 'はい',
        cancel: 'いいえ',
      }).then(() => {
        window.location.href = '/auth/login'
      }).catch(() => {
        //
      })
    },
    showErrorDialog () {
      this.$q.loading.hide()
      this.$q.dialog({
        title: 'エラー',
        message: 'なんかエラー',
      })
    },
  },
}
</script>

<style lang="scss">
* {
  overscroll-behavior: none !important;
}
</style>

<style lang="scss" scoped>
.thumb {
  padding-top: 100%;

  background-size: cover;
  background-position: center center;
}
</style>
