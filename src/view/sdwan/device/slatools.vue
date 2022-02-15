<template>
  <div class="manage-tools">
    <Select v-model="decbox" style="width:130px" default-label="设备名称"  ref="newText">
      <Option v-for="item in selList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <div class="manage-serch">
      <Input search enter-button placeholder="请输入关键字" @on-search="queryByKey"  style="width:200px;"/>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'SLAtools',
    data() {
      return {
        addManage: false,
        selList: [{
            value: 'deviceName',
            label: '设备名称'
          },
          {
            value: 'name',
            label: '主机名称'
          },
          {
            value: 'ip',
            label: 'IP地址'
          }
        ],
        decbox: ''
      }
    },
    methods: {
      queryByKey(search){
        console.log(this.decbox)
        console.log(search)
        this.$emit("success",search)
        // this.$listeners.msgChange(this.decbox)
        // console.log(search);
      }
    }
  }
</script>

<style>
  .manage-tools{padding-bottom:10px;}
  .manage-tools .managebtn{width:110px;text-align:center;background:#1b63c0;color:#FFF;font-size:14px;height:32px;margin-right: 10px;}
  .manage-tools .managebtn:hover{background: #e8841e !important;}
  .manage-tools .ivu-input-search i {font-size:20px;color: #FFF !important;  }
  .ivu-select-single .ivu-select-selection .ivu-select-placeholder,
  .ivu-select-single .ivu-select-selection .ivu-select-selected-value { height: 32px;line-height: 32px;}
  .manage-tools .manage-serch { display:inline-block; vertical-align:middle; margin-left:10px; }
  .manage-tools .manage-serch .ivu-input-group .ivu-input {background:#FFF; -webkit-box-shadow:none; box-shadow:none; border:solid 1px #DDD;height: 32px;line-height: 32px; }
  .manage-tools .manage-serch .ivu-input-search:before {display:none;}
  .manage-tools .manage-serch .ivu-input-search { background: #1b63c0 !important;border-color: #1b63c0 !important;  }
  .manage-tools .manage-serch .ivu-input-search:hover { background: #e8841e !important;border-color: #e8841e !important;  }
  .ivu-select-arrow { margin-top: 0; }
</style>
