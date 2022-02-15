<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="userName">
      <Input v-model="form.userName" placeholder="请输入手机号码"></Input>
    </FormItem>
    <FormItem prop="verCode">
      <Input v-model="form.verCode" name="verCode" placeholder="请输入验证码"></Input>
      <span class="register-msg-btn" v-show="show" v-on:click="getCode">发送验证码</span>
      <span class="register-tim-btn" v-show="!show">{{count}} s</span>
    </FormItem>
    <FormItem>
      <Checkbox v-model="single">记住登录名</Checkbox>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long>登录</Button>
    </FormItem>
  </Form>
</template>
<script>
import { getSmsCode } from '@/api/upms'
export default {
  name: 'LoginForm',
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ]
      }
    },
    verCodeRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  data () {
    return {
      single: false,
      show: true,
      timer: null,
      count: '',
      form: {
        userName: '',
        verCode: '',
      }
    }
  },
  computed: {
    rules () {
      return {
        userName: this.userNameRules,
        verCode: this.verCodeRules
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            userName: this.form.userName,
            verCode: this.form.verCode
          })
        }
      })
    },
    getCode() {


      //发送请求获取短信验证码
      let data = {
        loginPhone: this.form.userName
      }
      getSmsCode(data).then(res=>{
        if(res.success){
          if(res.data && res.data.msg){
            this.$Message.info(res.data.msg)
          }
          this.show = false;
          const TIME_COUNT = 60;
          if (!this.timer) {
            this.count = TIME_COUNT;
            this.show = false;
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--;
              } else {
                this.show = true;
                clearInterval(this.timer);
                this.timer = null;
              }
            }, 1000)
          }
          //提交
          this.handleSubmit()
        }
      }).catch(e=>{})

    },
    changePasswordTip(isShow) {
      if (isShow) {
        this.binset01 = true;
      } else {
        this.binset01 = false;
      }
    },
  }
}
</script>
<style>
.login-con .ivu-form-item-content { font-size: 16px;  }
.login-con .ivu-form-item-content img{position:absolute; right:0; top:0;width:35%; max-width:120px; height:40px;border-radius:3px;}
.login-con .ivu-input-group-prepend, .ivu-input-group-append{background: none;border: none;padding:0 0;}
.login-con .ivu-input { background:#0a3051 url(../../assets/images/ico_login.png) no-repeat 0 0;box-shadow: 0 0 5px #0e5597;border: none;font-size: 16px;height:40px; line-height: 40px;color: #FFF;outline:none; padding-left:40px;}
.login-con .ivu-input:focus{border: none;box-shadow: 0 0 10px #1890ff;}
.login-con input.ivu-input::-webkit-input-placeholder { color: #0f5493 !important; }
.login-con input.ivu-input:-moz-input-placeholder{ color: #0f5493 !important; }
.login-con input.ivu-input:-ms-input-placeholder { color: #0f5493 !important; }
.login-con input.ivu-input[type='password']{background-position:0 -50px;}
.login-con input.ivu-input[name='verCode']{background-position:0 -100px;width:60%; max-width:190px ;}
.login-con .ivu-form-item-error-tip {font-size: 12px; color: #db4443;background:url(../../assets/images/icon_login_err.png) no-repeat left 3px;padding-left:18px;}
.login-con .ivu-form-item-error .ivu-input { border:none;}
.login-con .ivu-form-item-error .ivu-input-group-prepend,
.login-con .ivu-form-item-error .ivu-input-group-append { background:none;border:none;}
.login-con .ivu-btn-primary{ color: #FFF; background-color: #e8841e;border: none;height:40px;font-size:16px;}
.login-con .ivu-btn-primary:active, .ivu-btn-primary.active { background-color: #e8841e;}
.login-con .ivu-btn-primary:hover{box-shadow: inset 0 0 10px #ffc385; background-color: #e8841e;}
.login-con .ivu-checkbox-wrapper { font-size: 14px;color: #1890ff;}
.login-con .ivu-checkbox-inner{border:solid 1px #1890ff;background:none;border-radius:0; margin-right: 5px;}
.register-msg-btn,
.register-tim-btn{display:inline-block;width:113px;height: 42px;background:#167ee0; color:#FFF; text-align: center;line-height: 42px;border-radius: 5px;position: absolute;right:0; top:0;cursor: pointer;}
.register-tim-btn{background:#999;cursor:default;}
</style>
