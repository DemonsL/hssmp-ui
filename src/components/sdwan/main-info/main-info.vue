<template>
  <Layout style="height:100%" class="main">
    <Header class="header-con">
      <header-bar>
        <user :user-avator="userAvator"/>
      </header-bar>
    </Header>
    <Sider hide-trigger collapsible :width="190" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">
      <div class="side-menu-wrapper">
        <div class="search-con">
          <Input suffix="ios-search" placeholder="输入内容" style="width:100%" />
        </div>
        <Menu active-name="1-1" :open-names="['1']">
            <Submenu name="1">
                <template slot="title">
                    <Icon type="ios-paper" />
                    服务信息
                </template>
                <MenuItem :name="nav.name" :to="nav.url" v-for="nav in menus" :key="nav.name">{{ nav.title }}</MenuItem>
            </Submenu>
        </Menu>
      </div>

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
import HeaderBar from '../main/components/header-bar'
import User from '_c/public/user'
import { mapMutations, mapActions, mapGetters } from 'vuex'

import '../main/main.less'
export default {
  name: 'Maininfo',
  components: {
    HeaderBar,
    User
  },
  data () {
    return {
      collapsed: false,
      isFullscreen: false,
      menus: [
        { name:'1-1',title: '基本信息' ,url:'/info/info_path'},
        // { name:'1-2',title: '设备',url:'/device/device_page' },
        // { name:'1-3',title: '基本信息' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'errorCount'
    ]),
    userAvator () {
      return this.$store.state.upms.avatorImgPath
    }
  },
  methods: {

  },
  watch: {

  },
  mounted () {

  }
}

</script>
