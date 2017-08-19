// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
// 将样式文件导入到这里可以全局都使用到
import '@/assets/css/base.css'
import '@/assets/css/product.css'
import '@/assets/css/checkout.css'
import '@/assets/css/login.css'
// import {currency} from '@/util/currency'
// 全局过滤器的定义以及使用方法
// Vue.filter("currency", currency)

Vue.config.productionTip = false
Vue.use(infiniteScroll)

// Vuex配置
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    nickName: '',
    cartCount: 0
  },
  mutations: {
    updateUserInfo (state,nickName) {
      state.nickName = nickName
    },
    updateCartCount (state,cartCount) {
      state.cartCount += cartCount
    },
    initCartCount (state,cartCount) {
      state.cartCount = cartCount
    }
  }
})

// 图片懒加载实现，为其设置了路径
Vue.use(VueLazyLoad, {
  loading: 'static/loading-svg/loading-bars.svg'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
