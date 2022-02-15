<template>
  <div class="maincont">
    <Spin fix v-if="spin"></Spin>
    <div class="etools">
      <SLAtools :data="adom1" @searchClick="bindData"></SLAtools>
    </div>
    <div class="whitebox">
      <Conversation :data="data_line" style="height:200px"></Conversation>
    </div>
    <div class="traffic-bot">
      <Table :loading="loading" :columns="columns1" :data="data1">

      </Table>
      <div class="page-crt">
        <Page class="paging" :total="totalCount" :page-size="pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-total show-elevator show-sizer />
      </div>
    </div>
  </div>

</template>
<script>
import '../traffic.less'
import SLAtools from './slatools.vue'
import Conversation from './conversation.vue'
import { getObjectFromSessionStorage } from '@/utils'
import { getViewData, getViewLine, getSlaDevData, getDeviceGroup, getDeviceList, timeFormat } from '@/libs/sdwan'

export default {
  name: 'post_list',
  components: {
    SLAtools,
    Conversation
  },
  data () {
    return {
      loading: false,
      spin: false,
      pageNum: 1,
      pageSize: 10,
      totalCount: 0,
      columns1: [{
        title: '序号',
        render: (h, params) => {
          return h('span', params.index + 1 + (this.pageNum - 1) * this.pageSize)
        },
        sortable: true
      },
      {
        title: '目标IP地址',
        key: 'dstip',
        sortable: true
      },
      {
        title: '应用',
        key: 'agg_app',
        className: 'appdom',
        sortable: true,
        render: (h, params) => {
          return h('span', [
            h('label', {}, params.row.agg_app)
            // h("label", {}, params.row.agg_app ),
            // h('label', {}, params.row.agg_app ),
            // h("label", {}, params.row.agg_app ),
          ])
        }
      },
      {
        title: '会话(阻断 / 允许）',
        key: 'sessions',
        align: 'right',
        sortable: true,
        className: 'dialoguetd',
        renderHeader: (h, params) => {
          return h('span', [
            h('strong', '会话('),
            h('Icon', {
              props: {
                type: 'ios-square',
                size: 'small'
              },
              style: {
                color: '#ffb33b'
              }
            }),
            h('strong', '阻断 / '),
            h('Icon', {
              props: {
                type: 'ios-square'
              },
              style: {
                color: '#73abfe'
              }
            }),
            h('strong', '允许）')
          ])
        },
        render: (h, params) => {
          return h('span', [
            h('label', {}, params.row.sessions),
            h('Progress', {
              'class': {
                converbar: true
              },
              props: {
                type: 'Progress',
                size: 'small',
                'hide-info': true,
                percent: parseFloat(
                  params.row.sessions
                )
              }
            })
          ])
        }
      },
      {
        title: '速率(发送 / 已收到）',
        key: 'rate',
        align: 'right',
        sortable: true,
        className: 'dialoguetd',
        renderHeader: (h, params) => {
          return h('span', [
            h('strong', '速率('),
            h('Icon', {
              props: {
                type: 'ios-square',
                size: 'small'
              },
              style: {
                color: '#1b7195'
              }
            }),
            h('strong', '发送 / '),
            h('Icon', {
              props: {
                type: 'ios-square'
              },
              style: {
                color: '#40c8a3'
              }
            }),
            h('strong', '已收到）')
          ])
        },
        render: (h, params) => {
          return h('span', [
            h('label', {}, params.row.rate),
            h('Progress', {
              'class': {
                ratebar: true
              },
              props: {
                type: 'Progress',
                size: 'small',
                'hide-info': true,
                percent: parseFloat(
                  params.row.rate
                )
              }
            }
            )
          ])
        }
      }
      ],
      adom1: [],
      data1: [],
      data2: [],
      data_line: {
        'time_list': [],
        'session_block_list': [],
        'session_pass_list': []
      },
      dataCache: []
    }
  },
  methods: {

    // 绑定数据到页面
    async bindData (d) {
      this.spin = true
      let adomName = getObjectFromSessionStorage('sdWanAdom')
      let startTime = d.timeRange.split('~')[0]
      let endTime = d.timeRange.split('~')[1]
      let tableParams = {
        adomName: adomName,
        apiName: 'top-destinations',
        startTime: startTime,
        endTime: endTime
      }
      let lineParams = {
        adomName: adomName,
        apiName: 'src-dst-line',
        startTime: startTime,
        endTime: endTime
      }
      this.dataCache = await getViewData(tableParams)
      let lineData = await getViewLine(lineParams)
      if (lineData) {
        this.spin = false
      }
      this.tablePaging(this.pageNum, this.pageSize)

      this.data_line.time_list = []
      this.data_line.session_block_list = []
      this.data_line.session_pass_list = []
      for (var i = 0; i < lineData.length; i++) {
        this.data_line.time_list.push(timeFormat(Number(lineData[i].time + '000'), 'date'))
        this.data_line.session_block_list.push(lineData[i].session_block)
        this.data_line.session_pass_list.push(lineData[i].session_pass)
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
    },

    // 分页
    tablePaging (num, size) {
      let d = this.dataCache
      this.totalCount = d.length
      this.data1 = []
      for (let i = (num - 1) * size; i < num * size; i++) {
        if (d[i] != null) {
          var rate = (d[i].traffic_out / 1024).toFixed(1) + ' KB/' + (d[i].traffic_in / 1024).toFixed(1) + ' KB'
          d[i].rate = rate
          this.data1.push(d[i])
        }
      }
    },

    // 选择页码
    changePage (pageNum) {
      this.pageNum = pageNum
      this.tablePaging(this.pageNum, this.pageSize)
    },

    // 改变每页显示条数
    changePageSize (pageSize) {
      this.pageSize = pageSize
      this.tablePaging(this.pageNum, this.pageSize)
    }

  },
  created () {
    this.bindDevice()
  },
  mounted () {

  }
}
</script>
