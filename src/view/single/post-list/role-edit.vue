<template>
  <div class="manage-tools">
    <Modal class="Hmbox" width="600" v-model="visible"
           :title="title"
           @on-ok="handleOk"
           @on-cancel="handleCancel('form')">
      <div class="winbox-edit">
        <Form ref="form" :model="formData" :rules="rules" :label-width="120">
          <FormItem label="角色名称:" prop="roleName">
            <Input v-model="formData.roleName" placeholder="输入角色名称"></Input>
          </FormItem>
        </Form>

        <div class="post-box-menu" style="margin-left:80px;">
          <div class="header-post-box">
            <label>菜单权限</label>
            <Input suffix="ios-search" placeholder="输入菜单名称过滤" style="width:200px;" v-model="menuNameFilter" />
          </div>

          <div class="post-box-cont">
            <my-tree ref="authTree" :data="authData" :props="treeProps" :check-strictly="false"
                     show-checkbox node-key="menuId" :filter-node-method="filterMneuNode"></my-tree>
          </div>
        </div>
      </div>
    </Modal>

  </div>
</template>
<script>
import pick from 'lodash.pick'
import { treeDataTranslate, findItemFromList } from '@/utils'
import {SystemController} from '@/api'
import { DropdownWidget } from '@/utils/widget.js'
import MyTree from '_c/my-tree'
export default {
  name: 'RoleEdit',
  components: {
    MyTree
  },
  data () {
    return {
      visible: false,
      title: '添加',
      isEdit: false,
      formData: {
        roleId: undefined,
        roleName: undefined,
        menuIdListString: undefined,
        menuIdList: []
      },
      rules: {
        roleName: [{required: true, message: '名称不能为空', trigger: 'blur'}]
      },
      treeProps: {
        label: 'menuName'
      },
      authData: [],
      allowParentList: [],
      roleTreeData: [],
      menuNameFilter: undefined
    }
  },
  methods: {
    filterMneuNode (value, data) {
      if (!value) return true;
      if (data.menuName.indexOf(value) !== -1) {
        this.allowParentList.push(data.menuId);
        return true;
      } else {
        return this.allowParentList.indexOf(data.parentId) !== -1;
      }
    },
    add () {
      this.edit({})
    },
    edit (rowData) {
      this.$refs.form.resetFields();
      this.visible = true;
      this.$refs.authTree.setCheckedKeys([]);
      if (rowData.roleId === undefined) {
        this.isEdit = false
        this.title = '添加角色'
      } else {
        this.isEdit = true
        this.title = '编辑角色'
        this.formData = {...this.formData, ...rowData};
        if (Array.isArray(this.formData.sysRoleMenuList)) {
          this.formData.menuIdList = this.formData.sysRoleMenuList.map(item => item.menuId);
        }
        this.loadAuthData()
      }
      this.roleTreeData = this.authData
    },
    handleOk () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let selectMenu = [];
          // selectMenu = this.$refs.authTree.getHalfCheckedKeys();
          selectMenu = selectMenu.concat(this.$refs.authTree.getCheckedKeys());
          let params = {
            sysRole: {
              roleId: this.formData.roleId,
              roleName: this.formData.roleName
            }
          }

          if (selectMenu.length <= 0) {
            this.$Message.error({message: '请选择角色的菜单权限', showClose: true});
            return;
          }
          params.menuIdListString = selectMenu.join(',');

          let operation = null;
          if (this.isEdit) {
            operation = SystemController.updateRole(params);
          } else {
            operation = SystemController.addRole(params);
          }

          operation.then(res => {
            this.$Message.success(this.formData.roleId != null ? '编辑成功' : '添加成功');
            this.$emit('on-success')
            this.handleCancel('form');
          }).catch(e => {})
        }
      })
    },
    handleCancel (name) {
      this.$refs[name].resetFields();
    },
    loadAuthData () {
      SystemController.getMenuPermList({}).then(res => {
        this.authData = treeDataTranslate(res.data, 'menuId', 'parentId');
        if (Array.isArray(this.formData.menuIdList)) {
          let tempList = [];
          this.formData.menuIdList.forEach((item) => {
            let tempMenu = findItemFromList(res.data, item, 'menuId');
            // 判断是否为叶子节点
            if (tempMenu != null && (!Array.isArray(tempMenu.children) || tempMenu.children.length <= 0)) {
              tempList.push(item);
            }
          });
          this.roleTreeData = tempList;
          this.$refs.authTree.setCheckedKeys(tempList);
        }
      }).catch(e => {});
    }
  },
  mounted () {
    this.loadAuthData();
  },
  watch: {
    menuNameFilter (val) {
      this.allowParentList = [];
      this.$refs.authTree.filter(val);
    }
  }
}
</script>

<style>
  .manage-tools {padding-bottom: 10px;}
  .manage-tools .managebtn {width: 110px;text-align: center;background: #1b63c0;color: #FFF;font-size: 14px;height: 32px;margin-right: 10px;}
  .manage-tools .ivu-input-search i {font-size: 20px;color: #FFF !important;}
  .ivu-select-single .ivu-select-selection .ivu-select-placeholder,
  .ivu-select-single .ivu-select-selection .ivu-select-selected-value {height: 32px;line-height: 32px;}
  .manage-tools .manage-serch {display: inline-block;vertical-align: middle;margin-left: 10px;}
  .manage-tools .manage-serch .ivu-input-group .ivu-input {background: #FFF;-webkit-box-shadow: none;box-shadow: none;border: solid 1px #DDD;height: 32px;line-height: 32px;}
  .manage-tools .manage-serch .ivu-input-search:before {display: none;}
  .manage-tools .manage-serch .ivu-input-search {background: #1b63c0 !important;border-color: #1b63c0 !important;}
  .manage-tools .manage-serch .ivu-input-search:hover {background: #e8841e !important;border-color: #e8841e !important;}
  .winbox-edit { padding-right:80px;}
  .post-box-menu{ border:solid 1px #DDD;border-radius:3px;}
  .header-post-box{height:45px;border-bottom:solid 1px #DDD;line-height:45px; padding:0 10px;}
  .header-post-box .ivu-input-wrapper{float:right;margin:7px 0 0 0;}
  .post-box-cont{padding:10px;max-height:300px;overflow-y: auto;}
</style>
