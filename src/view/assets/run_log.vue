<template>
  <div>
    <div class="manage-tools">

      <Form :model="searchForm">
        <Select style="width:130px" placeholder="全部机房" v-model="searchForm.netroomId" @on-change="handleSearch">
          <Option v-for="item in listNetroom" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>

        <div class="manage-serch">
          <Input v-model.trim="searchForm.searchKey" enter-button placeholder="设备信息 / IP地址" style="width:200px;"/>
        </div>

        <div class="manges-timeselect">
          <DatePicker v-model="searchForm.actionTime" @on-change="searchForm.actionTime=$event" type="daterange" style="width: 200px" placeholder="时间"></DatePicker>
          <Button type="primary" icon="ios-search" @click="handleSearch"></Button>
        </div>
      </Form>

    </div>

    <div class="mainbox boxscoll" style="top:55px;">

      <Table :stripe="stripe" :loading="loading" :data="listCardData" :columns="listCardColumns" @on-sort-change='changeSort'></Table>

      <!--分页-->
      <div class="ivu-mt ivu-text-right">
        <Page transfer :total="totalCount" :current="pageNum" :page-size="pageSize" show-total class="paging" @on-change="changePage" show-sizer @on-page-size-change="changePageSize"></Page>
      </div>
    </div>

  </div>
</template>

<script>
import './traffic.less'
import { assetActionLogList } from '@/api/asset'

export default {
  data () {
    return {
      loading: false,
      stripe: true,
      columnKey: 'logId',
      columnAsc: false,
      totalCount: 0,
      pageNum: 1,
      pageSize: 10,
      searchForm: {},
      listNetroom: [
        {
          value: '0',
          label: '全部机房'
        },
        {
          value: '4',
          label: '科兴机房'
        },
        {
          value: '3',
          label: '环球机房'
        },
        {
          value: '31',
          label: '南湾机房'
        }
      ],
      listCardData: [],
      listCardColumns: [
        { title: '序号',
          render: (h, params) => {
            return h('span', params.index + (this.pageNum - 1) * this.pageSize + 1)
          }
        },
        { title: '操作用户', key: 'userName' },
        { title: '设备信息', key: 'deviceNumber' },
        { title: '设备型号', key: 'deviceBrand' },
        { title: '所属机房', key: 'roomName', sortable: true },
        { title: '机房号', key: 'roomNumber', align: 'center' },
        { title: '机柜号', key: 'cabinetCode' },
        { title: 'U位', key: 'uPosition',
          render: (h, params) => {
            return h('Span', {}, params.row.uPosition + 'U')
          } },
        { title: 'IP地址', key: 'ipAddress' },
        { title: '时间', key: 'actionTime', sortable: true },
        { title: '操作指令',
          key: 'action',
          align: 'center',
          className: 'dev-list-state',
          render: (h, params) => {
            if (params.row.action === 'up') {
              return h('span', [
                  h('i', {
                    class: {
                      startIcon: true
                    }
                  }),
                  h('b', '开机')
                ]
              )
            } else if (params.row.action === 'down') {
              return h('span', [
                  h('i', {
                    class: {
                      stopIcon: true
                    }
                  }),
                  h('b', '关机')
                ]
              )
            } else if (params.row.action === 'reset') {
              return h('span', [
                  h('i', {
                    class: {
                      resetIcon: true
                    }
                  }),
                  h('b', '重启')
                ]
              )
            } else {
              return h('span', [
                  h('i', {
                    class: {
                      noIcon: true
                    }
                  }),
                  h('b', '无法获取')
                ]
              )
            }
          }
        },
        { title: '执行状态',
          key: 'actionStatus',
          align: 'center',
          className: 'devrun-state',
          render: (h, params) => {
            if (params.row.actionStatus === 'success') {
              return h(
                'span', [
                  h('i', {
                    class: {
                      devwin: true
                    }
                  }),
                  h('b', '成功')
                ]
              )
            } else {
              return h('span', [
                h('i', {
                  class: {
                    devfail: true
                  }
                }),
                h('b', '失败')
              ]
              )
            }
          }
        }
      ]
    }
  },
  methods: {
    DescribeActionLogList (filterBy, orderParam, pageParam) {
      this.listCardData = []
      this.loading = true
      assetActionLogList(filterBy, orderParam, pageParam).then(res => {
        let dataList = res.data.dataList
        this.loading = false
        this.listCardData = dataList
        this.totalCount = res.data.totalCount
      })
    },
    // 排序
    changeSort: function (column) {
      this.listCardData = []
      this.loading = true
      this.columnKey = column.key
      if (column.order === 'asc') {
        this.columnAsc = true
      }
      let filterBy = {
        netroomId: this.searchForm.netroomId,
        searchKey: this.searchForm.searchKey
      }
      let orderParam = [{
        'asc': this.columnAsc,
        'fieldName': this.columnKey
      }]
      let pageParam = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.DescribeActionLogList(filterBy, orderParam, pageParam)
    },
    // 选择页码
    changePage (pageNum) {
      this.pageNum = pageNum
      this.listCardData = []
      this.loading = true
      let searchDate = this.getSearchDate()
      let filterBy = {
        netroomId: this.searchForm.netroomId,
        searchKey: this.searchForm.searchKey,
        actionTimeStart: searchDate.startTime,
        actionTimeEnd: searchDate.endTime
      }
      let orderParam = [{
        'asc': this.columnAsc,
        'fieldName': this.columnKey
      }]
      let pageParam = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.DescribeActionLogList(filterBy, orderParam, pageParam)
    },
    // 改变每页显示的条数
    changePageSize (pageSize) {
      this.pageSize = pageSize
      this.listCardData = []
      this.loading = true
      let searchDate = this.getSearchDate()
      let filterBy = {
        netroomId: this.searchForm.netroomId,
        searchKey: this.searchForm.searchKey,
        actionTimeStart: searchDate.startTime,
        actionTimeEnd: searchDate.endTime
      }
      let orderParam = [{
        'asc': this.columnAsc,
        'fieldName': this.columnKey
      }]
      let pageParam = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.DescribeActionLogList(filterBy, orderParam, pageParam)
    },
    // 查询表单提交
    handleSearch () {
      this.loading = true
      this.pageNum = 1;
      let searchDate = this.getSearchDate()
      let filterBy = {
        netroomId: this.searchForm.netroomId,
        searchKey: this.searchForm.searchKey,
        actionTimeStart: searchDate.startTime,
        actionTimeEnd: searchDate.endTime
      }
      let orderParam = [{
        'asc': this.columnAsc,
        'fieldName': this.columnKey
      }]
      let pageParam = {
        pageNum:  this.pageNum,
        pageSize: this.pageSize
      }
      this.DescribeActionLogList(filterBy, orderParam, pageParam)
    },
    // 处理搜索日期
    getSearchDate () {
      let startTime = this.searchForm.actionTime[0] ? this.searchForm.actionTime[0] + ' 00:00:00' : ''
      let endTime = this.searchForm.actionTime[1] ? this.searchForm.actionTime[1] + ' 23:59:59' : ''
      let searchDate = { 'startTime': startTime, 'endTime': endTime }
      return searchDate
    }
  },
  mounted () {
    let filterBy = {}
    let orderParam = [{
      'asc': this.columnAsc,
      'fieldName': this.columnKey
    }]
    let pageParam = {
      pageNum: this.pageNum,
      pageSize: this.pageSize
    }
    this.DescribeActionLogList(filterBy, orderParam, pageParam)
  }
}
</script>
