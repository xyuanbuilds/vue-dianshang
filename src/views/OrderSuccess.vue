<template lang="html">
<div>
  <nav-header></nav-header>
  <nav-bread>
    <span>order success</span>
  </nav-bread>
  <div class="container">
    <div class="page-title-normal">
      <h2 class="page-title-h2"><span>check out</span></h2>
    </div>
    <!-- 进度条 -->
    <div class="check-step">
      <ul>
        <li class="cur"><span>Confirm</span> address</li>
        <li class="cur"><span>View your</span> order</li>
        <li class="cur"><span>Make</span> payment</li>
        <li class="cur"><span>Order</span> confirmation</li>
      </ul>
    </div>

    <div class="order-create">
      <div class="order-create-pic"><img src="/static/ok-2.png" alt=""></div>
      <div class="order-create-main">
        <h3>Congratulations! <br>Your order is under processing!</h3>
        <p>
          <span>Order ID：{{orderId}}</span>
          <span>Order total：{{orderTotal}}</span>
        </p>
        <div class="order-create-btn-wrap">
          <div class="btn-l-wrap">
            <router-link class="btn btn--m" to="/cart">Cart List</router-link>
          </div>
          <div class="btn-r-wrap">
            <router-link class="btn btn--m" to="/">Goods List</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
  <nav-footer></nav-footer>
</div>
</template>

<script>
import NavHeader from '@/components/Header.vue'
import NavFooter from '@/components/Footer.vue'
import NavBread from '@/components/NavBread.vue'
import Modal from '@/components/Modal.vue'
import axios from 'axios'
import {currency} from '@/util/currency'

export default {
  data () {
    return {
      orderId: '',
      orderTotal: ''
    }
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread
  },
  // 定义局部过滤器，格式化金额
  filters: {
    currency: currency
  },
  mounted () {
    // 这里直接把取到订单信息的过程写到mounted里了
    let orderId = this.$route.query.orderId
    if (!orderId) {
      return
    }
    axios.get('/users/orderDetail', {
      // get请求需要用params传递值
      params: {
        orderId: orderId
      }
    }).then((response)=>{
      let res = response.data
      if (res.status == '0') {
        this.orderId = orderId
        this.orderTotal = res.result.orderTotal
      }
    })
  }
}
</script>

<style lang="css">
</style>
