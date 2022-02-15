<template>
  <div ref="dom"></div>
</template>

<script>
  import echarts from 'echarts'
  import {
    on,
    off
  } from '@/libs/tools'
  export default {
    name: 'Device',
    data() {
      return {
        dom: null
      }
    },
    methods: {
      resize() {
        this.dom.resize()
      }
    },
    mounted() {

      const option = {
        color: ['#bdd732', '#f09932', '#2ef1af', '#f1532e', '#5f5bf9'],
        title: [{
          text: '流量总览',
          left:0,
          textStyle: {
            color: '#1b63c0',
            fontWeight: '600',
            fontSize: 16
          }
        },
        {
          text: '(GB)',
          left:70,
          top:3,
          textStyle: {
            color: '#999',
            fontWeight: '400',
            fontSize: 12
          }
        }],
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['Lan1', 'Lan2', 'Lan3', 'Lan4', 'Lan5'],
          x: 'right',
          icon: 'circle'
        },
        dataZoom: [{
          type: 'inside',
          start: 0,
          end: 10
        }, {
          start: 0,
          end: 10
        }],
        grid: {
          left: '0',
          right: '20',
          bottom: '40',
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
            name: 'Lan1',
            type: 'line',
            stack: '总量',
            data: [220, 132, 101, 134, 90, 230, 210, 160, 226, 213]
          },
          {
            name: 'Lan2',
            type: 'line',
            stack: '总量',
            data: [220, 182, 391, 234, 290, 330, 310, 220, 182, 191, ]
          },
          {
            name: 'Lan3',
            type: 'line',
            stack: '总量',
            data: [150, 232, 401, 454, 190, 330, 410, 232, 201, 154, ]
          },
          {
            name: 'Lan4',
            type: 'line',
            stack: '总量',
            data: [334, 390, 330, 320, 232, 301, 534, 390, 330, 320]
          },
          {
            name: 'Lan5',
            type: 'line',
            stack: '总量',
            data: [820, 932, 1901, 934, 1290, 932, 901, 934, 1330, 1320]
          }
        ]
      }
      this.$nextTick(() => {
        this.dom = echarts.init(this.$refs.dom)
        this.dom.setOption(option)
        on(window, 'resize', this.resize)
      })
    },
    beforeDestroy() {
      off(window, 'resize', this.resize)
    }
  }
</script>
