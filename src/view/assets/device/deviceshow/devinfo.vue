<template>
  <div class="assetinfo-box">
    <div class="clearfix">
      <div class="devinfo-box-left">
        <div class="info-title icondev01"><label>设备信息</label>{{deviceInfo.deviceNumber || '未知'}}</div>
        <div class="info-title icondev02"><label>设备类型</label>{{deviceInfo.deviceTypeDictMap.name || '未知'}}</div>
        <div class="info-title icondev03" ><label>设备状态</label>{{status || '未知'}}</div>
      </div>
      <ul>
        <li><label>上架时间</label>{{deviceInfo.shelvesDate || '未知'}}</li>
        <li><label>设备型号</label>{{deviceInfo.deviceBrand || '未知'}}</li>
        <li><label>设备U数</label>{{deviceInfo.uNum || '未知'}}</li>
        <li><label>所属机房</label>{{deviceInfo.roomName || '未知'}}</li>
        <li><label>机 房 号</label>{{deviceInfo.roomNumber || '未知'}}</li>
        <li><label>机 柜 号</label>{{deviceInfo.cabinetCode || '未知'}}</li>
        <li><label>U 位</label>{{deviceInfo.uPosition.split("-")[0] || '未知'}}</li>
      </ul>
    </div>

    <div class="devinfo-btn-form clearfix">
      <button class="open" @click="onOpenModel('up')" :disabled="switchDisabled.open">开机</button>
      <button class="close"  @click="onOpenModel('down')" :disabled="switchDisabled.close">关机</button>
      <button class="restart" @click="onOpenModel('reset')" :disabled="switchDisabled.restart">重启</button>
      <button class="control" @click="onOpenModel('vnc')" :disabled="switchDisabled.control">控制台</button>
    </div>

    <Modal class-name="model-rom-cont" v-model="openmodel" title="二次验证" width="550" @on-ok="onOk()" @on-cancel="onCancel"  ok-text="确定">
      <div class="model-rom">
        <div class="title-header"><Icon type="md-information-circle" />您所选的设备 <strong>{{deviceInfo.deviceNumber}}</strong> 将执行 <strong>{{actionName}}</strong> 操作</div>
        <ul>
          <li><label>设备型号</label>{{deviceInfo.deviceNumber || '未知'}}</li>
          <li><label>所属机房</label>{{deviceInfo.roomName || '未知'}}</li>
          <li><label>机房号</label>{{deviceInfo.roomNumber || '未知'}}</li>
          <li><label>机柜号</label>{{deviceInfo.cabinetCode || '未知'}}</li>
          <li><label>U位</label>{{deviceInfo.uPosition.split("-")[0] || '未知'}}</li>
          <li><label>IP 地址</label>{{deviceInfo.ipmiIpAddress || '未知'}}</li>
          <!-- <li><label>MAC 地址</label>7</li> -->
          <!-- <li><label>手机号码</label>13652401124</li> -->
          <li v-show="smsVerified==false">
            <label>验证码</label>
            <div class="mobret">
              <Input v-model="remark" clearable placeholder="输入验证码…" />
              <span class="register-msg-btn" v-show="show" v-on:click="getCode">发送验证码</span>
              <span class="register-tim-btn" v-show="!show">{{count}} s</span>
            </div>
          </li>
          <li v-show="smsVerified==false"><label> </label><Checkbox v-model="single">30分钟内将不再进行验证</Checkbox></li>
        </ul>
      </div>
    </Modal>

    <Modal class-name="model-rom-cont" v-model="messagemodel" title="通知" width="550" @on-ok="tourl" @on-cancel="onReload" ok-text="立即前往">
      <div class="model-rom">
        <div class="title-header">已发送 <strong>{{actionName}}</strong> 命令，请前住<b>执行记录查</b>看执行结果！</div>
      </div>
    </Modal>

  </div>
</template>

