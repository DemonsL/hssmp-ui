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
  name: 'Bandwidth',
  data () {
    return {
      dom: null
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    }
  },
  props: ['data'],
  watch: {
    data: {
      deep: true,
      handler: function (val) {
        // 监听有值后才会调用
        if (val.names) {
          const option = {
            color: ['#f7a959', '#3daaed', '#9ced3d', '#2194a5', '#e13f0d'],
            title: [{
              text: '带宽总览',
              left: 0,
              textStyle: {
                color: '#1b63c0',
                fontWeight: '600',
                fontSize: 16
              }
            },
            {
              text: '(Kbps)',
              left: 70,
              top: 3,
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
              data: val.names,
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
              show: false
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: val.times
            },
            yAxis: {
              type: 'value'
            },
            series: val.bandwidth
          }
          this.$nextTick(() => {
            this.dom = echarts.init(this.$refs.dom)
            this.dom.setOption(option)
            on(window, 'resize', this.resize)
          })
        }
      }
    }
  },
  mounted () {

  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
