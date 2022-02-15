<template>
  <div class="dev-show-main">
    <div class="devshow"><router-link to="/devinfo_page"></router-link></div>
    <div class="dev-show-box clearfix">
      <div class="affix-devshow">
        <div class="assetboxtl">
          <Devinfo :deviceInfo="deviceInfo"></Devinfo>
        </div>
        <div class="assetboxtr">
          <Colony :attributes="deviceInfo.attributes"></Colony>
        </div>
      </div>
      <!-- <div class="left-cabinet"> -->
      <div class="left-cabinet cab42">
        <div class="relative" >
          <ol>
            <li v-for="(item,index) in cabinetnum"><span>{{ index+1>9?index+1:"0"+(index+1) }}</span></li>
          </ol>
          <div v-for="(item,index) in deviceList" :key="item.deviceId" :class="item.class + ' ' + (current === index ? 'active' : '')"
               v-on:click="onClickRackDevice(item.deviceId,index)"><span><font>{{item.deviceNumber}}</font></span></div>
        </div>
      </div>

    </div>

  </div>
</template>
<script>
  import '../traffic.less'
  import Devinfo from './deviceshow/devinfo.vue'
  import Colony from './deviceshow/colony.vue'
  import { assetDeviceInfo, assetCabinetInfo, assetBmcPowerStatus } from '@/api/asset'
  import { getDeviceType, getBaremetalStatus, getBaremetalPowerStatusClass } from '@/libs/asset'
  export default {
    name: 'deviceinfo',
    components: {
      Devinfo,
      Colony
    },
    data () {
      return {
        current: 0,
        deviceList: [],
        deviceInfo: {
          deviceTypeDictMap: { name: '' },
          deviceStatusDictMap: { name: '' },
          uPosition: ''
        },
        cabinetnum:[],
      }
    },
    methods: {
      getBaremetalPowerStatus (device) {
        if (device.deviceType === 1) {
          assetBmcPowerStatus(device.deviceId).then(ret => {
            this.deviceInfo = device
            if (ret.success === true) {
              device.status = getBaremetalStatus(ret.data.status, device.deviceStatusDictMap.name)
            } else {
              device.status = device.deviceStatusDictMap.name
            }
            this.deviceInfo = device
          })
        } else {
          device.status = device.deviceStatusDictMap.name
          this.deviceInfo = device
        }
      },
      onClickRackDevice (deviceId,index) {
        this.current=index
        assetDeviceInfo(deviceId).then(rsp => {
          if (rsp.success === true) {
            this.deviceInfo = rsp.data
            this.deviceInfo.status = this.deviceInfo.deviceStatusDictMap.name
            // this.getBaremetalPowerStatus(rsp.data)
          }
        })
      }
    },
    mounted () {
      // 测试链接 http://localhost:8080/#/Deview/device_info?cabinetId=327
      for (let i = 0; i < 42; i++) {
        this.cabinetnum.push(i)
      }
      console.log('mounted')
      var cabinetId = this.$route.query.cabinetId
      var deviceIdCur = this.$route.query.deviceId
      assetCabinetInfo(cabinetId).then(res => {
        if (res.success === true) {
          var uIndexMax = 0
          var deviceId = 0
          for (var index in res.data.deviceList) {
            var device = res.data.deviceList[index]
            if (device.uPosition !== '') {
              var uSize = 1
              var uIndex = 0
              var uPosition = device.uPosition.split('-')
              var powerStatusClass = getBaremetalPowerStatusClass(device.powerStatus)
              if(powerStatusClass==='unknown'){
                device.deviceNumber=device.deviceNumber+' 未配置'
              }

              if (uPosition.length === 1) {
                uIndex = parseInt(uPosition)
              } else if (uPosition.length === 2) {
                uIndex = parseInt(uPosition[0])
                uSize = uPosition[1] - uPosition[0] + 1
              } else {
                continue
              }
              if (uIndex > uIndexMax) {
                uIndexMax = uIndex
                deviceId = device.deviceId
              }
              var type = device.deviceType
              var deviceType = getDeviceType(type)
              if (deviceType !== '') {
                device['class'] = deviceType + ' u' + uSize + ' site' + uIndex + ' ' + powerStatusClass
                this.deviceList.push(device)
              }
            }
          }

          //初始化选择设备
          var deviceInit = false
          var deviceInitIndex = 0
          var deviceLastIndex = 0
          for (let index in this.deviceList) {
            var device = this.deviceList[index]
            if(parseInt(deviceId)===device.deviceId){
              deviceLastIndex=parseInt(index)
            }
            if(deviceIdCur&&parseInt(deviceIdCur)===device.deviceId){
              deviceInit=true
              deviceInitIndex=parseInt(index)
            }
          }
          this.current=deviceInit?deviceInitIndex:deviceLastIndex;

          if (uIndexMax > 0) {
            assetDeviceInfo(deviceIdCur? deviceIdCur : deviceId).then(rsp => {
              if (rsp.success === true) {
                this.deviceInfo = rsp.data
                this.deviceInfo.status = this.deviceInfo.deviceStatusDictMap.name
                // this.getBaremetalPowerStatus(rsp.data)
              }
            })
          }
        }
      })
    }
  }
</script>
