<template>
  <Layout style="height: 100%" class="main">
    <div class="home-box">
      <div class="home-header">
        <div class="logo-con" style="padding:5px;">
          <img src="@/assets/images/logo_Hm.png" key="logo" />
        </div>
        <div class="home-head-avator"><user :user-avator="userAvator"/></div>
      </div>
      <div class="hbox">
        <!--<router-link to="/Statistics/monitor_page" @click.native="getSdWanAdom"><span class="nav-link01"><div>SD-WAN</div></span></router-link>-->
        <a v-if="checkPermCodeExist('sdwan')" @click="getSdWanAdom"><span class="nav-link01"><div>SD-WAN</div></span></a>
        <router-link v-if="checkPermCodeExist('formDeviceCabinet')" @click.native="beforeJump()" to=""><span class="nav-link02"><div>资产管理</div></span></router-link>
      </div>
    </div>
  </Layout>
</template>
<script>
import User from '_c/public/user'
import { getSdWanAdomList } from '@/api/sdwan'
import { mapActions, mapMutations } from 'vuex'
import { assetFirstTimeConfigurePageLoad } from '@/api/asset'
import { setObjectToSessionStorage, setToken } from '@/utils'
export default {
  components: {
    User
  },
  name: 'navlist',
  data () {
    return {
      LogoText: '互盟自助服务管理平台'
    }
  },
  computed: {
    userAvator () {
      return this.$store.state.upms.avatorImgPath
    }
  },
  methods: {
    ...mapMutations([
      'setSdWanADom'
    ]),
    // 判断跳转到首次配置页面还是管理页面
    beforeJump () {
      let firstUrl = '/first'
      let normalUrl = '/devinfo_page'
      assetFirstTimeConfigurePageLoad().then(response => {
        if (!response || !response.success) {
          this.$router.push(firstUrl)
        }
        if (response.data) {
          if (response.data.configured) {
            this.$router.push(normalUrl)
          } else {
            this.$router.push(firstUrl)
          }
        } else {
          this.$router.push(firstUrl)
        }
      })
    },
    getSdWanAdom () {
      getSdWanAdomList().then(res => {
        if (res.success) {
          if (res.data.length > 0) {
            let sdWanAdom = res.data[0].name
            this.setSdWanADom(sdWanAdom)
            // 放入sessionStorage
            setObjectToSessionStorage('sdWanAdom', sdWanAdom)
            this.$router.push({ path: '/Statistics/monitor_page' })
          } else {
            this.$Message.error({ content: '没有有效的ADom' })
          }
        } else {
          this.$Message.error({ content: '该租户没有绑定SDWAN用户' })
        }
      })
    }
  }
}
</script>

<style>
.home-header{background-color:#0d3563;height: 65px;position:fixed;width:100%; left:0;top:0;z-index:99;padding:5px;}
.home-box{width:100%;height:100%;position:absolute;left:0;top:0;background:url(assets/images/nav-bg.jpg) no-repeat;background-size:100% 100%;z-index:999; padding-top: 65px;}
.home-box .hbox{position:absolute;top:50%;margin-top:-80px;width:100%; text-align:center;}
.home-box .hbox a{color:#FFF;}
.home-box .hbox a:hover span{box-shadow:inset 0 0 15px #8fbcf0;}
.home-box .hbox span{display:inline-block;margin:0 15px 15px 15px;text-align:center;padding-top:20px;font-size:18px;}
.home-box .hbox span::before{display:inline-block;content:"";width:120px;height:120px;background-repeat:no-repeat;color:#FFF;}
.nav-link01{width:212px;height: 212px;border-radius:15px;background-image:linear-gradient(#2555af, #376dd3);;}
.nav-link02{width:212px;height: 212px;border-radius:15px;background-image:linear-gradient(rgba(18,120,145,0.95), rgba(53,145,207,0.95));}
.nav-link01::before{background-image:url(assets/images/icon_nav01.png);}
.nav-link02::before{background-image:url(assets/images/icon_nav02.png);}
.home-head-avator{float: right;margin:10px 20px 0 0;}
.home-head-avator .ivu-icon{color:#FFF;}
.home-head-avator .ivu-select-dropdown{border-radius:0;padding:0;}
.home-head-avator .ivu-dropdown-item {padding:12px 20px;font-size:14px;text-align:center;}
.home-head-avator .ivu-dropdown-item:hover { background: #f0f7ff;color:#2389c9;}
</style>
