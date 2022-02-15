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
    data() {
      return {
        dom: null,
        option : {
          title: {
            text: '内存',
            top:'bottom',
            x:'center',
            textStyle: {
              color: '#333',
              fontWeight: '400',
              fontSize:20
            }
          },
          series: [
            {
              type: 'gauge',
              axisLine: {
                lineStyle: {
                  width:5,
                  color: [
                    [0.3, '#67e0e3'],
                    [0.7, '#37a2da'],
                    [1, '#fd666d']
                  ]
                }
              },
              pointer: {
                itemStyle: {
                  color: 'auto'
                }
              },
              axisTick: {
                distance: -30,
                length: 8,
                lineStyle: {
                  color: '#fff',
                  width: 1
                }
              },
              splitLine: {
                distance: -20,
                length:5,
                lineStyle: {
                  color: '#fff',
                  width: 4
                }
              },
              axisLabel: {
                color: 'auto',
                distance:10,
                fontSize:10
              },
              detail: {
                valueAnimation: true,
                fontSize: 20,
                offsetCenter: [0, '75%'],
                formatter: '{value} %',
                color: 'auto'
              },
              data: [{
                value:0
              }]
            }]
        }
      }
    },
    methods: {
      resize() {
        this.dom.resize()
      },childMethod(mem){
        this.option.series[0].data[0].value = mem.current
        this.dom.setOption(this.option)
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.dom = echarts.init(this.$refs.dom)
        this.dom.setOption(this.option)
        on(window, 'resize', this.resize)
      })
    },
    beforeDestroy() {
      off(window, 'resize', this.resize)
    }
  }
</script>
