<template>
  <div>
    <div class="manage-tools">
      <Form :model="searchForm">
        <Select style="width:130px" placeholder="全部机房" v-model="searchForm.netroomId" @on-change="handleSearch">
          <Option v-for="item in listNetroom" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>

        <div class="manage-serch">
          <Input v-model.trim="searchForm.keywords" enter-button placeholder="设备信息 / IP地址" style="width:200px;"/>
        </div>

        <div class="manges-timeselect">
          <DatePicker v-model="searchForm.createTime" @on-change="searchForm.createTime=$event" type="daterange" style="width: 200px" placeholder="时间"></DatePicker>
          <Button type="primary" icon="ios-search" @click="handleSearch"></Button>
        </div>

        <div class="switch-dev">
<!--          <Button type="primary" @click="exportCurrentData()"><Icon type="ios-download-outline"></Icon> 导出</Button>-->
          <Button type="primary" @click="exportAllData()"><Icon type="ios-download-outline"></Icon> 导出</Button>
        </div>
      </Form>
    </div>

    <div class="mainbox boxscoll" style="top:55px;">

      <Table :stripe="stripe" :loading="loading" :data="listCardData" :columns="listCardColumns" @on-sort-change='changeSort' ref="table">
        <template slot-scope="{ row }" slot="op">
          <router-link :to="{path:'/assetview',query: {deviceId: row.deviceId}}">
            <Button class="tab-view-url"></Button>
          </router-link>
        </template>
      </Table>

      <!--分页-->
      <div class="ivu-mt ivu-text-right">
        <Page transfer :total="totalCount" :current="pageNum" :page-size="pageSize" show-total class="paging" @on-change="changePage" show-sizer @on-page-size-change="changePageSize"></Page>
      </div>

    </div>
  </div>
</template>

<script>
import './traffic.less'
import { assetDeviceList } from '@/api/asset'

export default {
  data () {
    return {
      loading: false,
      stripe: true,
      columnKey: 'deviceId',
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
        { title: '序号', key: 'index', tooltip: true },
        { title: '所属机房', key: 'roomName', tooltip: true, sortable: 'custom' },
        { title: '设备信息', key: 'deviceNumber', tooltip: true },
        { title: '设备类型', key: 'deviceType', tooltip: true },
        { title: '机房号', key: 'roomNumber', align: 'center', tooltip: true },
        { title: '机柜号', key: 'cabinetCode', tooltip: true },
        { title: 'U位', key: 'uPosition', tooltip: true },
        { title: 'IP地址', key: 'ipAddress', tooltip: true },
        { title: '上架时间', key: 'createTime', tooltip: true, sortable: 'custom' },
        { title: '操作', slot: 'op' }
      ]
    }
  },
  methods: {
    DescribeDeviceList (filterBy, orderParam, pageParam) {
      this.listCardData = []
      this.loading = true
      assetDeviceList(filterBy, orderParam, pageParam).then(res => {
        let dataList = res.data.dataList
        dataList.map((item, index) => {
          item.index = index + 1
          item.deviceType = item.deviceTypeDictMap.name
          item.uPosition = item.uPosition + 'U'
        })
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
      let searchDate = this.getSearchDate()
      let filterBy = {
        netroomId: this.searchForm.netroomId,
        keywords: this.searchForm.keywords,
        startDate: searchDate.startTime,
        endDate: searchDate.endTime
      }
      let orderParam = [{
        'asc': this.columnAsc,
        'fieldName': this.columnKey
      }]
      let pageParam = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.DescribeDeviceList(filterBy, orderParam, pageParam)
    },
    // 选择页码
    changePage (pageNum) {
      this.pageNum = pageNum
      this.listCardData = []
      this.loading = true
      let searchDate = this.getSearchDate()
      let filterBy = {
        netroomId: this.searchForm.netroomId,
        keywords: this.searchForm.keywords,
        startDate: searchDate.startTime,
        endDate: searchDate.endTime
      }
      let orderParam = [{
        'asc': this.columnAsc,
        'fieldName': this.columnKey
      }]
      let pageParam = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.DescribeDeviceList(filterBy, orderParam, pageParam)
    },
    // 改变每页显示的条数
    changePageSize (pageSize) {
      this.pageSize = pageSize
      this.listCardData = []
      this.loading = true
      let searchDate = this.getSearchDate()
      let filterBy = {
        netroomId: this.searchForm.netroomId,
        keywords: this.searchForm.keywords,
        startDate: searchDate.startTime,
        endDate: searchDate.endTime
      }
      let orderParam = [{
        'asc': this.columnAsc,
        'fieldName': this.columnKey
      }]
      let pageParam = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.DescribeDeviceList(filterBy, orderParam, pageParam)
    },
    // 查询表单提交
    handleSearch () {
      this.loading = true
      this.pageNum = 1;
      let searchDate = this.getSearchDate()
      let filterBy = {
        netroomId: this.searchForm.netroomId,
        keywords: this.searchForm.keywords,
        startDate: searchDate.startTime,
        endDate: searchDate.endTime
      }
      let orderParam = [{
        'asc': this.columnAsc,
        'fieldName': this.columnKey
      }]
      let pageParam = {
        pageNum:  this.pageNum,
        pageSize: this.pageSize
      }
      this.DescribeDeviceList(filterBy, orderParam, pageParam)
    },
    // 处理搜索日期
    getSearchDate () {
      let startTime = this.searchForm.createTime[0] ? this.searchForm.createTime[0] + ' 00:00:00' : ''
      let endTime = this.searchForm.createTime[1] ? this.searchForm.createTime[1] + ' 23:59:59' : ''
      let searchDate = { 'startTime': startTime, 'endTime': endTime }
      return searchDate
    },
    // 导出当前数据
    exportCurrentData () {
      this.$refs.table.exportCsv({
        filename: '资产配置表',
        columns: this.listCardColumns.filter((col, index) => index < 9),
        data: this.listCardData
      })
    },
    // 导出所有数据
    exportAllData () {
      let searchDate = this.getSearchDate()
      let filterBy = {
        netroomId: this.searchForm.netroomId,
        keywords: this.searchForm.keywords,
        startDate: searchDate.startTime,
        endDate: searchDate.endTime
      }
      let orderParam = [{
        'asc': this.columnAsc,
        'fieldName': this.columnKey
      }]
      let pageParam = {
        pageNum:  1,
        pageSize: 10000
      }
      let exportData=[];
      assetDeviceList(filterBy, orderParam, pageParam).then(res => {
        let dataList = res.data.dataList
        dataList.map((item, index) => {
          item.index = index + 1
          item.deviceType = item.deviceTypeDictMap.name
          item.uPosition = item.uPosition + 'U'
        })
        exportData = dataList

        this.$refs.table.exportCsv({
          filename: '资产配置表',
          columns: this.listCardColumns.filter((col, index) => index < 9),
          data: exportData
        })
      })
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
    this.DescribeDeviceList(filterBy, orderParam, pageParam)
  }
}
</script>
