<template>
  <div class="etools">

    <!--头部区域-->
<!--    <manage-tool @on-search="searchParams" @on-success="refreshFormSysUser" ></manage-tool>-->

    <!--头部区域-->
    <div class="manage-tools">
      <Button type="primary" class="managebtn" @click="handleAdd" :disabled="!checkPermCodeExist('fromUserManagement:fromUserManagement:add')">+ 添加管理员</Button>
      <Select v-model="searchKey" style="width:115px" default-label="姓名"  @on-change="searchKeySelect">
        <Option v-for="item in selList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <div class="manage-serch">
        <Input search  @on-search="search" enter-button placeholder="" style="width:200px;"/>
      </div>
    </div>

    <!--表格区域-->
    <Table  highlight-row ref="selection" :loading="loading" stripe
            :columns="sysUserColumns"
            @on-sort-change="formSysUser.SysUser.impl.onSortChange"
            :data="formSysUser.SysUser.impl.dataList">
    </Table>

    <!--分页区域-->
    <div class="page-crt">
      <Page :total="formSysUser.SysUser.impl.totalCount"
            :current="formSysUser.SysUser.impl.currentPage"
            :page-size="formSysUser.SysUser.impl.pageSize"
            :page-size-opts="[1, 20, 50, 100]"
            @on-change="formSysUser.SysUser.impl.onCurrentPageChange"
            @on-page-size-change="formSysUser.SysUser.impl.onPageSizeChange"
            show-total show-elevator show-sizer>
      </Page>
    </div>

    <!--操作区域-->
    <manager-edit ref="modalForm" @on-success="refreshFormSysUser"></manager-edit>

  </div>
</template>
<script>
import '../single.css'
import ManagerEdit from './manage-edit.vue'
import {SysUserController, SystemController} from '@/api'
import { DropdownWidget, TableWidget } from '@/utils/widget.js'
import { TableMixin } from '@/mixins/TableMixin.js'

