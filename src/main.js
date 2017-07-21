// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
// 将样式文件导入到这里可以全局都使用到
import '@/assets/css/base.css'
import '@/assets/css/product.css'
import '@/assets/css/checkout.css'
import '@/assets/css/login.css'

Vue.config.productionTip = false
Vue.use(infiniteScroll)

// 图片懒加载实现，为其设置了路径
Vue.use(VueLazyLoad, {
  loading: 'static/loading-svg/loading-bars.svg'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
