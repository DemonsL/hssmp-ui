<template>
  <div class="header-bar">
    <div class="custom-content-con">
      <slot></slot>
    </div>
    <div class="top-home-link">
      <router-link to="/home"><Icon type="md-home" /></router-link>
    </div>
  </div>
</template>
<script>
import siderTrigger from './sider-trigger'
import './header-bar.less'
export default {
  name: 'HeaderBar',
  components: {
    siderTrigger,
  },
  props: {
    collapsed: Boolean
  },
  computed: {

  },
  methods: {
    handleCollpasedChange (state) {
      this.$emit('on-coll-change', state)
    }
  }
}
</script>