export default {
  name: 'manage_person_page',
  mixins: [TableMixin],
  components: {
    ManagerEdit
  },
  data () {
    var self = this
    return {

      searchKey: 'loginPhone',
      formSysUser: {
        formFilter: {
          sysUserStatus: undefined,
          sysUserLoginName: undefined,
          sysUserShowName: undefined,
          sysUserLoginPhone: undefined,
          sysUserWorkNo: undefined,
          sysUserEmail: undefined
        },
        formFilterCopy: {
          sysUserLoginName: undefined,
          sysUserStatus: undefined,
          sysUserShowName: undefined,
          sysUserLoginPhone: undefined,
          sysUserWorkNo: undefined,
          sysUserEmail: undefined
        },
        sysUserStatus: {
          impl: new DropdownWidget(this.loadSysUserStatusDropdownList)
        },
        SysUser: {
          impl: new TableWidget(this.loadSysUserData, this.loadSysUserVerify, true, false, 'createTime', false)
        },
        isInit: false
      },
      loading: false,
      sysUserColumns: [
        {
          title: '序号',
          type: 'index'
        },
        {
          title: '姓名',
          key: 'showName'
        },
        {
          title: '手机号',
          key: 'loginPhone'
        },
        {
          title: '邮箱',
          key: 'email'
        },
        {
          title: '工号',
          key: 'workNo',
          align: 'center'
        },
        {
          title: '状态',
          key: 'userStatus',
          align: 'center',
          render: function (h, params) {
            return h('div', [
              h('i-switch', {
                props: {
                  type: 'primary',
                  size: 'large',
                  value: params.row.userStatus === 0
                },
                scopedSlots: {
                  open: function () {
                    return h('span', '启用')
                  },
                  close: function () {
                    return h('span', '禁用')
                  }
                },
                on: {
                  'on-change': (value) => {
                    console.log("on-change",value)
                    let data = {userId:params.row.userId}
                    if(value){
                      data['userStatus'] = 0
                    }else{
                      data['userStatus'] = 1
                    }
                    self.updateUserStatus(data)
                  }
                }

              })

            ])
          }

        },
        {
          title: '创建时间',
          key: 'createTime',
          sortable: true,
          width:"180"
        },
        {
          title: '操作',
          key: 'tools',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                'class': {
                  tools_icon_edit: true
                },
                on: {
                  click: () => {
                    this.loadRowData(params.row).then(data => {
                      this.handleEdit(data)
                    })
                  }
                }
              }, ''),

              h('Button', {
                'class': {
                  tools_icon_del: true
                },
                on: {
                  click: () => {
                    this.deleteUser(params.row.userId)
                  }
                }
              }, '')
            ]);
          }
        }
      ],
      selList: [
        {
          value: 'showName',
          label: '昵称'
        },
        {
          value: 'loginPhone',
          label: '手机号'
        },
        {
          value: 'email',
          label: '邮箱'
        },
        {
          value: 'workOn',
          label: '工号'
        }
      ]
    }
  },
  methods: {
    // 获取用户详情
    loadRowData (row) {
      return new Promise((resolve, reject) => {
        let params = {
          userId: row.userId
        }
        SysUserController.view(params).then(res => {
          resolve(res.data);
        }).catch(e => {
          reject(e);
        });
      });
    },
    /**
     * 用户管理数据获取函数，返回Primise
     */
    loadSysUserData (params) {
      params.sysUserFilter = {
        showName: this.formSysUser.formFilterCopy.sysUserShowName,
        email: this.formSysUser.formFilterCopy.sysUserEmail,
        workNo: this.formSysUser.formFilterCopy.sysUserWorkNo,
        loginName: this.formSysUser.formFilterCopy.sysUserLoginName,
        loginPhone: this.formSysUser.formFilterCopy.sysUserLoginPhone,
        userStatus: this.formSysUser.formFilterCopy.sysUserStatus
      }
      return new Promise((resolve, reject) => {
        SysUserController.list(params).then(res => {
          resolve({
            dataList: res.data.dataList,
            totalCount: res.data.totalCount
          });
        }).catch(e => { reject(e) })
      })
    },
    /**
     * 用户管理数据获取检测函数，返回true正常获取数据，返回false停止获取数据
     */
    loadSysUserVerify () {
      this.formSysUser.formFilterCopy.sysUserLoginName = this.formSysUser.formFilter.sysUserLoginName;
      this.formSysUser.formFilterCopy.sysUserStatus = this.formSysUser.formFilter.sysUserStatus;
      return true;
    },
    /**
     * 用户状态下拉数据获取函数
     */
    loadSysUserStatusDropdownList () {
      return new Promise((resolve, reject) => {
        let params = {};
        DictionaryController.dictSysUserStatus(params).then(res => {
          resolve(res.getList());
        }).catch(e => {
          reject(e);
        });
      });
    },
    refreshFormSysUser (reloadData = false) {
      // 重新获取数据组件的数据
      if (reloadData) {
        this.formSysUser.SysUser.impl.refreshTable(true, 1)
      } else {
        this.formSysUser.SysUser.impl.refreshTable()
      }
      this.formSysUser.sysUserStatus.impl.onVisibleChange(true).catch(e => {})
      this.formSysUser.isInit = true
    },
    deleteUser (userId) {
      this.$Modal.confirm({
        title: '删除用户',
        content: '<div style="padding-top:20px"><i class="ivu-icon ivu-icon-md-help-circle" style="font-size:30px;vertical-align: middle;color:#e8841e;"></i>是否确认删除该帐号？</div>',
        onOk: () => {
          SysUserController.delete({userId: userId}).then(res => {
          }).catch(e => {})
        }
      });
    },
    updateUserStatus (data) {
      SysUserController.updateStatus(data).then(res=>{

      }).catch(e=>{})
    },
    search (value) {
      console.log('search', value)

      // 先初始化
      this.formSysUser.formFilterCopy.sysUserShowName = undefined
      this.formSysUser.formFilterCopy.sysUserLoginName = undefined
      this.formSysUser.formFilterCopy.sysUserLoginPhone = undefined
      this.formSysUser.formFilterCopy.sysUserEmail = undefined
      this.formSysUser.formFilterCopy.sysUserWorkNo = undefined

      if (this.searchKey === 'showName') {
        this.formSysUser.formFilterCopy.sysUserShowName = value
      } else if (this.searchKey === 'loginPhone') {
        this.formSysUser.formFilterCopy.sysUserLoginPhone = value
      } else if (this.searchKey === 'email') {
        this.formSysUser.formFilterCopy.sysUserEmail = value
      } else if (this.searchKey === 'workOn') {
        this.formSysUser.formFilterCopy.sysUserWorkNo = value
      }
      this.refreshFormSysUser(true);
    },
    searchKeySelect (data) {
      this.searchKey = data
    },
    initFormData () {
    },
    formInit () {
      this.initFormData();
      this.refreshFormSysUser();
    }
  },
  created () {
    console.log('hello from slf......')
    this.formInit()
  }
}
</script>

