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
            <a @click="sortGoods" href="javascript:void(0)" class="price" :class="{'sort-up': !sortFlag}">
              Price
              <svg class="icon icon-arrow-short">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-short">
                  <svg id="icon-arrow-short" viewBox="0 0 25 32" width="100%" height="100%">
                    <title>arrow-short</title>
                    <path d="M24.487 18.922l-1.948-1.948-8.904 8.904v-25.878h-2.783v25.878l-8.904-8.904-1.948 1.948 12.243 12.243z" class="path1">
                    </path>
                  </svg>
                </use>
              </svg>
            </a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter" :class="{'filterby-show': filterBy}" >
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd @click="setPriceFilter(10)">
                  <a href="javascript:void(0)" :class="{'cur': priceCheck == 10}">All</a>
                </dd>
                <!-- 这里很实用通过index来实现菜单的切换 -->
                <dd v-for="(price,index) in priceFilter" @click="priceCheck = index">
                  <a href="javascript:void(0)" @click="setPriceFilter(index)"
                  :class="{'cur': priceCheck == index}">{{price.startPrice}} - {{price.endPrice}}</a>
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
                      <div class="name">{{item.productName}} - {{index}}</div>
                      <div class="price">{{item.salePrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="0">
                  <img v-show="loading" src="./../assets/loading-spinning-bubbles.svg" alt="">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
      <!-- 绑定的mdShow是传入的props值，等于的mdShow是父组件的data里的值 -->
      <!-- 这里的checkMd是对子组件的事件监听，一旦监听到，就启动mdStatus方法 -->
      <modal :mdget="mdShow" @checkMd="mdStatus">
        <p slot="message">请登录，不然无法加入购物车</p>
        <div slot="btn-group">
          <a href="#" class="btn btn--m" @click="mdShow = false">关闭</a>
        </div>
      </modal>
      <modal :mdget="mdShowCart" @checkMd="mdStatus">
        <p slot="message">
          <svg class="icon-status-ok" viewBox="0 0 32 32" width="100%" height="100%">
            <title>status-ok</title>
            <path d="M22.361 10.903l-9.71 9.063-2.998-2.998c-0.208-0.209-0.546-0.209-0.754 0s-0.208 0.546 0 0.754l3.363 3.363c0.104 0.104 0.241 0.156 0.377 0.156 0.131 0 0.261-0.048 0.364-0.143l10.087-9.414c0.215-0.201 0.227-0.539 0.026-0.754s-0.539-0.226-0.754-0.026z" class="path1"></path> <path d="M16 30.933c-8.234 0-14.933-6.699-14.933-14.933s6.699-14.933 14.933-14.933c8.234 0 14.933 6.699 14.933 14.933s-6.699 14.933-14.933 14.933zM16 0c-8.822 0-16 7.178-16 16 0 8.823 7.178 16 16 16s16-7.177 16-16c0-8.822-7.178-16-16-16z" class="path2"></path>
          </svg>
          <span>加入购物车成功</span>
        </p>
        <div slot="btn-group">
          <a href="#" class="btn btn--m" @click="mdShowCart = false">继续购物</a>
          <router-link href="#" class="btn btn--m" to="/cart">查看购物车</router-link>
        </div>
      </modal>
      <nav-footer></nav-footer>
  </div>
</template>

<script>
import NavHeader from '@/components/Header.vue'
import NavFooter from '@/components/Footer.vue'
import NavBread from '@/components/NavBread.vue'
import Modal from '@/components/Modal.vue'
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
      priceCheck: 10, //过滤器选项
      filterBy: false, //控制小屏幕的侧边窗口是否弹出
      overLayFlag: false,  //控制小屏幕时黑幕是否出现
      sortFlag: true, //控制传出的sort值，true为1（升序），false为-1（降序）
      page: 1, //所在页数
      pageSize: 8, //每页显示多少个
      busy: true, //是否还有数据要加载
      loading: false, //是否正在加载
      mdShow: false, //模态框是否弹出，用于传入props的值
      mdShowCart: false //控制添加成功的模态框的是否弹出
    }
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread,
    Modal
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
        sort: this.sortFlag?1:-1, //如果是true给1（升序），不是给-1（降序）
        priceLevel: this.priceCheck
      }
      this.loading = true;
      axios.get("/goods/list",{
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
        this.loading = false;
      })
    },
    // 设置价格区间选中
    setPriceFilter (index) {
      this.priceCheck = index;
      this.page = 1;
      this.getGoodsList()
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
    // 分页加载
    loadMore () {
      this.busy = true;
      setTimeout(() => {
        this.page++;
        this.getGoodsList(true);
      }, 300);
    },
    // 添加到购物车
    addCart (productId) {
      axios.post ("/goods/addCart", {
        productId: productId
      }).then((res)=>{
        if (res.data.status == "0") {
          this.mdShowCart = true
          this.$store.commit("updateCartCount", 1)
        } else {
          this.mdShow = true
        }
      })
    },
    // 模态框的关闭
    mdStatus () {
      this.mdShow = false
      this.mdShowCart = false
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
