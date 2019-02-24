import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '@/pages/HomePage'
import ListPage from '@/pages/ListPage'
import ImagePage from '@/pages/ImagePage'

Vue.use(VueRouter)

export default new VueRouter({
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
    let option
    if (savedPosition) {
      option = {
        position: savedPosition,
        delay: 160,
      }
    } else {
      option = {
        position: { x: 0, y: 0 },
        delay: 10,
      }
    }

    // 画面遷移のタイミングに合わせるために、0.55s後にスクロール位置を返す
    // https://router.vuejs.org/ja/guide/advanced/scroll-behavior.html#%E9%9D%9E%E5%90%8C%E6%9C%9F%E3%81%AA%E3%82%B9%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%AA%E3%83%B3%E3%82%B0
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(option.position)
      }, option.delay)
    })
  },
})
