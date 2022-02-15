<template>
  <div>
  <div class="logo-con">
    <img src="@/assets/images/logoAss.png" key="logo" />
    <span>{{LogoText}}</span>
  </div>
  <div class="header-bar">
    <div class="top-menu">
      <Menu mode="horizontal" @on-select="turnUrl" active-name="$route.name">
        <MenuItem name="devinfo">设备信息</MenuItem>
        <MenuItem name="runlog">执行记录</MenuItem>
        <MenuItem name="assetup">资产配置</MenuItem>
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

import './header-bar.less'
export default {
  name: 'HeaderBar',
  components: {
  },
  data () {
    return {
      LogoText:'资产管理'
    }
  },
  props: {
    collapsed: Boolean
  },
  methods: {
    turnUrl(name){
      this.$router.push({name});
    }
  }
}
</script>
<style>
  .top-menu{display: inline-block; height:55px;}
  .top-menu ul{padding:3px 0 0 50px;}
  .top-menu a{float: left; margin-left:50px;}
  .top-menu .ivu-menu-light{background:none !important;}
  .top-menu .ivu-menu-horizontal.ivu-menu-light::after{display:none;}
  .top-menu .ivu-menu-light.ivu-menu-horizontal .ivu-menu-item,
  .top-menu .ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu { color: #FFF;  }
  .top-menu .ivu-menu-light.ivu-menu-horizontal .ivu-menu-item-active,
  .top-menu .ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu-active,
  .top-menu .ivu-menu-light.ivu-menu-horizontal .ivu-menu-item:hover,
  .top-menu .ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu:hover {color:#FFF; border-bottom:2px solid #FFF; }
  .top-home-link{float:right;font-size:20px;padding-right:20px;}
  .top-home-link a{color:#FFF;}
  .top-home-link a:hover{color:#7fc1ff;}
</style>
