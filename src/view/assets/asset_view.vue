<template>
  <div class="mainbox">
    <div class="asset-btn-back"><router-link to="/asset">返回</router-link></div>
    <row :gutter="50">
      <Col span="12">
        <div class="dev-colony">
          <h2>
            <Icon type="md-arrow-dropright" /> 基本信息
          </h2>
          <ul class="dev-info-list">
            <li><label>上架时间</label>{{deviceInfo.shelvesDate || '未知'}}</li>
            <li><label>设备信息</label>{{deviceInfo.deviceNumber || '未知'}}</li>
            <li><label>设备类型</label>{{deviceInfo.deviceTypeDictMap.name || '未知'}}</li>
            <li><label>设备状态</label>{{status || '未知'}}</li>
            <li><label>设备型号</label>{{deviceInfo.deviceBrand || '未知'}}</li>
            <li><label>设备U数</label>{{deviceInfo.uNum || '未知'}}</li>
            <li><label>所属机房</label>{{deviceInfo.roomName || '未知'}}</li>
            <li><label>机房号</label>{{deviceInfo.roomNumber || '未知'}}</li>
            <li><label>机柜号</label>{{deviceInfo.cabinetCode || '未知'}}</li>
            <li><label>U位</label>{{deviceInfo.uPosition.split("-")[0] || '未知'}}</li>
            <li><label>&nbsp;</label>&nbsp;</li>
          </ul>
        </div>
      </Col>
      <Col span="12">
        <div class="dev-colony">
          <h2>
            <Icon type="md-arrow-dropright" /> 软件信息
          </h2>
          <ul class="dev-info-list">
            <li><label>系统主机名</label>{{deviceAttr.hostName}}</li>
            <li><label>操作系统</label>{{deviceAttr.osName}}</li>
            <li><label>操作系统版本</label>{{deviceAttr.osVersion}}</li>
            <li><label>BIOS版本</label>{{deviceAttr.biosVersion}}</li>
            <li><label>固件版本</label>{{deviceAttr.firmwareVersion }}</li>
            <li>
              <label>IP地址</label>
              <Input size="small" v-model="ctraddress" :disabled="ctraddressdis" />
              <Button @click="onClickEditor('ctraddress')" :class="{ 'ctrpassedit': ctraddressedit }" ></Button>
            </li>
            <li>
              <label>管理控制卡密码</label>
              <Input size="small" type="password" password v-model="ctrpass" :disabled="ctrpassdis" />
              <Button @click="onClickEditor('ctrpass')" :class="{ 'ctrpassedit': ctrpassedit }" ></Button>
            </li>
            <li>
              <label>管理控制卡账号</label>
              <Input size="small" v-model="ctrid" :disabled="ctriddis" />
              <Button @click="onClickEditor('ctrid')" :class="{ 'ctridedit': ctridedit }" ></Button>
            </li>
            <li>
              <label>VNC端口</label>
              <Input size="small" v-model="vncport" :disabled="vncportdis" />
              <Button @click="onClickEditor('vncport')" :class="{ 'vncedit': vncportedit }" ></Button>
            </li>
            <li>
              <label>VNC密码</label>
              <Input size="small" type="password" password v-model="vncpass" :disabled="vncpassdis" />
              <Button @click="onClickEditor('vncpass')" :class="{ 'vncpsedit': vncpassedit }" ></Button>
            </li>
            <li><label>&nbsp;</label>&nbsp;</li>
          </ul>
          <div class="asset-tips"><Icon type="md-alert" size="20" /> 温馨提示：修改信息将影响您的控制卡信息，请谨慎修改。</div>
        </div>
      </Col>
    </row>

    <Modal class-name="model-rom-cont" v-model="messagemodel" title="二次验证" width="550" ok-text="确定修改" @on-ok="onConfirmOk" @on-cancel="onConfirmCancel" >
      <div class="model-rom">
        <div class="title-header"><Icon type="md-information-circle" /> 您正在修改 <strong>{{modifyTitle}}</strong></div>
        <div class="title-header" v-show="smsVerified==false"><Icon type="md-information-circle" /> <strong>当前行为需进行二次验证</strong></div>
        <ul v-show="smsVerified==false">
          <li >
            <label>验证码</label>
            <div class="mobret">
              <Input v-model="remark" clearable placeholder="输入验证码…" />
              <span class="register-msg-btn" v-show="show" v-on:click="getCode">发送验证码</span>
              <span class="register-tim-btn" v-show="!show">{{count}} s</span>
            </div>
          </li>
          <li><label> </label><Checkbox v-model="single">30分钟内将不再进行验证</Checkbox></li>
        </ul>
      </div>
    </Modal>

    <Modal class-name="model-rom-cont" v-model="initmodel" title="初始化设备管理卡" width="550" ok-text="确定修改" @on-ok="onInitOk" >
      <div class="model-rom">
        <ul>
          <li >
            <label>IP 地址</label>
            <div class="mobret1">
              <Input v-model="baremetal.ipAddress" clearable placeholder="输入IP地址" />
            </div>
          </li>
          <li >
            <label>用户名</label>
            <div class="mobret1">
              <Input v-model="baremetal.user" clearable placeholder="输入用户名" />
            </div>
          </li>
          <li >
            <label>密码</label>
            <div class="mobret1">
              <Input v-model="baremetal.password" clearable placeholder="输入密码" />
            </div>
          </li>
        </ul>
        <div class="title-header" v-show="smsVerified==false"><Icon type="md-information-circle" /> <strong>当前行为需进行二次验证</strong></div>
        <ul v-show="smsVerified==false">
          <li >
            <label>验证码</label>
            <div class="mobret">
              <Input v-model="remark" clearable placeholder="输入验证码…" />
              <span class="register-msg-btn" v-show="show" v-on:click="getCode">发送验证码</span>
              <span class="register-tim-btn" v-show="!show">{{count}} s</span>
            </div>
          </li>
          <li><label> </label><Checkbox v-model="single">30分钟内将不再进行验证</Checkbox></li>
        </ul>
        
      </div>
    </Modal>


  </div>
