<template>
  <div>
    <div class="user-avator-dropdown">
      <Dropdown @on-click="handleClick">
        <Avatar style="background-color: #2b85e4" icon="ios-person" />
        <Icon :size="18" type="md-arrow-dropdown"></Icon>
        <DropdownMenu slot="list">
          <DropdownItem v-if="checkPermCodeExist('formUserManagement')" name="manage"><span><router-link to="/manager/manage">个人中心</router-link></span></DropdownItem>
          <DropdownItem v-if="checkPermCodeExist('formUserManagement')" name="repass"><span><router-link to="/userinfo/repass">修改密码</router-link></span></DropdownItem>
          <DropdownItem name="about"><span @click="AboutBox = true">关于我们</span></DropdownItem>
          <DropdownItem name="logout"><span>退出登录</span></DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>

    <div>
      <Modal title="关于我们" v-model="AboutBox" width="680" class-name="vertical-center-modal">
        <h3 align="center" style="padding-top: 20px;"><img src="@/assets/images/logo_Hm.png" alt=""></h3>
        <div class="about-text">
          <p>互盟股份于2009年创立并进入互联网行业，致力于数据中心、企业云服务、定制云及相关IT增值服务的研发和销售。依托自建数据中心优势，为企业级客户提供数据中心、云计算、光纤专线、项目服务等一站式解决方案。</p>
          <p>互盟依托多个自建自营互联网数据中心，以互盟特有的DCI 网络场景、云计算产品及SDN技术, 实现与主流的公有云互联互通, 形成“VDC+云+ 网+CMSP ”一站式云网融合方案，助力客户轻松上云与便捷组网。</p>
          <p>详情请了解：<a href="http://www.humenggroup.com" target="_blank">http://www.humenggroup.com</a></p>
        </div>
        <div slot="footer"> </div>
      </Modal>
    </div>

  </div>
</template>


<script>
  import './user.less'
  import { mapGetters, mapMutations } from 'vuex';
  import {logout,getLoginInfo} from "@/api/upms";
  import {setToken} from "@/utils";
  export default {
    name: 'User',
    props: {
      userAvator: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        AboutBox: false
      }
    },
    methods: {
      ...mapMutations([
        'setUserInfo',
        'setMenuList'
      ]),
      handleClick(name) {
        switch (name) {
          case 'logout':
            logout().then(response=>{
              setToken();
              window.sessionStorage.removeItem('sdWanAdom');
              this.$router.replace({name: 'login'});
            }).catch(e => {})
        }
      }
    },
    mounted() {
      // getLoginInfo().then(res => {
      //   console.log(res.data)
      //   this.setMenuList(res.data.menuList);
      //   delete res.data.menuList;
      //   this.setUserInfo(res.data);
      // }).catch(e => {})
    }
  }
</script>
<style>
  .about-text{font-size:14px;line-height:1.5em;padding:20px 80px;}
  .about-text p{margin-bottom: 20px;}
  .ivu-dropdown-item{padding:0 !important;}
  .ivu-dropdown-item span{display:block;padding:8px 20px;}
  .ivu-dropdown-item:hover span{color:#2D8cF0;}
  .ivu-dropdown-item a{color:#333;}
</style>
