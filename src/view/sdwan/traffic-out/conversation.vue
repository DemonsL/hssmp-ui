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
        if (val.time_list) {
          const option = {
            color: ['#f7a959', '#3daaed', '#9ced3d', '#2194a5', '#e13f0d'],
            title: {
              text: '会话',
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
              data: ['Block', 'Pass']
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            toolbox: {
              show: false
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: val.time_list
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                name: 'Block',
                type: 'line',
                data: val.session_block_list
              },
              {
                name: 'Pass',
                type: 'line',
                data: val.session_pass_list
              }
            ]

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

<style>
</style>
