<template>
  <div class="dev-colony">
    <h4>
      <Icon type="md-arrow-dropright" /> 基本信息
    </h4>
    <ul class="dev-info-list">
      <li><label>系统主机名</label>{{deviceAttr.hostName}}</li>
      <li><label>操作系统</label>{{deviceAttr.osName}}</li>
      <li><label>操作系统版本</label>{{deviceAttr.osVersion}}</li>
      <li><label>BIOS版本</label>{{deviceAttr.biosVersion}}</li>
      <li><label>固件版本</label>{{deviceAttr.firmwareVersion}}</li>
      <li><label>IP地址</label>{{deviceAttr.ipAddress}}</li>
      <!-- <li><label>IDRAC MAC 地址</label>90:B1:1C:0A:6E:18</li> -->
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    attributes: {
      type: Array
    }
  },
  data () {
    return {
      deviceAttr: {
        hostName: '未知',
        osName: '未知',
        osVersion: '未知',
        biosVersion: '未知',
        firmwareVersion: '未知',
        ipAddress: '未知'
      }
    }
  },
  watch: {
    attributes: {
      immediate: true, // 这句重要
      handler (data) {
        this.deviceAttr = {
          hostName: '未知',
          osName: '未知',
          osVersion: '未知',
          biosVersion: '未知',
          firmwareVersion: '未知',
          ipAddress: '未知'
        }
        if (data === undefined) {
          return
        }
        var keys = ['hostName', 'osName', 'osVersion', 'biosVersion', 'firmwareVersion', 'ipAddress']
        for (var j = 0, len = data.length; j < len; j++) {
          var key = data[j]['key']
          var value = data[j]['value']
          if (keys.indexOf(key) < 0) {
            continue
          }
          if (value !== '') {
            this.deviceAttr[key] = value
          }
        }
      }
    }
  }
}
</script>

<style>
  .dev-info-list{line-height:50px;list-style:none;margin-top: 15px;}
  .dev-info-list li{padding:0 40px;text-align:right;}
  .dev-info-list li:nth-child(odd){background-color:#f0f0f0; }
  .dev-info-list li label{float:left;}
</style>
