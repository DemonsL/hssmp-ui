<template>
  <Layout style="height:100%" class="main">
    <Header class="header-con">
      <div class="logo-con">
        <img src="@/assets/images/logohm.png" key="logo" />
        <span>{{LogoText}}</span>
      </div>
      <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
        <user :user-avator="userAvator"/>
      </header-bar>
    </Header>
    <Sider hide-trigger collapsible :width="190" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">
      <Menu style="width: auto;" theme="light" ref="sideMenu" :open-names="openedNames" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage">
        <Submenu name="manager" v-if="checkIsAdmin()">
          <template slot="title">
            <Icon type="md-person" />
            管理员
          </template>
          <MenuItem name="manage" v-if="checkPermCodeExist('fromUserManagement:fromUserManagement')">管理员管理</MenuItem>
          <MenuItem name="post" v-if="checkPermCodeExist('formUserManagement:formUserRole')">角色管理</MenuItem>
        </Submenu>
        <Submenu name="userinfo" v-if="checkPermCodeExist('formaccountInfo:formaccountInfo')">
          <template slot="title">
            <Icon type="ios-paper" />
            账号信息
          </template>
          <MenuItem name="baseinfo" v-if="checkPermCodeExist('formaccountInfo:formaccountInfo')">基础信息</MenuItem>
          <MenuItem name="repass" v-if="checkPermCodeExist('formaccountInfo:formModifyPassword')">修改密码</MenuItem>
        </Submenu>

        <Submenu name="sys_log">
          <template slot="title">
            <Icon type="ios-list-box" />
            系统日志
          </template>
          <MenuItem name="syslog">登入日志</MenuItem>
        </Submenu>
      </Menu>
    </Sider>
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
import { getUnion } from '@/libs/tools'
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
      collapsed: false,
      isFullscreen: false,
      LogoText: '互盟自助服务管理平台',
      openedNames: [],
      activeName: undefined,
      openNames: []
    }
  },
  computed: {
    userAvator () {
      return this.$store.state.upms.avatorImgPath
    },
    menuList () {
      let newMenu = []
      let apiMenu = this.$store.getters.getMenuList

      let oldMenu = this.$store.getters.menuList
      if (apiMenu) {
        apiMenu.forEach(item => {
          if (item && item.menuName === '会员中心') {
            oldMenu.forEach(oldMenuItem => {
              newMenu.push(oldMenuItem)
            })
          }
        })
      }

      return oldMenu
    }
  },
  methods: {
    getOpenedNamesByActiveName (name) {
      return this.$route.matched.map(item => item.name).filter(item => item !== name)
    },
    updateOpenName (name) {
      if (name === this.$config.homeName) this.openedNames = []
      else this.openedNames = this.getOpenedNamesByActiveName(name)
    },

    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    handleCollapsedChange (state) {
      this.collapsed = state
    },
    handleClick (item) {
      this.turnToPage(item)
    }
  },
  watch: {
    '$route' (newRoute) {
      const { name, query, params, meta } = newRoute
      this.updateOpenName(newRoute.name)
    },
    activeName (name) {
      if (this.accordion) this.openedNames = this.getOpenedNamesByActiveName(name)
      else this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name))
    },
    openNames (newNames) {
      this.openedNames = newNames
    },
    openedNames () {
      this.$nextTick(() => {
        this.$refs.sideMenu.updateOpened()
      })
    }

  },
  mounted () {
    this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name))
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

  .ivu-layout {background: #FFF !important;}
  .tags-nav .scroll-outer { box-shadow: none; background: #FFF;}

</style>
