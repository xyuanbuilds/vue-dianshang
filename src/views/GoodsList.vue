<template lang="html">
  <div>
      <nav-header></nav-header>
      <nav-bread>
        <span>Goods</span>
      </nav-bread>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">Sort by:</span>
            <a href="javascript:void(0)" class="default cur">Default</a>
            <a href="javascript:void(0)" class="price">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter" :class="{'filterby-show': filterBy}" >
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd><a href="javascript:void(0)" :class="{'cur': priceCheck == 'all'}" @click="priceCheck = 'all'">All</a></dd>
                <!-- 这里很实用通过index来实现菜单的切换 -->
                <dd v-for="(price,index) in priceFilter" @click="priceCheck = index">
                  <a href="javascript:void(0)" @click="setPriceFilter(index)" :class="{'cur': priceCheck == index}">{{price.startPrice}} - {{price.endPrice}}</a>
                </dd>
              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li v-for="(item,index) of goodsList">
                    <div class="pic">
                      <a href="#"><img v-lazy="'static/' + item.productImg" alt=""></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}} - {{index}}</div>
                      <div class="price">{{item.productPrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
      <nav-footer></nav-footer>
  </div>
</template>

<script>
import NavHeader from '@/components/Header.vue'
import NavFooter from '@/components/Footer.vue'
import NavBread from '@/components/NavBread.vue'
import axios from 'axios'

export default {
  name: 'GoodsList',
  data () {
    return {
      goodsList: [],
      priceFilter: [
        {
          startPrice: '0.00',
          endPrice: '500.00'
        },
        {
          startPrice: '500.00',
          endPrice: '1000.00'
        },
        {
          startPrice: '1000.00',
          endPrice: '2000.00'
        },
      ],
      priceCheck: 'all',
      filterBy: false,
      overLayFlag: false
    }
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread
  },
  mounted: function () {
    this.getGoodsList ();
  },
  methods: {
    getGoodsList () {
      axios.get("/goods").then((result)=>{
        var res = result.data
        this.goodsList = res.result
      })
    },
    showFilterPop () {
      this.filterBy = true
      this.overLayFlag = true
    },

    setPriceFilter (index) {
      this.priceCheck = index
      this.closePop()
    },
    closePop () {
      this.filterBy = false
      this.overLayFlag = false
    }
  }
}
</script>
