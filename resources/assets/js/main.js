// Vue Core Packages
import Vue from 'vue'
import VueRouter from 'vue-router'

// Quasar Styles
import 'quasar-extras/material-icons'
import 'quasar-extras/fontawesome'
import 'quasar-extras/mdi'
import 'quasar-extras/ionicons'
import 'quasar-extras/roboto-font'
import 'quasar-extras/animate'
import Quasar, * as All from 'quasar-framework/dist/quasar.mat.esm'

// Vue Components
import App from '@/App'

// use
Vue.use(VueRouter)
Vue.use(Quasar, {
  components: All,
  directives: All,
  plugins: All,
  animations: All,
})

// Vueの仕様上どうしようもないのでここではno-new解除
// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App),
})
