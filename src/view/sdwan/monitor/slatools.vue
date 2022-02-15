<template>
  <div class="manage-tools">
    <Select v-model="decbox" style="width:130px" placeholder="设备名称">
      <Option v-for="item in selList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <Select v-model="timebox" style="width:130px;margin-left:10px;" >
      <Option v-for="item in selTime" :value="item.value" :key="item.value" default-label="最近5分钟">{{ item.label }}</Option>
    </Select>
    <span v-if="show">
    <Date-picker v-model="dateTime" type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="选择日期和时间" style="width:300px;margin-left:10px;"></Date-picker>
    </span>
    <div class="manage-serch">
      <Input v-model="timeRange" @on-search="searchClick" readonly search enter-button placeholder="" style="width:300px;"/>
    </div>
  </div>
</template>

<script>
import {timeFormat} from '@/libs/sdwan';
export default {
  name: 'SLAtools',
  data () {
    return {
      addManage: false,
      show: false,
      dateTime: '',
      timeRange: '',
      timePost: [],
      selList: [],
      selTime: [{
        value: 'time1',
        label: '最近5分钟'
      },
      {
        value: 'time2',
        label: '最近30分钟'
      },
      {
        value: 'time3',
        label: '最近1小时'
      },
      {
        value: 'time4',
        label: '最近12小时'
      },
      {
        value: 'time5',
        label: '最近1天'
      },
      {
        value: 'time6',
        label: '最近一周'
      },
      {
        value: 'time7',
        label: '自定义'
      }
      ],
      decbox: '',
      timebox: ''
    }
  },
  methods: {
    searchClick () {
      this.$emit('searchClick', {devName: this.decbox, timeRange: this.timePost})
    },
    setTimePost (t1, t2) {
      this.timePost = []
      this.timePost.push(t1)
      this.timePost.push(t2)
    },
    MagOK () {
      this.$Message.success('添加管理员成功');
    },
    MagCancel () {
      this.$Message.warning('取消添加管理员');
    }
  },
  props: ['data'],
  watch: {
    data: {
      deep: true,
      handler: function (val) {
        if (val) {
          this.selList = val
          this.decbox = val[0].value
          this.searchClick()
        }
      }
    },
    timebox (val) {
      let ts = new Date().getTime()
      let miss = 0
      switch (val) {
        case 'time1':
          miss = 300000
          break
        case 'time2':
          miss = 1800000
          break
        case 'time3':
          miss = 3600000
          break
        case 'time4':
          miss = 43200000
          break
        case 'time5':
          miss = 86400000
          break
        case 'time6':
          miss = 604800000
          break
      }
      if (val === 'time7') {
        this.show = true
        this.timeRange = ''
      } else {
        this.show = false
        let t1 = timeFormat((ts - miss), 'date')
        let now = timeFormat(ts, 'date')
        this.timeRange = t1 + '~' + now
        this.setTimePost(ts - miss, ts)
      }
    },
    dateTime (val) {
      if (val[0]) {
        let t1 = new Date(val[0]).getTime()
        let t2 = new Date(val[1]).getTime()
        this.timeRange = timeFormat(t1, 'date') + '~' + timeFormat(t2, 'date')
        this.setTimePost(t1, t2)
      } else {
        this.timeRange = ''
      }
    }
  },
  created () {
    this.timebox = this.selTime[2].value
  },
  mounted () {

  }
}
</script>

<style>
  .manage-tools{padding-bottom:10px;}
  .manage-tools .managebtn{width:110px;text-align:center;background:#1b63c0;color:#FFF;font-size:14px;height:32px;margin-right: 10px;}
  .manage-tools .managebtn:hover{background: #e8841e !important;}
  .manage-tools .ivu-input-search i {font-size:20px;color: #FFF !important;  }
  .ivu-select-single .ivu-select-selection .ivu-select-placeholder,
  .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
      height: 32px;
      line-height: 32px;
  }
  .manage-tools .manage-serch { display:inline-block; vertical-align:middle; margin-left:10px; }
  .manage-tools .manage-serch .ivu-input-group .ivu-input {background:#FFF; -webkit-box-shadow:none; box-shadow:none; border:solid 1px #DDD;height: 32px;line-height: 32px; }
  .manage-tools .manage-serch .ivu-input-search:before {display:none;}
  .manage-tools .manage-serch .ivu-input-search { background: #1b63c0 !important;border-color: #1b63c0 !important;  }
  .manage-tools .manage-serch .ivu-input-search:hover { background: #e8841e !important;border-color: #e8841e !important;  }
  .ivu-select-arrow { margin-top: 0; }
</style>
