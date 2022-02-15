<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="animate">
      <iframe name = "iframeMap" id="iframeMapViewComponent" v-bind:src="getPageUrl" width="100%" height="100%" frameborder="0" scrolling="no" ref="iframeDom"></iframe>
    </div>
    <div class="login-con">
      <Card icon="log-in" title="互盟自助服务管理平台" :bordered="false">
        <div class="form-con">
          <Tabs :animated="false" :style="showTenants?'display:none':'display:block'">
            <TabPane label="账号登录">
              <login-form
                :showVerCode="showVerCode"
                @on-success-valid="handleSubmit">
              </login-form>
            </TabPane>
            <TabPane label="手机登录">
              <login-mobile @on-success-valid="handlePhoneLoginSubmit"></login-mobile>
            </TabPane>
          </Tabs>

          <div class="login-select-box" :style="showTenants?'display:block':'display:none'">
            <span>你已经加入以下企业，请选择进入 <Button type="text">返回>></Button></span>
            <CellGroup @on-click="selectTenant" class="login-select">
              <Cell v-for="(item) in tenantList" :key="item.tenantId" :title="item.showName" :name="item.tenantId" />
            </CellGroup>
          </div>

          <p class="login-link">
            <a href="#" target="_blank">帮助</a>
            <a href="#" target="_blank">隐私</a>
            <a href="#" target="_blank">条款</a>
          </p>
          <p class="login-tip">copyright©2021 深圳市互盟科技股份有限公司</p>
        </div>
      </Card>
    </div>

  </div>

</template>

<script>
import LoginForm from '_c/login-form'
import LoginMobile from '_c/login-form/login-mobile'
import { preLogin, phoneWithPaswordLogin, phoneLogin, tenantCodeLogin } from '@/api/upms'
import { encrypt, setToken } from '@/utils'
import { mapActions, mapMutations } from 'vuex'
export default {
  components: {
    LoginForm,
    LoginMobile
  },
  data () {
    return {
      loginType: 1, // 1表示手机号+密码登入，2：手机验证码登入，3，企业号登入
      showVerCode: false,
      showTenants: false,
      getPageUrl: 'Animate/products.html',
      loading: true,
      tenantList: [],
      loginParam: {
        loginPhone: undefined,
        password: '',
        tenantId: undefined,
        captcha: undefined

      }
    }
  },
  created () {
    // 初始化时为window绑定一个方法
    window['vueDefinedMyProp'] = (receiveParams) => {
      this.receiveParamsFromHtml(receiveParams)
    }
  },
  methods: {
    selectTenant (name) {
      this.loginParam.tenantId = name
      this.login()
    },
    receiveParamsFromHtml (res) {
      console.log(res)
    },
    invokeHtmlMethod () {
      window.frames['iframeMap'].lodaTable()
    },
    ...mapMutations([
      'setUserInfo', 'setMenuList', 'setCurrentMenuId'
    ]),
    login () {
      let loginReturn = null
      if (this.loginType === 1) {
        loginReturn = phoneWithPaswordLogin(this.loginParam)
      } else if (this.loginType === 2) {
        loginReturn = phoneLogin(this.loginParam)
      } else {
        loginReturn = tenantCodeLogin(this.loginParam)
      }
      this.handleLoginReturn(loginReturn)
    },
    handleLoginReturn (loginReturn) {
      loginReturn.then(res => {
        if (!res.success && (res.errorCode === '90002' || res.errorCode === '90001')) {
          this.showVerCode = true
        }
        this.setMenuList(res.data.menuList)
        delete res.data.menuList
        this.setUserInfo(res.data)
        setToken(res.data.tokenData)
        this.setCurrentMenuId(null)
        this.$router.push({
          name: this.$config.homeName
        })
      }).catch(e => {})
    },
    handleSubmit ({ userName, password }) {
      this.loginType = 1
      this.loginParam.password = encrypt(password)
      this.initLogin(userName)
    },
    // 短信验证码登入
    handlePhoneLoginSubmit ({ userName, verCode }) {
      this.loginType = 2
      this.loginParam.captcha = verCode
      this.initLogin(userName)
    },
    initLogin (userName) {
      this.loginParam.loginPhone = userName
      preLogin({ loginPhone: userName }).then(response => {
        // 该用户存在多个租户，弹框提示客户选择租户
        let loginDirectly = false
        if (response.data.count <= 0) {
          this.$Message.error('账号不存在！')
        } else if (response.data.count === 1) {
          loginDirectly = true
          this.tenantList = response.data.sysTenantList
          this.loginParam.tenantId = response.data.sysTenantList[0]['tenantId']
        } else {
          this.showTenants = true
          this.tenantList = response.data.sysTenantList
        }
        if (loginDirectly && this.loginParam.tenantId != undefined) {
          this.login()
        }
      })
    }

  },

  mounted () {
    this.setMenuList([])
    this.setUserInfo({})
    setToken()
  }
}
</script>

