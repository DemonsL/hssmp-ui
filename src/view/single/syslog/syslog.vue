<style lang="less">
  @import "./common.less";
</style>
<template>
  <div>
    <div class="time-select-bar">
      <DatePicker type="datetimerange" @on-change="changeDate"    :options="options"  placeholder="选择时间范围" style="width: 200px"></DatePicker>
      <Button type="primary" icon="ios-search" @click="queryByDateRange"></Button>
    </div>
    <!--表格区域-->
    <Table  highlight-row ref="selection" :loading="loading" stripe
            :columns="logColumns"
            @on-sort-change="formSysLog.SysLog.impl.onSortChange"
            :data="formSysLog.SysLog.impl.dataList">
    </Table>

    <!--分页区域-->
    <div class="page-crt">
      <Page :total="formSysLog.SysLog.impl.totalCount"
            :current="formSysLog.SysLog.impl.currentPage"
            :page-size="formSysLog.SysLog.impl.pageSize"
            :page-size-opts="[1, 20, 50, 100]"
            @on-change="formSysLog.SysLog.impl.onCurrentPageChange"
            @on-page-size-change="formSysLog.SysLog.impl.onPageSizeChange"
            show-total show-elevator show-sizer>
      </Page>
    </div>
  </div>
</template>
<script>
import {SystemController} from '@/api'
import { TableWidget } from '@/utils/widget.js'
import { formatDate } from '@/libs/tools.js'
export default {
  data () {
    return {
      formSysLog: {
        formFilter: {
          createTimeStart: undefined,
          createTimeEnd: undefined
        },
        formFilterCopy: {
          createTimeStart: undefined,
          createTimeEnd: undefined
        },
        SysLog: {
          impl: new TableWidget(this.loadSysLogData, this.loadSysLogVerify, true, false, 'createTime', false)
        },
        isInit: false
      },
      loading: false,
      logColumns: [
        {
          title: '序号',
          type: 'index'
        },
        {
          title: '用户名',
          key: 'userName',
          align: 'center'
        },
        {
          title: '时间',
          key: 'createTime',
          sortable: true
        },
        {
          title: 'IP地址',
          key: 'ip'
        },
        {
          title: '详情',
          key: 'logContent',
          align: 'right'
        }
      ],
      options: {
        shortcuts: [
          {
            text: '1天',
            value () {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              return [start, end];
            }
          },
          {
            text: '1周',
            value () {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              return [start, end];
            }
          },
          {
            text: '1月',
            value () {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              return [start, end];
            }
          }
        ]
      }

    }
  },
  methods: {
    changeDate (dateVal) {
      this.formSysLog.formFilterCopy.createTimeStart = dateVal[0]
      this.formSysLog.formFilterCopy.createTimeEnd = dateVal[1]
    },
    queryByDateRange () {
      this.refreshFormSysLog(true)
    },
    /**
       * 用户管理数据获取函数，返回Primise
       */
    loadSysLogData (params) {
      params.sysLogFilter = {
        createTimeStart: this.formSysLog.formFilterCopy.createTimeStart,
        createTimeEnd: this.formSysLog.formFilterCopy.createTimeEnd
      }
      return new Promise((resolve, reject) => {
        SystemController.getSysLogList(params).then(res => {
          resolve({
            dataList: res.data.dataList,
            totalCount: res.data.totalCount
          });
        }).catch(e => { reject(e) })
      })
    },
    /**
       *
       */
    loadSysLogVerify () {
      return true;
    },
    refreshFormSysLog (reloadData = false) {
      // 重新获取数据组件的数据
      if (reloadData) {
        this.formSysLog.SysLog.impl.refreshTable(true, 1)
      } else {
        this.formSysLog.SysLog.impl.refreshTable()
      }
      this.formSysLog.isInit = true
    }
  },
  mounted () {
    this.refreshFormSysLog()
  }
}
</script>
<style>
  .ivu-table-wrapper { border: none; border-top: solid 1px #DDD; }
  .ivu-table:after { display: none; }
  .time-select-bar{padding-bottom:10px;z-index: 999;}
  .time-select-bar .ivu-input-wrapper i{display:none;}
  .time-select-bar .ivu-input-wrapper input{text-align:center;font-size:14px;border-top-right-radius:0;border-bottom-right-radius:0;}
  .time-select-bar .ivu-btn.ivu-btn-icon-only{ background: #1b63c0 !important;border-color: #1b63c0 !important;border-top-left-radius:0;border-bottom-left-radius:0;padding:0; width:60px; height:32px;}
  .time-select-bar .ivu-btn i{font-size:18px;}
</style>
