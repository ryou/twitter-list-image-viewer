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
})
