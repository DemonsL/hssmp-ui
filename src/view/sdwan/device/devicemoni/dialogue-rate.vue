<template>
  <div class="dialogbox">
    <h4>会话率
      <div class="select-box">
        <Select v-model="timebox" style="width:130px;" @on-change="select">
          <Option v-for="item in selTime" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <Icon type="md-refresh"  @click="refresh"/>
    </h4>
<!--    <div ref="dom" style="height:380px;"></div>-->
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
  import {
    on,
    off
  } from '@/libs/tools'
  export default {
    name: 'Cpuchart',
    data() {
      return {
        spinShow:false,
        dom: null,
        selTime: [
          {
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
        option : {
          color: ['#bdd732', '#f09932', '#2ef1af', '#f1532e', '#5f5bf9'],
          title: {
            text: '',
            show:false,
            left:0,
            textStyle: {
              color: '#1b63c0',
              fontWeight: '600',
              fontSize: 16
            }
          },
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            top:'20',
            left: '0',
            right: '20',
            bottom: '0',
            containLabel: true
          },
          toolbox: {
            show: false,
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['14:31', '14:32', '14:33', '14:34', '14:35', '14:36', '14:37', '14:38', '14:39', '14:40', ]
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              type: 'line',
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ]
            }
          ]
        },
        timebox: '1-min',
        session_rate : ''
      }
    },
    methods: {
      resize() {
        this.dom.resize()
      },
      refresh() {
        this.spinShow = true;
        this.$emit("success","session_rate")  //传值到父类页面
      },
      childMethod(session_rate){
        if(session_rate){
          this.session_rate = session_rate.setuprate[0].historical;
          this.select();
          this.spinShow = false;
        }
      },
      select:function(){
        let dateTime = []; let data = [];
        if(this.session_rate && this.session_rate[this.timebox].values.length > 0){
          this.session_rate[this.timebox].values.forEach(function(value,key){
            var time = new Date(value[0]);
            dateTime.unshift(time.getHours() + ":" + (time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes()));
            data.unshift(value[1]);
          })
          this.option.xAxis.data = dateTime;
          this.option.series[0].data = data;
          this.dom.setOption(this.option)
        }
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
    },
    beforeDestroy() {
      off(window, 'resize', this.resize)
    }
  }
</script>
