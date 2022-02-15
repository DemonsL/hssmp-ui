<style>
  @import './info_box.css';
</style>
<template>
  <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="150">
    <div class="info-box">
      <h3>修改密码
        <Icon type="md-lock" size="18" />
      </h3>
      <ul>
        <li><label>账户ID：</label><span>{{getUserInfo.bmsCode}}</span></li>
        <li><label>账户昵称：</label><span>{{getUserInfo.tenantName}}</span></li>
        <li v-if="!checkIsAdmin()"><label>用户名：</label><span>{{getUserInfo.userName}}</span></li>
        <li>
          <FormItem label="当前登录密码：" prop="oldpasswd">
            <Input type="password" v-model="formCustom.oldpasswd" clearable placeholder="输入旧密码…"></Input>
          </FormItem>
        </li>
        <li>
          <FormItem label="请输入新的登录密码：" prop="passwd">
            <Input type="password" @change="changePasswordTip" v-model="formCustom.passwd" clearable placeholder="输入新密码…"></Input>
          </FormItem>
        </li>
        <li>
          <div class="passinsten">
            密码强度：
            <i id="binset01" :class="{'active':binset01}"></i>
            <i :class="{'active':binset02}"></i>
            <i :class="{'active':binset03}"></i><br />
            密码长度 8~30字符<br />
            至少包含字母、数字两种形式。不限特殊字符及空格
          </div>
        </li>
        <li>
          <FormItem label="确认密码：" prop="passwdCheck">
            <Input type="password" v-model="formCustom.passwdCheck" clearable placeholder="确认新密码…"></Input>
          </FormItem>
        </li>
        <li>
          <label>手机号码：</label><span>{{getUserInfo.phone}}</span>
        </li>
        <li>
          <span class="remarkdom">
              <FormItem prop="captcha" label="验证码：">
                <Input v-model="formCustom.captcha"  type="number" clearable placeholder="输入验证码…" />
                <span class="register-msg-btn" v-show="show" v-on:click="getCode">发送验证码</span>
                <span class="register-tim-btn" v-show="!show">{{count}} s</span>
              </FormItem>
          </span>
        </li>
        <li>
          <FormItem >
            <Button type="primary" @click="handleSubmit('formCustom')">提交</Button>
            <Button @click="handleReset('formCustom')" style="margin-left: 8px">清空</Button>
          </FormItem>
        </li>
      </ul>

    </div>
  </Form>
</template>
<script>
import { smsForChangePassword, changePassword, checkOldPass } from '@/api/upms'
import { mapGetters } from 'vuex'
import { encrypt } from '@/utils'
export default {
  data () {
    const validatePass = (rule, value, callback) => {
      var passwordreg = /(?![A-Z]*$)(?![a-z]*$)(?![0-9]*$)(?![^a-zA-Z0-9]*$)/
      console.log(passwordreg.test(value))
      if (value === '') {
        callback(new Error('新密码不能为空！'));
      } else if (!passwordreg.test(value)) {
        callback(new Error('密码必须由大写字母、小写字母、数字、特殊符号中的2种及以上类型组成!'))
      } else if (/[\u4E00-\u9FA5]/g.test(value)) {
        callback(new Error('密码不能输入汉字!'));
      } else if (value.length < 8) {
        callback(new Error('新密码不能少于8位！'));
      } else if (value.length >= 8 && value.length <= 12) {
        this.binset01 = true;
        this.binset02 = false;
        this.binset03 = false;
        callback();
      } else if (value.length > 12 && value.length <= 16) {
        this.binset01 = true;
        this.binset02 = true;
        this.binset03 = false;
        callback();
      } else if (value.length > 16 && value.length <= 30) {
        this.binset01 = true;
        this.binset02 = true;
        this.binset03 = true;
        callback();
      } else if (value.length > 30) {
        callback(new Error('新密码长度不能超过30位！'));
      } else {
        if (this.formCustom.passwdCheck !== '') {
          // 对第二个密码框单独验证
          this.$refs.formCustom.validateField('passwdCheck');
          callback();
        }
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.formCustom.passwd) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    };
    const validateOldpasswd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请先输入旧密码'));
      }
      // 模拟异步验证效果
      checkOldPass({oldPass: encrypt(value)}).then(res => {
        if (!res.success) {
          callback(new Error('请输入正确密码'));
        } else {
          callback();
        }
      }).catch(e => {})
    };
    return {
      binset01: false,
      binset02: false,
      binset03: false,
      show: true,
      timer: null,
      count: '',
      passtxt: 0,
      formCustom: {
        passwd: '',
        passwdCheck: '',
        oldpasswd: '',
        captcha: null
      },
      ruleCustom: {
        passwd: [{
          validator: validatePass,
          trigger: 'blur'
        }],
        passwdCheck: [{
          validator: validatePassCheck,
          trigger: 'blur'
        }],
        oldpasswd: [{
          validator: validateOldpasswd,
          trigger: 'blur'
        }],
        captcha: [ { required: true, message: '请输入验证码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    getCode () {
      smsForChangePassword().then(response => {
        if (response.success) {
          if(response.data && response.data.msg){
            this.$Message.info(response.data.msg)
          }
          this.show = false;
          const TIME_COUNT = 300;
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


        } else {
          this.$Message.error('短信发送失败')
        }
      }).catch(e => {})
    },
    changePasswordTip (isShow) {
      if (isShow) {
        this.binset01 = true;
      } else {
        this.binset01 = false;
      }
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let data = {
            oldPass: encrypt(this.formCustom.oldpasswd),
            newPass: encrypt(this.formCustom.passwd),
            captcha: this.formCustom.captcha
          }
          changePassword(data).then(res => {
            if (res.success) {
              this.$Message.success('修改密码成功!');
            } else {
              this.$Message.error('修改密码失败!');
            }
          }).catch(e => {})
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields();
    }
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  mounted () {
    console.log(this.getUserInfo.isAdmin)
  }
}
</script>
