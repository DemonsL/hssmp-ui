<template>
  <Layout style="height:100%" class="main">
    <Header class="header-con">
      <header-bar>
        <user :user-avator="userAvator"/>
      </header-bar>
    </Header>
    <Sider hide-trigger collapsible :width="190" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">
      <Menu :active-name="$route.name" :open-names="['1']" @on-select="turnUrl" width="190">
        <Submenu name="1">
          <template slot="title">
            <Icon type="md-pulse" />
            流量统计
          </template>
          <MenuItem :name="nav.name" v-for="nav in menus" :key="nav.name">{{ nav.title }}</MenuItem>
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
import { mapMutations, mapActions, mapGetters } from 'vuex'
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
      menus: [
        { name: 'monitor', title: 'SLA监控', url: '/Statistics/monitor_page'},
        { name: 'traffic_in', title: '内部流量', url: '/Statistics/traffic_in' },
        { name: 'traffic_out', title: '外部访问流量', url: '/Statistics/traffic_out' },
        { name: 'ranking', title: '国家/区域排名', url: '/Statistics/ranking' },
        { name: 'traffic_app', title: '应用流量', url: '/Statistics/traffic_app' }
      ]
    }
  },
  computed: {
    userAvator () {
      return this.$store.state.upms.avatorImgPath
    }
  },
  methods: {
    ...mapActions([
      'handleLogin'
    ]),
    turnUrl (name) {
      this.$router.push({name});
    }
  },
  watch: {

  },
  mounted () {

  }
}

</script>

<style>

</style>
