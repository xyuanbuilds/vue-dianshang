<template lang="html">
<div>
  <div class="md-modal modal-msg md-modal-transition" :class="{'md-show':mdget}">
  <div class="md-modal-inner">
    <div class="md-top">
      <button class="md-close" @click="mdClose">Close</button>
    </div>
    <div class="md-content">
      <div class="confirm-tips">
        <slot name="message"></slot>
      </div>
      <div class="btn-wrap">
        <slot name="btn-group"></slot>
      </div>
    </div>
  </div>
</div>
  <div class="md-overlay" v-if="mdget" @click="mdClose"></div>
</div>
</template>

<script>
export default {
  props:[
    'mdget'
  ],
  // 这里需要注意，没有通过直接修改传来的值来控制模态框的关闭
  // 这是为了遵循vue的一个原则，所以采取提交报告
  // 父组件接收到驱动，再做响应
  methods: {
    mdClose () {
      this.$emit('checkMd')
    }
  }
}
</script>
