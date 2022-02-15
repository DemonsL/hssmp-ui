<template>
  <div class="devtopnav">
    <router-link type="primary" to="/Device/device_page" replace class="devtoback">返回</router-link>
    <router-link to="/Device/device_info" class="active1">基本信息</router-link>
    <router-link to="/Device/device_moni" class="active2">网络监控</router-link>
    <router-link to="/Device/device_recouce" class="active3">资源监控</router-link>
  </div>
</template>
<script>
export default {
  name: 'Topnav',
  data() {
    return {
      isActive:null
      }
   }
}
</script>
<style lang="less">

</style>
