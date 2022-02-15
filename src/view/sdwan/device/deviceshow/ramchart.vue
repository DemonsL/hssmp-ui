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
    name: 'Ramchart',
    data() {   //渲染数据
      return {
        dom: null,
        memData:''
      }
    },
    methods: {  //自定义方法
     resize() {
        this.dom.resize()
      },
      childMethod(mem){
          this.memData.xAxis.data   = mem.memDate;
          this.memData.series = mem.memData;
        this.dom = echarts.init(this.$refs.dom)
        this.dom.setOption(this.memData)
      },
      memObj(){
        this.memData = {
          color: ['#008800', '#f6ff00', '#2e8ec9', '#ff0078', '#5f5bf9'],
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
            name: '内存01',
            type: 'line',
            stack: '总量',
            data: [220, 132, 101, 134, 90, 230, 210, 160, 226, 213]
          }
          ]
        }
      }
    },
    mounted() { //构造方法
      this.memObj();
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