<script>
import '../../traffic.less'
import { assetBmcPowerAction, assetSmsActionSend, assetBmcPowerStatus,assetBmcVncUrl } from '@/api/asset'
import { setObjectToSessionStorage, getObjectFromSessionStorage } from '@/utils'
import { getBaremetalStatus } from '@/libs/asset'
import {random} from "../../../../utils"
export default {
  props: {
    deviceInfo: {
      type: Object
    }
  },
  data () {
    return {
      status: '托管中',
      actionCode: '',
      actionName: '',
      openmodel: false,
      messagemodel: false,
      single: true,
      show: true,
      smsVerified: false,
      smsSended: false,
      remark: '',
      count: '',
      switchDisabled: {
        open: true,
        close: true,
        restart: true,
        control: true
      }
    }
  },
  watch: {
    deviceInfo: {
      immediate: true, // 这句重要
      handler (val) {
        this.status = getBaremetalStatus(this.deviceInfo.powerStatus, this.deviceInfo.deviceStatusDictMap.name)
        if (this.deviceInfo.deviceType === 1) {
          var assetIpmiAction = getObjectFromSessionStorage('assetIpmiAction')
          if (assetIpmiAction && assetIpmiAction.smsVerified !== undefined) {
            this.smsVerified = assetIpmiAction.smsVerified
            this.smsSended = assetIpmiAction.smsSended
          } else {
            this.smsVerified = false
          }
          if (this.status === '托管中') {
            this.switchDisabled = {
              open: true,
              close: true,
              restart: true,
              control: true
            }
          } else if (this.status === '开机') {
            // 设备已开机
            this.switchDisabled.close = false
            this.switchDisabled.restart = false
            this.switchDisabled.open = true
          } else if (this.status === '关机') {
            // 设备已关机
            this.switchDisabled.close = true
            this.switchDisabled.restart = true
            this.switchDisabled.open = false
          } else {
            // 设备错误
            this.switchDisabled.close = true
            this.switchDisabled.restart = true
            this.switchDisabled.open = true
          }
          // 查询管理卡地址,vnc 是否开启
          for (var j = 0, len = this.deviceInfo.attributes.length; j < len; j++) {
            if (this.deviceInfo.attributes[j]['key'] === 'ipAddress') {
              this.deviceInfo.ipmiIpAddress = this.deviceInfo.attributes[j]['value']
            } else if (this.deviceInfo.attributes[j]['key'] === 'vncStatus') {
              this.switchDisabled.control = this.deviceInfo.attributes[j]['value'] !== 'Enabled'
            }
          }
          
        } else {
          this.switchDisabled = {
            open: true,
            close: true,
            restart: true,
            control: true
          }
        }

      }
    }
  },
  methods: {
    getCode () {
      this.show = false
      const TIME_COUNT = 60
      if (!this.timer) {
        this.count = TIME_COUNT
        this.show = false
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--
          } else {
            this.show = true
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }

      assetSmsActionSend('power',this.single ? 1 : 0).then(rsp => {
        if (rsp.success !== true) {
          this.$Message.info('短信验证码发送失败')
          this.show = true
          clearInterval(this.timer)
          this.timer = null
        } else {
          this.$Message.info('短信验证码发送成功')
          setObjectToSessionStorage('assetIpmiActionSmsVerify', {  captcha: '', timeStamp: rsp.data,smsVerified: false, mode: this.single ? 1 : 0 })
        }
      })
    },
    changePasswordTip (isShow) {
      if (isShow) {
        this.binset01 = true
      } else {
        this.binset01 = false
      }
    },
    sendAssetIpmiAction (captcha, actionCode, callback, param) {
      if (actionCode === 'vnc') {
        assetBmcVncUrl(this.deviceInfo.deviceId, captcha).then(rsp => {
          
          if (rsp.success) {
            if (callback) {
              callback(param)
            }
            window.open(rsp.data,'控制台', 'height=800, width=1030, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no')
          } else {
            if (rsp.errorCode === "80002") {
              this.$Message.info('设备 ' + this.actionName + '短信验证失败')
            } else {
              this.$Message.info('设备 ' + this.actionName + ' 操作失败')
          }
          }
        })
      } else {
        assetBmcPowerAction(this.deviceInfo.deviceId, actionCode, captcha).then(rsp => {
        if (rsp.success === true) {
          if (callback) {
            callback(param)
          }
          this.messagemodel = true
        } else {
          if (rsp.errorCode === "80002") {
            this.$Message.info('设备 ' + this.actionName + '短信验证失败')
          } else {
            this.$Message.info('设备 ' + this.actionName + ' 操作失败')
          }
        }
      })
      }
    },
    onOk () {
      switch (this.actionCode) {
        case 'up':
          this.actionName = '开机'
          break
        case 'down':
          this.actionName = '关机'
          break
        case 'restart':
          this.actionName = '重启'
          break
        case 'vnc':
          this.actionName = '打开控制台'
          break
      }

      var captcha = this.remark
      var callback = null
      var assetIpmiActionSmsVerify = getObjectFromSessionStorage('assetIpmiActionSmsVerify')
      if (assetIpmiActionSmsVerify && assetIpmiActionSmsVerify.mode == 1) {
        if (assetIpmiActionSmsVerify.smsVerified) {
          captcha = assetIpmiActionSmsVerify.captcha
        } else {
          callback = function(context) {
            // 更新 验证码验证结果
            var smsVerify = getObjectFromSessionStorage('assetIpmiActionSmsVerify')
            smsVerify.smsVerified = true
            smsVerify.captcha = context.remark
            setObjectToSessionStorage('assetIpmiActionSmsVerify', smsVerify)
            context.smsVerified = true
          }
        }
      }
      this.sendAssetIpmiAction(captcha, this.actionCode, callback, this)
      },
    onOpenModel (actionCode) {
      var assetIpmiActionSmsVerify = getObjectFromSessionStorage('assetIpmiActionSmsVerify')
        if (assetIpmiActionSmsVerify) {
           if (assetIpmiActionSmsVerify.mode == 0) {
             this.smsVerified = false
             setObjectToSessionStorage('assetIpmiActionSmsVerify','')
           }else if (assetIpmiActionSmsVerify.mode == 1 && assetIpmiActionSmsVerify.timeStamp && (assetIpmiActionSmsVerify.timeStamp < Date.parse(new Date()))) {
             this.smsVerified = false
             setObjectToSessionStorage('assetIpmiActionSmsVerify','')
           } else {
             this.smsVerified = assetIpmiActionSmsVerify.smsVerified
           } 
        }
      switch (actionCode) {
        case 'up':
          this.actionName = '开机'
          break
        case 'down':
          this.actionName = '关机'
          break
        case 'reset':
          this.actionName = '重启'
          break
        case 'vnc':
          this.actionName = '打开控制台'
          break
      }
      this.actionCode = actionCode
      this.openmodel = true
    },
    onCancel () {
      // this.$Message.info('Clicked cancel')
    },
    checkBmcPowerStatus() {
      var ret = false
      return new Promise((resolve, reject) => {
        assetBmcPowerStatus(this.deviceInfo.deviceId).then(ret => {
          if (ret.success === true) {
            // console.log('checkBmcPowerStatus: ' + this.actionCode)
            var status = getBaremetalStatus(ret.data.status, this.deviceInfo.deviceStatusDictMap.name)
            ret = this.actionCode == 'down' ? this.status == '关机' : this.status == '开机'
            this.status = status
          } else {
            this.status = '关机'
          }
          if (this.status === '开机') {
            // 设备已开机
            this.switchDisabled.close = false
            this.switchDisabled.restart = false
            this.switchDisabled.open = true
          } else if (this.status === '关机'){
            // 设备已关机
            this.switchDisabled.close = true
            this.switchDisabled.restart = true
            this.switchDisabled.open = false
          } else {
            // 设备错误
            this.switchDisabled.close = true
            this.switchDisabled.restart = true
            this.switchDisabled.open = true
          }
          resolve(ret)
        })
      })
    },
    async reloadBmcPowerStatus () {
      var result = await this.checkBmcPowerStatus()
      if (result) {
        clearInterval(this.timer)
        this.timer = null
      }
    },
    onReload () {
      // var count = 20
      // this.timer = setInterval(() => {
      //   count--
      //   this.reloadBmcPowerStatus()
      //   if ( count < 1) {
      //     console.log('stop timer')
      //     clearInterval(this.timer)
      //     this.timer = null
      //   }
      // }, 1000)
      this.$router.push('/Deview/device_info?cabinetId=' + this.deviceInfo.cabinetId + '&deviceId=' + this.deviceInfo.deviceId).then (rsp =>{
        window.location.reload()
      })
    },
    tourl () {
      this.$router.push({
        name: 'runlog'
      })
    }
  }
}
</script>
