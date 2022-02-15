<template>
  <div class="dialogbox">
    <h4>接口带宽
      <div class="select-box">
        <Select v-model="namebox" style="width:130px;" @on-change="getSdWanDeviceInterfaceBandwidth1">
          <Option v-for="item in selName" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select v-model="timebox" style="width:130px;margin-left:10px;" @on-change="getSdWanDeviceInterfaceBandwidth1">
          <Option v-for="item in selTime" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <Icon type="md-refresh" @click="refresh"/>
    </h4>
    <div style="position: relative;">
      <div ref="dom" style="height:350px;"></div>
      <Spin fix v-if="spinShow">
        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
        <div>Loading</div>
      </Spin>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import {getSdWanDeviceInterfaceBandwidth,getSdWanDeviceForwardSelect} from "@/api/sdwan";
  import {
    on,
    off
  } from '@/libs/tools'
  import {getObjectFromSessionStorage} from "@/utils";
  export default {
    name: 'Cpuchart',
    data() {
      return {
        spinShow:false,
        dom: null,
        selTime: [
          {
            value: 'hour',
            label: '最近1小时'
          },
          {
            value: 'day',
            label: '最近24小时'
          },{
            value: 'week',
            label: '上周'
          }
        ],
        selName: [],
        timebox: 'hour',
        namebox: '',
        option : {
          color: ['#bdd732', '#f09932', '#2ef1af', '#f1532e', '#5f5bf9'],
          title: {
            text: '暂无数据',
            top: "center",
            show:false,
            left:0,
            textStyle: {
              color: '#1b63c0',
              fontWeight: '600',
              fontSize: 16
            }
          },
          tooltip: {
            trigger: 'axis',
            formatter: function(a){
              let list = []
              let listItem = ''
              for (var i = 0; i < a.length; i++) {
                list.push(
                  '<i style="display: inline-block;width: 10px;height: 10px;background: ' +
                  a[i].color +
                  ';margin-right: 5px;border-radius: 50%;}"></i><span style="width:70px; display:inline-block;">' +
                  a[i].seriesName +
                  '</span>&nbsp&nbsp：' +
                  a[i].value +
                  'kbps'
                )
              }
              listItem = list.join('<br>')
              return '<div class="showBox">' + listItem + '</div>'
            }
          },
          legend: {
            x: 'right',
            top:'30',
            right:'20',
            icon: 'circle'
          },
          grid: {
            left: '0',
            right: '20',
            bottom: '40',
            containLabel: true
          },
          dataZoom: [{
            type: 'inside',
            start: 0,
            end: 100
          }, {
            start: 0,
            end: 100
          }],
          toolbox: {
            show: false,
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            name: 'Inbound',
            type: 'line',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
            {
              name: 'Outbound',
              type: 'line',
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
          ]
        },
        adomName: '',
        deviceName:''
      }
    },
    methods: {
      resize() {
        this.dom.resize()
      },
      refresh(){

        this.spinShow = true;
        this.getSdWanDeviceInterfaceBandwidth1();
      },
      getSdWanDeviceInterfaceBandwidth1(){
        let data = {};
        data.adomName     = this.adomName;;
        data.deviceName   = this.deviceName;
        data.interfaceType= this.namebox;//"lan2";
        data.timePeriod   =  this.timebox;
        getSdWanDeviceInterfaceBandwidth(data).then(res => {
          let Arr = ['rx','tx'];   let dataArr = [];let dateArr = [];         // rx 入口 tx 出口
          if(res.success != false && res.data.status.code == 0){
            Arr.forEach(function(v,k){
              let dataJson = {"name": "" , "type" : "", "data" : []};
              dataJson.name =  v == "rx"  ?  "Inbound" : "Outbound";
              dataJson.type = "line";
              res.data.response.results[v].forEach(function(value,key){
                  var time = new Date(value.utc_ms);
                  if(v == 'rx'){
                    dateArr.push(time.getHours() + ":" + (time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes()));
                  }
                  dataJson.data.push(value.bps / 1000);
              })
              dataArr.push(dataJson);
            })
            this.option.series     = dataArr;
            this.option.xAxis.data = dateArr;
            this.dom.setOption(this.option)
          }
          this.spinShow = false;
        })
      },getSdwanInterfaceBandwidthSelect(){
        let data = {};
        data.adomName     = this.adomName;;
        data.deviceName   = this.deviceName;
        getSdWanDeviceForwardSelect(data).then(res => {
          let selNameArr = [];
          if(res.data.data.result[0].status.code == 0){
            res.data.data.result[0].data['system interface'].forEach(function(v,k){
              let selNameJson = {};
                if(v['monitor-bandwidth'] == 1) {
                  selNameJson.value  = v.name;
                  selNameJson.label = v.name;
                  selNameArr.push(selNameJson);
                }

            })
          }
          this.selName = selNameArr;
          this.namebox = selNameArr ? selNameArr[0].value : '';
          this.getSdWanDeviceInterfaceBandwidth1();
        })
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.dom = echarts.init(this.$refs.dom)
        let option1 = {
          title: {
            text: '暂无数据',
            x: 'center',
            y: 'center',
            textStyle: {
              color: '#333333',
              fontWeight: 'normal',
              fontSize: 16
            }
          },
        }
        this.dom.setOption(option1)
        on(window, 'resize', this.resize)
      })
      this.deviceName = getObjectFromSessionStorage("deviceName");
      this.adomName   = getObjectFromSessionStorage("sdWanAdom");
      this.getSdwanInterfaceBandwidthSelect();



    },
    beforeDestroy() {
      off(window, 'resize', this.resize)
    }
  }
</script>
