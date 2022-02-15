<template>
  <div class="manage-tools">
    <Button type="primary" class="managebtn" @click="addManage = true">+ 创建角色</Button>
    <template>
      <Modal class="Hmbox" v-model="addManage" title="创建角色" @on-ok="MagOK" @on-cancel="MagCancel">
        <ul class="winbox-edit">
          <li><label>角色名称：</label><Input /></li>
        </ul>
      </Modal>
    </template>
  </div>
  </div>
</template>

<script>
  export default {
    name: 'Postertools',
    data() {
      return {
        addManage: false,
      }
    },
    methods: {
      MagOK() {
        this.$Message.success('创建角色成功');
      },
      MagCancel() {
        this.$Message.warning('取消创建角色');
      },
      success() {
        this.$Message.success('已启用该角色！');
      },
      warning() {
        this.$Message.warning('已禁用该角色！');
      },
    }
  }
</script>

<style>
  .manage-tools {
    padding-bottom: 10px;
  }

  .manage-tools .managebtn {
    width: 110px;
    text-align: center;
    background: #1b63c0;
    color: #FFF;
    font-size: 14px;
    height: 32px;
    margin-right: 10px;
  }

  .manage-tools .ivu-input-search i {
    font-size: 20px;
    color: #FFF !important;
  }

  .ivu-select-single .ivu-select-selection .ivu-select-placeholder,
  .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
    height: 32px;
    line-height: 32px;
  }

  .manage-tools .manage-serch {
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
  }

  .manage-tools .manage-serch .ivu-input-group .ivu-input {
    background: #FFF;
    -webkit-box-shadow: none;
    box-shadow: none;
    border: solid 1px #DDD;
    height: 32px;
    line-height: 32px;
  }

  .manage-tools .manage-serch .ivu-input-search:before {
    display: none;
  }

  .manage-tools .manage-serch .ivu-input-search {
    background: #1b63c0 !important;
    border-color: #1b63c0 !important;
  }

  .manage-tools .manage-serch .ivu-input-search:hover {
    background: #e8841e !important;
    border-color: #e8841e !important;
  }
</style>
