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
            <!-- 点击设置升序降序 -->
            <a @click="sortGoods" href="javascript:void(0)" class="price">
              Price
              <svg class="icon icon-arrow-short">
                <use xlink:href="#icon-arrow-short"></use>
              </svg>
            </a>
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
                      <a href="#"><img v-lazy="'/static/' + item.productImage" alt=""></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productId}} - {{index}}</div>
                      <div class="price">{{item.salePrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
                  ...
                </div>
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
      priceCheck: 'all', //过滤器选项
      filterBy: false, //控制小屏幕的侧边窗口是否弹出
      overLayFlag: false,  //控制小屏幕时黑幕是否出现
      sortFlag: true,
      page: 1, //所在页数
      pageSize: 8, //每页显示多少个
      busy: true
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
    // 为函数传入一个flag值，判断是否要把数据累加起来
    // 默认false
    getGoodsList (flag) {
      var param = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag?1:-1 //如果是true给1（升序），不是给-1（降序）
      }
      axios.get("/goods",{
        params: param //传入到后端的参数集
      }).then((result)=>{
        let res = result.data
        if (res.status == "0"){
          // 能加载就拼接加载，不能时停止拼接，
          if (flag) {
            // 用concat进行数据拼接
            this.goodsList = this.goodsList.concat(res.result.list)
            // 数据没了，设置busy不再滚动
            if (res.result.count == 0 ) {
              this.busy = true;
            } else {
              this.busy = false;
            }
          } else {
            this.goodsList = res.result.list;
            this.busy = false;
          }
        } else {
          this.goodsList = [];
        }
      })
    },
    // 设置小屏幕的价格区间选中
    setPriceFilter (index) {
      this.priceCheck = index
      this.closePop()
    },
    // 显示黑幕
    showFilterPop () {
      this.filterBy = true
      this.overLayFlag = true
    },
    // 将黑幕消去
    closePop () {
      this.filterBy = false
      this.overLayFlag = false
    },
    // 设置升序降序
    sortGoods () {
      this.sortFlag = !this.sortFlag;
      this.page = 1;
      this.getGoodsList();
    },
    loadMore () {
      this.busy = true;
      setTimeout(() => {
        this.page++;
        this.getGoodsList(true);
      }, 300);
    }
  }
}
</script>

<style>
/*ul块清浮动*/
.accessory-list-wrap ul::after {
  clear: both;
  content: '';
  height: 0;
  display: block;
  visibility: hidden;
}
.load-more {
  height: 100px;
  line-height: 100px;
  text-align: center;
}
</style>
