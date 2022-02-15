
<template>
    <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit" >
      <FormItem prop="userName">
        <Input v-model="form.userName" placeholder="请输入用户名"></Input>
      </FormItem>
      <FormItem prop="password">
        <Input type="password" v-model="form.password" placeholder="请输入密码"></Input>
      </FormItem>
      <FormItem prop="verCode" v-if="showVerCode">
        <Input v-model="form.verCode" name="verCode" placeholder="请输入验证码"></Input>
        <img :src="randCodeImage" @click="handleChangeCheckCode" />
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
import { getCaptchaImage, checkCaptchaImage } from '@/api/upms'
export default {
  name: 'LoginForm',
  props: {
    showVerCode: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' }
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
      randCodeImage: '',
      single: false,
      form: {
        userName: '18938906924',
        password: '12345678',
        verCode: 'WEWEWEW'
      }
    }
  },
  computed: {
    rules () {
      return {
        userName: this.userNameRules,
        password: this.passwordRules,
        verCode: this.verCodeRules
      }
    }
  },
  mounted () {
    this.handleChangeCheckCode()
  },
  methods: {
    handleChangeCheckCode () {
      getCaptchaImage().then(res => {
        this.randCodeImage = 'data:image/png;base64,' + res.data.image;
        window.sessionStorage.setItem('captcha_token', res.data.token)
      })
    },
    handleSubmit () {
      // 验证图形验证码
      if (this.showVerCode) {
        let data = {
          token: window.sessionStorage.getItem('captcha_token'),
          captcha: this.form.verCode
        }
        checkCaptchaImage(data).then(res => {
          if (res.success) {
            this.$refs.loginForm.validate((valid) => {
              if (valid) {
                this.$emit('on-success-valid', {
                  userName: this.form.userName,
                  password: this.form.password
                })
              }
            })
          }
        }).catch(e => {})
      } else {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.$emit('on-success-valid', {
              userName: this.form.userName,
              password: this.form.password
            })
          }
        })
      }
    }
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
</style>