<style>
.login{min-width:1200px;z-index:99;}
.ivu-card {background:none;padding:30px 40px 0 40px;}
.ivu-card-head { padding:0;height:40px;border: none;margin-bottom: 20px;}
.ivu-card-head p i{border:none;background: url(../../assets/images/logohm.png) no-repeat 0 0;width: 40px;height: 40px;}
.ivu-card-head p{color: #FFF;font-size:24px;line-height:1em;height: 40px;font-weight: 400;}
@media screen and (max-width:1360px) {
  .ivu-card-head p{font-size:22px;}
}
@media screen and (max-width:1260px) {
  .ivu-card-head p{font-size:18px;}
}
.ivu-card-body { padding:0;}
.login-con .login-tip,
.login-con .login-link a:link,
.login-con .login-link a:active,
.login-con .login-link a:visited{color:rgb(255,255,255,0.6) !important;font-size:14px !important;}
.login-con .login-link a:hover{color:#2F54EB !important;}
.login-con .login-link{text-align: center ;}
.login-con .login-link a{display: inline-block;margin:0 10px;}
.animate{position:absolute; left:0;top:0;bottom:0; width:65%;height:100%;z-index:10;}
.aniwave{position:absolute;left:0;right:0; bottom:0; height:500px;z-index:1;opacity:0.5;}
.animate iframe{position:relative; z-index:10;}
.aniwave iframe{position:relative;z-index:1;}
.login-con .ivu-card-head p i { vertical-align: middle;}
.login-con .ivu-tabs { overflow: initial;}
.ivu-tabs-nav {width:100%;}
.ivu-tabs-nav .ivu-tabs-tab { width:50%;text-align: center;font-size:16px;margin-right:0; padding:8px 0; color: #1369bc;font-weight:600;}

.ivu-tabs-nav .ivu-tabs-tab:hover,
.ivu-tabs-nav .ivu-tabs-tab-active {color: #f48b20;}
.ivu-tabs-nav-container:focus .ivu-tabs-tab-focused {
    border-color: #f48b20 !important;
}
.ivu-tabs-ink-bar { background-color: #f48b20;bottom:0;}
.ivu-tabs-nav::after{height:2px; background:#0064a8; width:100%;position:absolute;bottom:-1px;left:0;}
.login-select-box{margin:20px auto; color:#FFF;}
.login-select-box span button{color:#1681e5;}
.login-select-box span button.ivu-btn-text:hover,
.login-select-box span button.ivu-btn-text:active,
.login-select-box span button.ivu-btn-text.active {color:#62dcff;background-color:transparent;border-color: transparent;box-shadow:none;}
.login-select{background:#FFF;border-radius:5px; height:280px; overflow-y:auto; margin:0 auto;}
.login-select .ivu-cell{border-bottom:solid 1px #DDD;font-family: Ionicons;position:relative;}
.login-select .ivu-cell:last-child{border:none;}
.login-select .ivu-cell::after{display:block;content: "\F11F";position:absolute;right:20px;top:12px;}
.login-con .register-msg-btn, .login-con .register-tim-btn {
    display: inline-block;
    width: 130px;
    height: 40px;
    background: #167ee0;
    color: #FFF;
    text-align: center;
    line-height: 42px;
    border-radius: 5px;
    border-top-left-radius:0;
    border-bottom-left-radius:0;
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
}
</style>
