import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '@/pages/HomePage'
import ListPage from '@/pages/ListPage'
import ImagePage from '@/pages/ImagePage'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: {
        header: {
          title: 'Twitter List Image Viewer',
        },
      },
    },
    {
      path: '/list/:id',
      component: ListPage,
      meta: {
        header: {
          title: 'List',
          back: true,
        },
      },
    },
    {
      path: '/list/:id/image/:status_id/:index',
      name: 'image',
      component: ImagePage,
      meta: {
        header: {
          title: 'Image',
          back: true,
        },
      },
    },
  ],
  scrollBehavior (to, from, savedPosition) {
    // TODO: キレイに動くようになったが、なぜこれでキレイに動くのかちゃんとわかっていない
    // ScrollBehaviorの実装を見る必要あるかも
    // https://github.com/quasarframework/quasar/issues/1466#issuecomment-416495843
    const position = savedPosition || { x: 0, y: 0 }
    return new Promise((resolve, reject) => {
      router.app.$root.$once('triggerScroll', () => {
        router.app.$nextTick(() => {
          window.scrollTo({ top: position.y, left: position.x })
          resolve(position)
        })
      })
    })
  },
})

export default router
