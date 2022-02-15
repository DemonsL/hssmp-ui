<template>
  <div class="maincont">
    <div class="dev-list">
      <div class="manage-tools">
        <Form :model="searchForm">
          <Select style="width:130px" placeholder="全部机房" v-model="searchForm.netroomId" @on-change="handleSearch">
            <Option v-for="item in listNetroom" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>

          <div class="manage-serch">
            <Input v-model.trim="searchForm.keywords" search enter-button placeholder="请输入机柜编号 / 设备信息" style="width:300px;" @on-search="handleSearch"/>
          </div>

          <div class="switch-dev">
            <router-link class="switch-dev-img" to="/Deview/device_page"></router-link>
            <router-link class="switch-dev-txt" to="/Deview/device_list"></router-link>
          </div>

        </Form>
      </div>
    </div>

    <div class="mainbox boxscoll" style="top:55px;">

      <Table :stripe="stripe" :loading="loading" :data="listCardData" :columns="listCardColumns" @on-sort-change='changeSort'>
        <template slot-scope="{ row }" slot="op">
          <router-link :to="{path:'/Deview/device_info',query: {cabinetId: row.cabinetId,deviceId: row.deviceId}}">
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
import '../traffic.less'
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
        { title: '序号',
          render: (h, params) => {
            return h('span', params.index + (this.pageNum - 1) * this.pageSize + 1)
          }
        },
        { title: '所属机房', key: 'roomName', tooltip: true, sortable: 'custom' },
        { title: '设备信息', key: 'deviceNumber', tooltip: true },
        { title: '设备类型',
          key: 'deviceType',
          render: (h, params) => {
            return h('Span', {}, params.row.deviceTypeDictMap.name)
          }
        },
        { title: '机房号', key: 'roomNumber', align: 'center', tooltip: true },
        { title: '机柜号', key: 'cabinetCode', tooltip: true },
        { title: 'U数', key: 'uNum', tooltip: true },
        { title: '设备状态', key: '', align: 'center',
          className: 'dev-list-state',
          render: (h, params) => {
            if (params.row.powerStatus === 'on') {
              return h('span', [
                  h('i', {
                    class: {
                      startIcon: true
                    }
                  }),
                  h('b', '开机')
                ]
              )
            } else if (params.row.powerStatus === 'off') {
              return h('span', [
                  h('i', {
                    class: {
                      stopIcon: true
                    }
                  }),
                  h('b', '关机')
                ]
              )
            } else if (params.row.powerStatus === 'error') {
              return h('span', [
                  h('i', {
                    class: {
                      errorIcon: true
                    }
                  }),
                  h('b', '异常')
                ]
              )
            } else {
              return h('span', [
                  h('i', {
                    class: {
                      noIcon: true
                    }
                  }),
                  h('b', '-')
                ]
              )
            }
          }
        },
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
        keywords: this.searchForm.keywords
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
      let filterBy = {
        netroomId: this.searchForm.netroomId,
        keywords: this.searchForm.keywords
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
      let filterBy = {
        netroomId: this.searchForm.netroomId,
        keywords: this.searchForm.keywords
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
      let filterBy = {
        netroomId: this.searchForm.netroomId,
        keywords: this.searchForm.keywords
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
