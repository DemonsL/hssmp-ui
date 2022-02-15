<template>
  <Layout style="height:100%" class="main">
    <Header class="header-con first">
      <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
        <user :user-avator="userAvator"/>
      </header-bar>
    </Header>
    <Layout>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <Content class="content-wrapper">
            <router-view/>
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>

</template>
<script>
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import User from '_c/public/user'
import './main.less'
export default {
  name: 'Main',
  components: {
    SideMenu,
    HeaderBar,
    User
  },
  data () {
    return {
      collapsed: false
    }
  },
  computed: {
    userAvator () {
      return this.$store.state.upms.avatorImgPath
    }

  },
  methods: {
    handleCollapsedChange (state) {
      this.collapsed = state
    }
  },
  watch: {

  },
  mounted () {

  }
}

</script>

<style>
  .main{padding-top: 65px;}
  .main .header-con {
    background: #0f4787;height:65px;position:fixed;top:0;left:0;z-index:999;
    padding: 0 20px;color:#FFF; width: 100%;
  }
  .main .logo-con {float:left;height:64px; padding:10px;}
  .main .logo-con img{float:left;margin-right:20px;}
  .main .logo-con span{float:left;line-height:44px;font-size:16px;}
  .sider-trigger-a { color:#FFF;}
  .ivu-breadcrumb { color: #FFF !important;}
  .ivu-breadcrumb a{color:#FFF !important;}
  .ivu-breadcrumb a:hover{color:#2d8cf0 !important;}
  .ivu-breadcrumb > span:last-child { color: #8bd2ff !important;}
  .tags-nav .scroll-outer { box-shadow: none; background: #FFF;}
  .ivu-menu-light { background: #fbfbfb !important;}
  .main .left-sider .ivu-layout-sider-children {background: #FBFBFB;}
  .first .top-menu{display:none;}
</style>
