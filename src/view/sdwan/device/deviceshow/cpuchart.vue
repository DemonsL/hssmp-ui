<template>
  <div ref="dom" style="height:200px;"></div>
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
        dom: null,
        echartsData :''
      }
    },
    methods: {
      resize() {
        this.dom.resize()
      },
      childMethod(series,seriesTime){
        // console.log(seriesTime)
        this.echartsData.series = series;
         // console.log(this.echartsData.series);
         this.echartsData.xAxis.data = seriesTime;
        this.dom.setOption(this.echartsData)
      },
      echartsObj(){
        this.echartsData = {
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
          legend: {
            x: 'right',
            top:'30',
            right:'20',
            icon: 'circle'
          },
          grid: {
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
          series: [{
            name: 'cpu',
            type: 'line',
            stack: '总量',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          }]
        }
      }
    },
    mounted() {
      this.echartsObj();
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
    },
  }
</script>