</template>
<script>
  import './traffic.less'
  import { assetDeviceInfo, assetBmcPowerStatus, assetIpmiRedfishUpdate, assetIpmiLanUpdate, assetSmsActionSend, assetIpmiLanInit  } from '@/api/asset'
  import { setObjectToSessionStorage, getObjectFromSessionStorage } from '@/utils'
  import { getBaremetalAttributes, getBaremetalStatus } from '@/libs/asset'
  export default {
    data() {
      return {
        status: '托管中',
        deviceInfo: {
          deviceTypeDictMap: { name: '' },
          deviceStatusDictMap: { name: '' },
          uPosition: ''
        },
        deviceAttr: {
          hostName: '未知',
          osName: '未知',
          osVersion: '未知',
          biosVersion: '未知',
          firmwareVersion: '未知',
          ipAddress: '未知'
        },
        ipaddres:'',
        ctraddress: '',
        ctrpass:'',
        ctrid:'',
        vncport:'',
        vncpass:'',
        show:true,
        single: true,
        remark:'',
        count: '',
        modifyTitle: '',
        modifyType: '',
        initmodel: false,
        messagemodel: false,
        ctraddressedit: false,
        ctrpassedit: false,
        ctridedit: false,
        vncpassedit: false,
        vncportedit: false,
        ctraddressdis: true,
        ctrpassdis:true,
        ctriddis:true,
        vncportdis:true,
        vncpassdis:true,
        smsVerified: false,
        baremetal: {
          ipAddress: '',
          password: '',
          user: '',
        }
        }
    },
    methods: {
      getCode() {
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

        assetSmsActionSend(this.modifyType,this.single ? 1 : 0).then(rsp => {
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
      getBaremetalPowerStatus (device) {
        assetBmcPowerStatus(device.deviceId).then(ret => {
          if (ret.success === true) {
            this.status = getBaremetalStatus(ret.data.status, device.deviceStatusDictMap.name)
          }  
        })
      },
      onClickEditor(type) {
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
        if (this.deviceAttr.ipAddress == '未知') {
          this.initmodel = true
          this.modifyType = 'init'
          return
        }
        switch (type) {
          case 'ctraddress':
            if (this.ctraddressedit === false) {
              this.ctraddressedit = true
              this.ctraddressdis = false
            } else {
              this.modifyTitle = 'IP地址'
              this.modifyType = 'ctraddress'
              this.messagemodel = true
            }
            break
          case 'ctrid':
            if (this.ctridedit === false) {
              this.ctridedit = true
              this.ctriddis = false
            } else {
              this.modifyTitle = '帐号'
              this.modifyType = 'ctrid'
              this.messagemodel = true
            }
            break
          case 'ctrpass':
            if (this.ctrpassedit === false) {
              this.ctrpassedit = true
              this.ctrpassdis = false
            } else {
              this.modifyTitle = '密码'
              this.modifyType = 'ctrpass'
              this.messagemodel = true
            }
            break
          case 'vncpass':
            if (this.vncpassedit === false) {
              this.vncpassedit = true
              this.vncpassdis = false
            } else {
              this.modifyTitle = 'VNC密码'
              this.modifyType = 'vncpass'
              this.messagemodel = true
            }
            break
          case 'vncport':
            if (this.vncportedit === false) {
              this.vncportedit = true
              this.vncportdis = false
            } else {
              this.modifyTitle = 'VNC端口号'
              this.modifyType = 'vncport'
              this.messagemodel = true
            }
            break
          default:
            break
        }

      },
      sendAssetIpmiAction(captcha, callback,param) {
        switch (this.modifyType) {
            case 'ctraddress':
              assetIpmiLanUpdate(this.deviceInfo.deviceId, {ipAddress: this.ctraddress}, captcha).then( rsp => {
                if (rsp.success === true) {
                    if (callback) {
                    callback(param)
                  }
                  this.$Message.info('设备配置正在更新，请稍后！')
                } else {
                  if (rsp.errorCode === "8002") {
                    this.$Message.info('短信验证失败')
                  } else {
                    this.$Message.info('设备配置更新失败')
                  }
                }
              })
              break
            case 'ctrid':
              assetIpmiLanUpdate(this.deviceInfo.deviceId, {user: this.ctrid}, captcha).then( rsp => {
                if (rsp.success === true) {
                    if (callback) {
                    callback(param)
                  }
                  this.$Message.info('设备配置正在更新，请稍后！')
                } else {
                  if (rsp.errorCode === "8002") {
                    this.$Message.info('短信验证失败')
                  } else {
                    this.$Message.info('设备配置更新失败')
                  }
                }
              })
              break
            case 'ctrpass':
              assetIpmiLanUpdate(this.deviceInfo.deviceId, {password: this.ctrpass}, captcha).then( rsp => {
                if (rsp.success === true) {
                    if (callback) {
                    callback(param)
                  }
                  this.$Message.info('设备配置正在更新，请稍后！')
                } else {
                  if (rsp.errorCode === "8002") {
                    this.$Message.info('短信验证失败')
                  } else {
                    this.$Message.info('设备配置更新失败')
                  }
                }
              })
              break
            case 'vncpass':
              assetIpmiRedfishUpdate(this.deviceInfo.deviceId, {vncPassword: this.vncpass}, captcha).then( rsp => {
                if (rsp.success === true) {
                    if (callback) {
                    callback(param)
                  }
                  this.$Message.info('设备配置正在更新，请稍后！')
                } else {
                  if (rsp.errorCode === "8002") {
                    this.$Message.info('短信验证失败')
                  } else {
                    this.$Message.info('设备配置更新失败')
                  }
                }
              })
            case 'vncport':
              assetIpmiRedfishUpdate(this.deviceInfo.deviceId, {vncport: this.vncport}, captcha).then( rsp => {
                if (rsp.success === true) {
                    if (callback) {
                    callback(param)
                  }
                  this.$Message.info('设备配置正在更新，请稍后！')
                } else {
                  if (rsp.errorCode === "80002") {
                    this.$Message.info('短信验证失败')
                  } else {
                    this.$Message.info('设备配置更新失败')
                  }
                }
              })
              break
            case 'init':
              assetIpmiLanInit(this.deviceInfo.deviceId, this.baremetal, captcha).then( rsp => {
                if (rsp.success === true) {
                    if (callback) {
                    callback(param)
                  }
                  this.$Message.info('设备配置正在更新，请稍后！')
                } else {
                  if (rsp.errorCode === "80002") {
                    this.$Message.info('短信验证失败')
                  } else {
                    this.$Message.info('设备配置更新失败')
                  }
                }
              })
              break
            default:
              break
          }
      },
      onConfirmOk () {
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
              smsVerify.captcha = captcha
              setObjectToSessionStorage('assetIpmiActionSmsVerify', smsVerify)
              context.smsVerified = true
            }
          }
        }
        this.onConfirmCancel()
        this.sendAssetIpmiAction(captcha, callback, this)
      },
      onConfirmCancel() {
        console.log(this.modifyType)
        switch (this.modifyType) {
          case 'ctraddress':
            this.ctraddressedit = false
            this.ctraddressdis = true
            break
          case 'ctrpass':
            this.ctrpassedit = false
            this.ctrpassdis = true
            break
          case 'ctrid':
            this.ctridedit = false
            this.ctriddis = true
            break
          case 'vncpass':
            this.vncpassedit = false
            this.vncpassdis = true
          case 'vncport':
            this.vncportedit = false
            this.vncportdis = true
          default:
            break
        }
      },
      onInitOk () {
        if (this.baremetal.ipAddress === '') {
          this.$Message.info("IP地址错误")
          return
        }else if (this.baremetal.user === '') {
          this.$Message.info("用户名错误")
          return
        }else if (this.baremetal.password === '') {
          this.$Message.info("密码错误")
          return
        }
        
        var captcha = this.remark
        var callback = null
        var assetIpmiActionSmsVerify = getObjectFromSessionStorage('assetIpmiActionSmsVerify')
        if (assetIpmiActionSmsVerify && assetIpmiActionSmsVerify.mode == 1) {
          if (assetIpmiActionSmsVerify.smsVerified) {
            captcha = assetIpmiActionSmsVerify.captcha
            callback = function(context) {
              context.refishDeviceInfo(context.deviceInfo.deviceId)
            }
          } else {
            callback = function(context) {
              // 更新 验证码验证结果
              var smsVerify = getObjectFromSessionStorage('assetIpmiActionSmsVerify')
              smsVerify.smsVerified = true
              smsVerify.captcha = captcha
              setObjectToSessionStorage('assetIpmiActionSmsVerify', smsVerify)
              context.smsVerified = true
              context.refishDeviceInfo(context.deviceInfo.deviceId)
            }
          }
        }
        this.sendAssetIpmiAction(captcha, callback, this)
      },
      refishDeviceInfo(deviceId) {
        
        assetDeviceInfo(deviceId).then(rsp => {
        if (rsp.success === true) {
          this.deviceInfo = rsp.data
          this.status = this.deviceInfo.deviceStatusDictMap.name
          this.deviceAttr =  Object.assign({}, this.deviceAttr, getBaremetalAttributes(this.deviceInfo.attributes))
          this.deviceAttr =  Object.assign({}, this.deviceAttr, getBaremetalAttributes(this.deviceInfo.attributes, ['user','vncPort','vncStatus']))
          console.log(this.deviceAttr)
          this.ctraddress = this.deviceAttr.ipAddress
          this.ctrpass = ''
          this.ctrid = this.deviceAttr.user
          this.vncport = this.deviceAttr.vncPort
          this.vncpass = ''

          var assetIpmiActionSmsVerify = getObjectFromSessionStorage('assetIpmiActionSmsVerify')
          this.smsVerified = assetIpmiActionSmsVerify ? (assetIpmiActionSmsVerify.smsVerified || false) : false
          this.getBaremetalPowerStatus(this.deviceInfo)
        }
      })
      }
    },
    mounted() {
      var deviceId = this.$route.query.deviceId
      this.refishDeviceInfo(deviceId)
    }

  }
</script>

<style>
  .asset-tips{color:#df3232;line-height:50px;}
</style>
