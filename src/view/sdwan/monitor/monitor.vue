<template>
  <div class="maincont">
    <Spin fix v-if="spin"></Spin>
    <SLAtools :data="adom1" @searchClick="bindSlaData"></SLAtools>
    <div class="leftcont">
      <h3>概述</h3>
      <h5>SD-WAN 接口</h5>
      <Table :columns="columns" :data="data" :show-header="false" style="margin-top:20px;">
        <template slot-scope="{ row }" slot="state">
          <img src="@/assets/images/icon_tools_ok.png" alt="">
        </template>
      </Table>
    </div>
    <div class="rightcont">
     <div class="righttop">
       <Bandwidth style="height:100%;" :data="sla_monitor" />
     </div>
     <div class="rightbottom">
       <Traffic style="height:100%;" :data="sla_monitor" />
     </div>
    </div>
  </div>
</template>
<script>
import '../traffic.less'
import SLAtools from './slatools.vue'
import Bandwidth from './bandwidth.vue'
import Traffic from './Traffic.vue'
import { getObjectFromSessionStorage } from '@/utils'
import { getSlaData, getSlaDevData, getDeviceGroup, getDeviceList, timeFormat } from '@/libs/sdwan';

export default {
  name: 'Monitor',
  components: {
    SLAtools,
    Bandwidth,
    Traffic
  },
  data () {
    return {
      spin: false,
      columns: [
        {
          title: '状态',
          slot: 'state',
          width: 60
        },
        {
          title: '名称',
          key: 'title',
          width: 120
        },
        {
          title: 'IP地址',
          key: 'address'
        }
      ],
      data: [],
      sla_monitor: {
        names: [],
        times: [],
        bandwidth: [],
        traffic: []
      },
      adom1: []
    }
  },
  methods: {

    // 设置带宽/流量监控数据
    setMonitorData (name, data, type) {
      let monitorData = {name: name, type: 'line', data: []}
      for (let i = 0; i < data.length; i++) {
        if (type === 'bandwidth') {
          monitorData.data.push(Math.round(data[i].value.bi_bandwidth / 1024))
          if (this.sla_monitor.names.length === 1) {
            this.sla_monitor.times.push(timeFormat(Number(data[i].timestamp + '000'), 'date'))
          }
        }
        if (type === 'traffic') {
          let rx = data[i].value.rx_bytes / 1024 / 1024
          let tx = data[i].value.tx_bytes / 1024 / 1024
          monitorData.data.push(rx + tx)
        }
      }
      return monitorData
    },

    // 监控数据绑定到页面
    async bindSlaData (d) {
      this.spin = true
      let params = {
        adomName: d.devName.split(':')[0].trim(),
        startTime: d.timeRange[0].toString().slice(0, -3),
        endTime: d.timeRange[1].toString().slice(0, -3)
      }
      let slaData = await getSlaData(params)
      if (slaData) {
        this.spin = false
      }
      this.data = []
      this.sla_monitor.names = []
      this.sla_monitor.times = []
      this.sla_monitor.bandwidth = []
      this.sla_monitor.traffic = []
      for (let i = 0; i < slaData.length; i++) {
        let sdwan = {state: '@/assets/images/icon_tools_ok.png', title: '', address: ''}
        let slaName = slaData[i].interface
        let slaLog = slaData[i].log
        sdwan.title = slaName
        this.data.push(sdwan)

        this.sla_monitor.names.push(slaName)
        let bdData = this.setMonitorData(slaName, slaLog, 'bandwidth')
        let tfData = this.setMonitorData(slaName, slaLog, 'traffic')
        this.sla_monitor.bandwidth.push(bdData)
        this.sla_monitor.traffic.push(tfData)
      }
    },

    // 设备绑定到搜索框
    async bindDevice () {
      let adomName = getObjectFromSessionStorage('sdWanAdom')
      let dg = await getDeviceGroup(adomName)
      for (let i = 0; i < dg.length; i++) {
        let groupName = dg[i].name
        let dl = await getDeviceList(adomName, groupName)
        if ('object member' in dl) {
          let oms = dl['object member']
          for (let j = 0; j < oms.length; j++) {
            let dev = await getSlaDevData({
              adomName: adomName,
              devName: oms[j].name,
              vdomName: oms[j].vdom
            })
            if (dev[0]) {
              let value = oms[j].name + ' : ' + oms[j].vdom
              this.adom1.push({label: value, value: value})
            }
          }
        }
      }
    }

  },
  mounted () {
    this.bindDevice()
  }
}
</script>
