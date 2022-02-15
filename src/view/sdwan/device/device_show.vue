<template>
  <div class="maincont">
    <div class="devshow"><Topnav></Topnav></div>
    <div class="mainbox">
      <div class="devsboxtl">
        <Devinfo :msg="sysInfo"></Devinfo>
      </div>
      <div class="devsboxtr">
        <Colony ref="yeluosen4"  @success="refresh"></Colony>
      </div>

      <div class="devsboxbw" >
        <h4>CPU & 内存的使用率

          <Icon type="md-refresh" @click="getSdWanDeviceStatistics(true)" />
          <Select v-model="timebox" style="width:130px;float:right"  @on-change="select">
            <Option v-for="item in selTime" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </h4>
        <Row style="height:50%;margin-top:15px;">
          <Col span="6" style="height:100%;"><Cpuclock style="height:100%;"  ref="yeluosen3"></Cpuclock></Col>
          <Col span="18" style="height:100%;"><Cpuchart style="height:100%;" ref="yeluosen"></Cpuchart></Col>
        </Row>
        <Row style="height:50%;">
          <Col span="6" style="height:100%;"><Ramclock style="height:100%;"  ref="yeluosen2"></Ramclock></Col>
          <Col span="18" style="height:100%;"><Ramchart style="height:100%;" ref="yeluosen1"></Ramchart></Col>
        </Row>
        <Spin fix v-if="spinShow">
          <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
          <div>Loading</div>
        </Spin>
      </div>

    </div>
  </div>
