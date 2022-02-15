<template>
  <div>
    <div class="logo-con">
      <img src="@/assets/images/logo.png" key="logo" />
      <span>{{LogoText}}</span>
    </div>
    <div class="header-bar">
      <sider-trigger :collapsed="collapsed" icon="md-menu" @on-change="handleCollpasedChange"></sider-trigger>
      <div class="top-menu">
        <Menu mode="horizontal">
          <MenuItem name="monitor" to="/Statistics/monitor_page">统计</MenuItem>
          <MenuItem name="device" to="/Device/device_page">设备</MenuItem>
          <MenuItem name="information" to="/info/info_path">信息</MenuItem>
        </Menu>
      </div>
      <div class="custom-content-con">
        <slot></slot>
      </div>
      <div class="top-home-link">
        <router-link to="/home"><Icon type="md-home" /></router-link>
      </div>
    </div>
  </div>
</template>
<script>
import siderTrigger from './sider-trigger'
import './header-bar.less'
export default {
  name: 'HeaderBar',
  components: {
    siderTrigger
  },
  data () {
    return {
      LogoText: 'SD-WAN'
    }
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
<style>
  .top-menu{display: inline-block; height:55px;}
  .top-menu a{float: left; margin-left:50px;}
  .top-menu .ivu-menu-light{background:none !important;}
  .top-menu .ivu-menu-horizontal.ivu-menu-light::after{display:none;}
  .top-menu .ivu-menu-light.ivu-menu-horizontal .ivu-menu-item,
  .top-menu .ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu { color: #FFF;  }
  .top-menu .ivu-menu-light.ivu-menu-horizontal .ivu-menu-item-active,
  .top-menu .ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu-active,
  .top-menu .ivu-menu-light.ivu-menu-horizontal .ivu-menu-item:hover,
  .top-menu .ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu:hover {color:#FFF; border-bottom:2px solid #FFF; }
</style>
