import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '@/pages/HomePage'
import ListPage from '@/pages/ListPage'
import ListIndexPage from '@/pages/ListIndexPage'
import ImagePage from '@/pages/ImagePage'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/list/:id',
      component: ListPage,
      children: [
        {
          path: '',
          name: 'list',
          component: ListIndexPage,
        },
        {
          path: 'image/:status_id/:index',
          name: 'image',
          component: ImagePage,
        },
      ],
    },
  ],
})
