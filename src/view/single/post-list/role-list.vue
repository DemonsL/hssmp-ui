<template>
  <div>
    <div class="etools">

      <div class="manage-tools">
        <Button type="primary" class="managebtn" @click="handleAdd">+ 创建角色</Button>
      </div>

      <!--列表-->
      <Table  highlight-row ref="selection" :loading="loading" stripe
              :columns="sysRoleColumns"
              @on-sort-change="fragmentSysRole.SysRole.impl.onSortChange"
              :data="fragmentSysRole.SysRole.impl.dataList">
      </Table>
    </div>

    <!--分页-->
    <div class="page-crt">
      <Page :total="fragmentSysRole.SysRole.impl.totalCount"
            :current="fragmentSysRole.SysRole.impl.currentPage"
            :page-size="fragmentSysRole.SysRole.impl.pageSize"
            :page-size-opts="[1, 20, 50, 100]"
            @on-change="fragmentSysRole.SysRole.impl.onCurrentPageChange"
            @on-page-size-change="fragmentSysRole.SysRole.impl.onPageSizeChange"
            show-total show-elevator show-sizer>
      </Page>
    </div>

    <!--操作区域-->
    <role-edit ref="modalForm" @on-success="refreshFragmentSysRole"></role-edit>

  </div>
</template>
<script>
  import '../single.css'
  import RoleEdit from './role-edit.vue'
  import { mapGetters } from 'vuex';
  import {SysUserController, SystemController} from '@/api'
  import { DropdownWidget, TableWidget } from '@/utils/widget.js'
  import { TableMixin } from '@/mixins/TableMixin.js'
  export default {
    name: 'RoleList',
    mixins: [TableMixin],
    components: {
      RoleEdit
    },
    data() {
      return {
        loading: false,
        sysRoleColumns: [
          {
            title: '序号',
            type: 'index'
          },
          {
            title: '角色名称',
            key: 'roleName',
            sortable: true
          },
          {
            title: '创建时间',
            key: 'createTime',
            sortable: true
          },
          {
            title: '操作',
            key: 'tools',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  'class': {
                    tools_icon_edit: true,
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
                    tools_icon_del: true,
                  },
                  on: {
                    click: () => {
                      this.remove(params.row)
                    }
                  }
                }, '')
              ]);
            }
          }
        ],
        fragmentSysRole: {
          formFilter: {
            sysRoleName: undefined
          },
          formFilterCopy: {
            sysRoleName: undefined
          },
          SysRole: {
            impl: new TableWidget(this.loadSysRoleData, this.loadSysRoleVerify, true, false)
          },
          isInit: false
        },
      }
    },
    methods: {
      // 获取用户详情
      loadRowData (row) {
        return new Promise((resolve, reject) => {
          let params = {
            roleId: row.roleId
          }
          SystemController.getRole(params).then(res => {
            resolve(res.data);
          }).catch(e => {
            reject(e);
          });
        });
      },
      /**
       * 用户角色数据获取函数，返回Primise
       */
      loadSysRoleData (params) {
        params.sysRoleFilter = {
          roleName: this.fragmentSysRole.formFilterCopy.sysRoleName
        }
        return new Promise((resolve, reject) => {
          SystemController.getRoleList(params).then(res => {
            resolve({
              dataList: res.data.dataList,
              totalCount: res.data.totalCount
            });
          }).catch(e => {
            reject(e);
          });
        });
      },
      /**
       * 用户角色数据获取检测函数，返回true正常获取数据，返回false停止获取数据
       */
      loadSysRoleVerify () {
        this.fragmentSysRole.formFilterCopy.sysRoleName = this.fragmentSysRole.formFilter.sysRoleName;
        return true;
      },
      /**
       * 更新角色列表
       */
      refreshFragmentSysRole (reloadData = false) {
        // 重新获取数据组件的数据
        if (reloadData) {
          this.fragmentSysRole.SysRole.impl.refreshTable(true, 1);
        } else {
          this.fragmentSysRole.SysRole.impl.refreshTable();
        }
        this.fragmentSysRole.isInit = true;
      },
      onResume () {
        this.refreshFragmentSysRole();
      },
      initFormData () {
      },
      formInit () {
        this.initFormData();
        this.refreshFragmentSysRole();
      },
      remove(row) {

        this.$Modal.confirm({
          title: '提示',
          content: '<div style="padding-top:20px"><i class="ivu-icon ivu-icon-md-help-circle" style="font-size:30px;vertical-align: middle;color:#e8841e;"></i>是否确认删除该角色？</div>',
          onOk: () => {
            let data = {
              roleId: row.roleId
            }
            SystemController.deleteRole(data).then(res=>{
              if(res.success){
                this.$Message.success("已删除该角色")
                this.refreshFragmentSysRole();
              }
            }).catch(e=>{})
          }
        });
      }
    },
    created() {
      this.formInit();
    }
  }
</script>

<style lang="less">

</style>
