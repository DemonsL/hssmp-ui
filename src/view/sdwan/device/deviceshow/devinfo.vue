<template>
  <div class="devinfo-box" :data="msg">
    <h2>{{ msg.hostName }}</h2>
    <ul>
      <li><label>系统时间</label>{{ msg.sysTime }}</li>
      <li><label>HA 模式</label>主 - 备</li>
      <li><label>所属集群名</label>{{ msg.ha_group_name }}</li>
      <li><label>集群运行时间</label>{{ msg.start_time.timeDay }} 天 {{ msg.start_time.timeHour }} 小时 {{ msg.start_time.timeMinutes }} 分钟 {{ msg.start_time.timeseconds }} 秒</li>
      <li><label>集群状态变更时间</label>{{ msg.last_change.timeDay }} 天 {{ msg.last_change.timeHour }} 小时 {{ msg.last_change.timeMinutes }} 分钟 {{ msg.last_change.timeseconds }} 秒</li>
    </ul>
    <div class="devinfo-box-rcont">
      <span>IP地址</span>
      <strong>
        <input v-model="msg.ip" readonly="true" id="copydom" />
        <button @click="copyCode"><Icon type="ios-paper-outline" /></button>
      </strong>
      <span>设备运行时间</span>
      <strong>{{ msg.timeDay }} <i>天</i> {{ msg.timeHour }}<i>小时</i> {{ msg.timeMinutes }}<i>分</i> {{ msg.timeseconds }} <i>秒</i> </strong>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    props: ['msg'],
    created() {
      var _this = this;
    },
    methods: {
      copyCode() {
        let dom=document.getElementById("copydom")
        dom.select();
        document.execCommand("Copy");
      }
    },
    watch:{
    },
    mounted () {
    }
  }
</script>
<style>
  .devinfo-box {}

  .devinfo-box h2 {color: #f7a959;font-size: 20px;font-weight: 300;background: url(../../../../assets/images/icon_nav03.png) no-repeat left center;line-height: 48px;padding-left: 60px;}
  .devinfo-box ul {list-style: none;width: 60%;float: left;font-size: 12px;padding-top: 20px;}
  .devinfo-box ul li {line-height: 32px;white-space: nowrap;}
  .devinfo-box ul li label {display: inline-block;width: 130px;font-size: 14px;}
  .devinfo-box-rcont {width: 40%;float: right;padding-top: 20px;}
  .devinfo-box-rcont span {display: block;line-height: 32px;}
  .devinfo-box-rcont strong {font-size: 22px;display: block;font-weight: 400;margin-bottom: 30px;}
  .devinfo-box-rcont strong b {font-weight: 400;}
  .devinfo-box-rcont strong i {font-size: 12px;font-style: normal;}
  .devinfo-box-rcont strong i.ivu-icon-ios-paper-outline {font-size: 16px;margin-left: 5px;cursor: pointer;}
  .devinfo-box-rcont input{border:none;background:none;color:#FFF;width:165px;outline:none;}
  .devinfo-box-rcont button{border:none;background:none; width:40px;height:40px;color:#FFF;font-size:24px;}
</style>