</template>
<script>
  import '../traffic.less'
  import Topnav from './device_show_topnav.vue'
  import Devinfo from './deviceshow/devinfo.vue'
  import Colony from './deviceshow/colony.vue'
  import Cpuclock from './deviceshow/cpuclock.vue' //cpu仪表盘
  import Cpuchart from './deviceshow/cpuchart.vue' //cpu表
  import Ramclock from './deviceshow/ramclock.vue' //内存仪表盘
  import Ramchart from './deviceshow/ramchart.vue' //内存表
  import {getSdWanDeviceSummary,getSdWanDeviceRunningTime,getSdWanDeviceHaMember} from "@/api/sdwan";
  import {getObjectFromSessionStorage, setObjectToSessionStorage,getDate} from '@/utils'
  export default {
    name: 'Device_show',
    components: {
      Topnav,
      Devinfo,
      Colony,
      Cpuclock,
      Cpuchart,
      Ramclock,
      Ramchart
    },
    data() {
      //获取数据的方法
      return {
        timebox: '1-min',
        selTime: [{
          value: '1-min',
          label: '最近1分钟'
        },
          {
            value: '10-min',
            label: '最近10分钟'
          },
          {
            value: '30-min',
            label: '最近30分钟'
          },
          {
            value: '1-hour',
            label: '最近1小时'
          },
          {
            value: '12-hour',
            label: '最近12小时'
          },
          {
            value: '24-hour',
            label: '最近24小时'
          },
        ],
        msg: {},
        sysInfo:{
          "hostName":'' ,
          "sysTime": '',
          "ip" :'',
          "timeDay":'',
          "timeHour":'',
          "timeMinutes":'',
          'last_change':{'timeDay' : '','timeHour':'','timeMinutes':'','timeseconds':''},
          'start_time':{'timeDay' : '','timeHour':'','timeMinutes':'','timeseconds':''},
          'ha_group_name': '',
          },//系统时间
        series : [],
        seriesTime : [],
        cpuNum: [],
        mem:{},
        deviceName :'',
        adomName :'',
        spinShow: false
      }
    },
    methods:{
      refresh(){
        this.getHaMember();
      },
      getDeviceSummary(){
        let data = {};
        data.deviceName = this.deviceName;
        getSdWanDeviceSummary(data).then(res => {  //获取设备基本信息
          this.sysInfo.hostName = res.data.sysInfo.hostName.value; //主机名
          this.sysInfo.sysTime  = res.data.sysInfo.sysTime.value; //系统时间
          this.sysInfo.ip       = res.data.connection.ip.value ? res.data.connection.ip.value : "-";  //ip地址
        });
      },getSdWanDeviceRunningTime(){
          let data = {};
          data.adomName   = this.adomName;
          data.deviceName = this.deviceName;
          data.type       = "RunningTime";
          getSdWanDeviceRunningTime(data).then(res => {
            let date1   = parseInt(res.data.response.results.snapshot_utc_time) / 1000;
            let date2   = parseInt(res.data.response.results.utc_last_reboot) / 1000;
            var dateObj = getDate(date1,date2);
            this.sysInfo.timeDay     = dateObj.timeDay;
            this.sysInfo.timeHour    = dateObj.timeHour;
            this.sysInfo.timeMinutes = dateObj.timeMinutes;
            this.sysInfo.timeseconds = dateObj.timeseconds;
          });
      }, getSdWanDeviceStatistics(type = false){
          this.spinShow = type == true ?   true  : false;
          let data = {};
          data.adomName   = this.adomName;;
          data.deviceName = this.deviceName;
          data.type       = "statistics";
          let time_box = this.timebox;
          getSdWanDeviceRunningTime(data).then(res => {
          let dateTime = []; let dataTime = []; let CpuchartData = []; let cupRate = '';
            if(res.data.status.code == 0 && res.data.response.results.cpu.length > 0){
              res.data.response.results.cpu.forEach(function(item, index){
                if(index == 0){
                  cupRate = item.current;
                  item.historical[time_box].values.forEach(function(value,key){
                    var time = new Date(value[0]);
                    dateTime.unshift(time.getHours() + ":" + (time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes()));
                  })
                }else{
                  let Cpuchart = {};
                  Cpuchart.name = "Cpu"+ index;
                  Cpuchart.type = "line";
                  Cpuchart.stack= "总量";
                  dataTime[index] = new Array();
                  item.historical[time_box].values.forEach(function(value,key){
                    dataTime[index].unshift(value[1]);
                  })
                  Cpuchart.data = dataTime[index];
                  CpuchartData.push(Cpuchart);
                }
              })
            }

            this.series = CpuchartData;
            this.seriesTime = dateTime;
            this.$refs.yeluosen.childMethod(this.series,this.seriesTime);
            this.$refs.yeluosen3.childMethod(cupRate);
            this.getMemData(res);
            this.spinShow = false;

          });
      },getMemData(res){
        let memDate = []; let memData = []; let memDataJson = {};let memDataArr = [];
        if(res.data.response.results.mem){
            this.mem.current = res.data.response.results.mem[0].current;
            res.data.response.results.mem[0].historical[this.timebox].values.forEach(function(item, index){
              var time = new Date(item[0]);
              memDate.unshift(time.getHours() + ":" + (time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes()));
              memData.unshift(item[1]);
            })

          memDataJson.name ="内存"
          memDataJson.type ="line"
          memDataJson.stack="总量"
          memDataJson.data = memData;
          memDataArr.push(memDataJson);
          this.mem.memDate = memDate;
          this.mem.memData = memDataArr;
          this.$refs.yeluosen1.childMethod(this.mem);
          this.$refs.yeluosen2.childMethod(this.mem);
        }
      },getHaRuningTime(){ //获取HA状态
        let data = {};
        data.adomName   = this.adomName;
        data.deviceName = this.deviceName;
        data.type       = "ha";
        getSdWanDeviceRunningTime(data).then(res => {
           let dateObj = {};
            if(res.data.status.code == 0){
              let timestamp = Date.parse(new Date()) / 1000;
              this.sysInfo.last_change = getDate(timestamp,res.data.response.results.last_change); //集群状态变更时间
              this.sysInfo.start_time  = getDate(timestamp,res.data.response.results.start_time); //运行时间
            }
        })
      },getHaMember(){  //获取HA成员
        let data = {};
        data.adomName   = this.adomName;
        data.deviceName = this.deviceName;
        getSdWanDeviceHaMember(data).then(res => {
          let colonyList = []
          if(res.data.code == 0){
           this.sysInfo.ha_group_name = res.data.data.result[0].data.ha_group_name;
           if(res.data.data.result[0].data.ha_slave.length > 0){
             res.data.data.result[0].data.ha_slave.forEach(function(item, index){
               let data = {};
               data.name    = item.name;
               data.serial  = item.sn;
               data.role    = item.role == 1  ? '主' : '备';
               data.pri     = item.prio;
               colonyList.push(data);
             })
           }
          }
          this.$refs.yeluosen4.childMethod(colonyList);
        })
      },
      select:function(){
        this.getSdWanDeviceStatistics(true);
      }
    },
    mounted () {
      this.adomName  = getObjectFromSessionStorage('sdWanAdom');
      this.deviceName = this.$route.query.deviceName ? this.$route.query.deviceName : getObjectFromSessionStorage('deviceName');
      this.getDeviceSummary(this.deviceName);
      this.getSdWanDeviceRunningTime(this.deviceName);
      this.getSdWanDeviceStatistics();
      this.getHaRuningTime();
      this.getHaMember();
      setObjectToSessionStorage('deviceName',this.deviceName);

    }
  }
</script>
<style>

</style>
