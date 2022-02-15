<template>
  <div class="maincont">
    <div class="devmoni"><Topnav></Topnav></div>
    <div class="whitebox border-bot" style="margin-top:10px;">
      <Dialogue ref="yeluosen" @success="getSdWanDeviceStatistics"></Dialogue>
    </div>
    <div class="whitebox border-bot">
      <Dialoguerate ref="yeluosen1"  @success="getSdWanDeviceStatistics"></Dialoguerate>
    </div>
    <div class="whitebox border-bot">
      <Portbander></Portbander>
    </div>
  </div>
</template>

<script>
import '../traffic.less'
  import Topnav from './device_show_topnav.vue'
  import Dialogue from './devicemoni/dialogue.vue'
  import Dialoguerate from './devicemoni/dialogue-rate.vue'
  import Portbander from './devicemoni/port-bander.vue'
  import {getObjectFromSessionStorage, setObjectToSessionStorage,getDate} from '@/utils'
  import {getSdWanDeviceRunningTime} from "@/api/sdwan";
  export default {
    name: 'Device_moni',
    components: {
      Topnav,
      Dialogue,
      Dialoguerate,
      Portbander
    },
    data() {
      return {
        adomName : '',
        deviceName : '',
        session:''

        }
    }, methods:{
      getSdWanDeviceStatistics(type){
        let data = {};
        data.adomName   = this.adomName;;
        data.deviceName = this.deviceName;
        data.type       = "statistics";
        getSdWanDeviceRunningTime(data).then(res => {
          if(res.data.status.code == 0 && res.data.response.results.session.length > 0) {
            let result = res.data.response.results;
            if (type == undefined) {
              this.$refs.yeluosen.childMethod(result);
              this.$refs.yeluosen1.childMethod(result);
            }else if(type == "session"){
                this.$refs.yeluosen.childMethod( result );
            }else if(type == "session_rate"){
                this.$refs.yeluosen1.childMethod( result );
            }
          }
        });
      }
    },
    mounted () {
      this.deviceName = getObjectFromSessionStorage("deviceName");
      this.adomName   = getObjectFromSessionStorage("sdWanAdom");
      this.getSdWanDeviceStatistics();
    }
  }
</script>

<style>
</style>
