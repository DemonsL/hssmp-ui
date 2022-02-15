<template>
  <div class="maincont">
    <div class="devrec"><Topnav></Topnav></div>
    <div class="whitebox border-bot" style="margin-top:10px;"><Tube></Tube></div>
    <div class="whitebox border-bot"><Recrount></Recrount></div>
  </div>
</template>

<script>
  import '../traffic.less'
  import Topnav from './device_show_topnav.vue'
  import Tube from './devicerec/rectube.vue'
  import Recrount from './devicerec/recrount.vue'
  export default {
    name: 'Device_rec',
    components: {
      Topnav,
      Tube,
      Recrount
    },
    data() {
      return {

        }
    }
  }
</script>

<style>
</style>
