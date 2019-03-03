<template>
  <q-layout view="hHh Lpr lFf">
    <q-layout-header>
      <q-toolbar color="primary">
        <q-btn
          flat
          round
          dense
          icon="arrow_back"
          @click="historyBack"
        />
        <q-toolbar-title>{{ list.name }}</q-toolbar-title>
        <q-btn
          flat
          round
          dense
          icon="settings"
          @click="launchActionSheet"
        />
      </q-toolbar>
    </q-layout-header>

    <q-page-container>
      <q-page>
        <q-pull-to-refresh
          v-if="statuses.length > 0"
          :handler="refresh"
          :distance="5"
        >
          <q-infinite-scroll
            ref="infiniteScroll"
            :handler="loadMore"
          >
            <div
              class="row"
              no-wrap
            >
              <div
                v-for="image in images"
                :key="image.id_str"
                class="col-3 col-xl-2"
              >
                <router-link
                  tag="div"
                  class="thumb"
                  :style="{ 'background-image': `url(${image.media_url_https}:thumb)` }"
                  :to="{
                    name: 'image',
                    params: {
                      id: $route.params.id,
                      status_id: image.originalStatus.id_str,
                      index: image.originalStatus.index,
                    }
                  }"
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
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import store from '@/store'
import { Loading } from 'quasar-framework/dist/quasar.mat.esm'
import ErrorDialogsMixin from '@/mixins/ErrorDialogs'

export default {
  name: 'ListPage',
  mixins: [ ErrorDialogsMixin ],
  data () {
    return {
      canLoadMore: true,
      showModal: false,
    }
  },
  computed: {
    list () {
      let currentList = this.$store.state.lists.find(list => list.id_str === this.$route.params.id)
      if (currentList === undefined) {
        currentList = { name: '' }
      }
      return currentList
    },
    statuses () {
      return this.$store.getters.statusesOfList(this.$route.params.id)
    },
    filteredStatuses () {
      let outStatuses = this.statuses

      if (!this.list.showRetweets) {
        outStatuses = outStatuses.filter(status => status.retweeted_status === undefined)
      }

      return outStatuses
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
              originalStatus: {
                id_str: status.id_str,
                index,
              },
            })
            outImages.push(itemData)
          })
        }
      })

      return outImages
    },
  },
  methods: {
    refresh (done) {
      this.$store.dispatch('fetchNewStatuses', this.$route.params.id)
        .then(res => {
          done()
        })
        .catch(error => {
          if (error.response.status === 401) {
            this.showLoginDialog()
          } else {
            this.showErrorDialog(error)
          }
        })
    },
    loadMore (index, done) {
      if (!this.canLoadMore) {
        this.$refs.infiniteScroll.stop()
        done()
        return
      }

      const oldLength = this.statuses.length

      this.$store.dispatch('fetchOldStatuses', this.$route.params.id)
        .then(res => {
          const newLength = this.statuses.length
          if (newLength <= oldLength) {
            this.canLoadMore = false
          }
          done()
        })
        .catch(error => {
          if (error.response.status === 401) {
            this.showLoginDialog()
          } else {
            this.showErrorDialog(error)
          }
        })
    },
    historyBack () {
      window.history.back()
    },
    launchActionSheet () {
      const actions = []

      if (this.list.showRetweets) {
        actions.push({
          label: 'リツイートを表示しない',
          icon: 'repeat',
          handler: () => {
            this.$store.dispatch('hideRetweets', this.list.id_str)
          },
        })
      } else {
        actions.push({
          label: 'リツイートを表示する',
          color: 'positive',
          icon: 'repeat',
          handler: () => {
            this.$store.dispatch('showRetweets', this.list.id_str)
          },
        })
      }
      this.$q.actionSheet({ actions })
        .catch(() => {
          // 普通にアクションシートが閉じられたときもrejectされるのでcatchしないとエラーになる
        })
    },
  },
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
        if (error.response.status === 401) {
          this.showLoginDialog()
        } else {
          this.showErrorDialog(error)
        }
      })
  },
}
</script>

<style lang="scss" scoped>
.thumb {
  padding-top: 100%;

  background-size: cover;
  background-position: center center;
}
</style>