<style lang="less">
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
  .winbox-edit.add-member .ivu-form-item-content .ivu-tooltip{position:absolute;top:3px;right:-30px;}
  .winbox-edit.add-member .ivu-form-item-content .ivu-tooltip i.ivu-icon{color:#e78a2f;font-size:24px; margin-left:10px;}
  .winbox-edit.add-member .ivu-tooltip-inner { color: #333; background-color: rgba(255, 255, 255, 0.9);}
  .winbox-edit.add-member .ivu-tooltip-popper .ivu-tooltip-arrow { border-top-color: rgba(255, 255, 255, 0.9);box-shadow: 0 6px 6px rgba(0, 0, 0, 0.2);  }
  .ivu-table-wrapper { border: none; background: #FFF; border-top: solid 1px #DDD; }
  .ivu-table:after { background-color: #f8f8f9;}
  .etools button { width: 24px; height: 24px; border: none; background-color: transparent; padding: 0;  }
  .tools_icon_edit { background-image: url(../../../assets/images/icon_tools_edit.png); }
  .tools_icon_ok { background-image: url(../../../assets/images/icon_tools_ok.png);}
  .tools_icon_no { background-image: url(../../../assets/images/icon_tools_no.png); }
  .tools_icon_del { background-image: url(../../../assets/images/icon_tools_del.png);}

  .v-transfer-dom .ivu-btn {color:#818181;background-color: #d8d7d7; border-color: #dcdee2;}
  .v-transfer-dom .ivu-btn.ivu-btn-primary {background-color: #1b63c0;color:#FFF;}
  .ivu-modal-wrap * { box-sizing: border-box; -webkit-tap-highlight-color: transparent;}
  .state-ok .ivu-table-cell span,
  .state-no .ivu-table-cell span { display: inline-block; width: 24px; height: 24px;
    background-image: url(../../../assets/images/icon_tools_ok.png);
    text-indent: -9999px;
  }
  .state-no .ivu-table-cell span { background-image: url(../../../assets/images/icon_tools_no.png);  }
  .ivu-switch {  border-color: #db4443; background-color: #db4443;}
  .ivu-switch-checked { border-color: #47c67b; background-color: #47c67b; }
  .winbox-edit.add-member{padding-right: 150px;}
  .winbox-edit.info-edit li > label{width:30%;}
  .winbox-edit.info-edit li .ivu-input-wrapper{ width:50%;}
  .winbox-edit.info-edit li .ivu-radio-group > label{width:auto;}
  .winbox-edit.info-edit li > label.nos::before{display:none;}
  .winbox-edit.info-edit li > label:before {
      content: '*';display: inline-block;margin-right: 4px;line-height: 1;font-family: SimSun;font-size: 14px;color: #ed4014;
  }
</style>
