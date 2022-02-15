<template>
  <div class="manage-tools">
    <Modal class="Hmbox"
           v-model="visible"
           :title="title"
           width="650"
           @on-ok="handleOk"
           @on-cancel="handleCancel('form')">
      <div class="winbox-edit add-member">
        <Form ref="form" :model="formData" :rules="rules" :label-width="180">
          <FormItem label="昵称:" prop="showName">
            <Input v-model="formData.showName"></Input>
          </FormItem>
          <FormItem label="手机号码（登录名）:" prop="loginPhone">
            <Input v-model="formData.loginPhone"></Input>
          </FormItem>
          <FormItem label="邮箱:" prop="email">
            <Input v-model="formData.email"></Input>
          </FormItem>
          <FormItem label="工号:" prop="workNo">
            <Input v-model="formData.workNo"></Input>
          </FormItem>
          <FormItem label="密码:" prop="password" v-if="!isEdit">
            <Input v-model="formData.password"></Input>
          </FormItem>
          <FormItem label="确认密码:" prop="passwordCheck" v-if="!isEdit">
            <Input v-model="formData.passwordCheck"></Input>
          </FormItem>
          <FormItem label="角色:" prop="roleIdList">
            <Select v-model="formData.roleIdList" placeholder="选择角色" multiple>
              <Option v-for="role in roleList" :value="role.roleId" :key="role.roleId">{{ role.roleName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="状态:" prop="userStatus" v-if="isEdit">
            <RadioGroup v-model="formData.userStatus">
              <Radio v-for="item in SysUserStatus.getList()" :label="item.id" :key="item.id">{{item.name}}</Radio>
            </RadioGroup>
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>
<script>
import pick from 'lodash.pick'
import {SysUserController, SystemController, SysDataPermController, SysDeptController} from '@/api'
import { DropdownWidget } from '@/utils/widget.js'
import { validFields } from '@/libs/util'
export default {
  data () {
    return {
      visible: false,
      title: '添加',
      isEdit: false,
      formData: {
        userId: undefined,
        showName: undefined,
        loginPhone: undefined,
        loginName: undefined,
        email: undefined,
        workNo: undefined,
        password: undefined,
        passwordCheck: undefined,
        userType: 2,
        dataPermIdList: [],
        roleIdList: [],
        userStatus: 0,
        deptId: undefined
      },
      rules: {
        showName: [{required: true, message: '姓名不能为空', trigger: 'blur'}],
        loginPhone: [{required: true, message: '必须填写手机号码', trigger: 'blur'}],
        // email: [{required: true, message: '邮箱地址不能为空', trigger: 'blur'}, {type: "email", message: '请填写正确的邮箱地址', trigger: 'blur'}],
        // workNo: [{required: true, message: '工号不能为空', trigger: 'blur'}],
        password: [{required: true, message: '密码不能为空', trigger: 'blur'}],
        passwordCheck: [{required: true, message: '重输密码不能为空', trigger: 'blur'}],
        roleIdList: [{required: true, type: 'array', message: '必须选择角色', trigger: 'change'}]
        // dataPermIdList: [{required: true, message: '数据权限不能为空', trigger: 'change'}],

      },
      dataPermList: [],
      roleList: [],
      deptId: undefined
    }
  },
  methods: {
    add () {
      this.edit({})
    },
    edit (rowData) {
      console.log(rowData)
      this.$refs.form.resetFields();
      // this.params = Object.assign({}, rowData);
      this.visible = true;
      if (rowData.userId === undefined) {
        this.isEdit = false
        this.title = '添加用户'
        // NOTE: 添加用户在前端暂时不放开提供客户选择,由这里进行初始化，涉及到部门选择,数据权限选择.
        this.formData.deptId = this.deptId
        this.formData.dataPermIdList = this.dataPermList.map(item => item.dataPermId);
        // NOTE: 角色选择器由这里进行初始化
        this.formData.roleIdList = this.roleList.map(item => item.roleId);
      } else {
        this.isEdit = true
        this.title = '编辑用户'
        this.formData = {...rowData, dataPermIdList: [], roleIdList: []};
        if (Array.isArray(this.formData.sysDataPermUserList)) {
          this.formData.dataPermIdList = this.formData.sysDataPermUserList.map(item => item.dataPermId);
        }
        if (Array.isArray(this.formData.sysUserRoleList)) {
          this.formData.roleIdList = this.formData.sysUserRoleList.map(item => item.roleId);
        }
      }
      console.log('edit', this.formData)
    },
    loadRole () {
      SystemController.getRoleList({}).then(res => {
        this.roleList = res.data.dataList;
      }).catch(e => {});
    },
    loadDataPerm () {
      SysDataPermController.list({}).then(res => {
        this.dataPermList = res.data.dataList;
      }).catch(e => {});
    },
    loadRowData (id) {
      let params = {
        userId: id
      }
      return SystemController.getUser(params);
    },
    loadDeptList () {
      SysDeptController.list({}).then(res => {
        console.log('dept:', res.data.dataList);
        this.deptId = res.data.dataList[0].deptId
      }).catch(e => {});
    },
    handleOk () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let params = {
            sysUser: {
              userId: this.formData.userId,
              loginName: this.formData.loginPhone, // 登入名称目前与手机号码一致
              password: this.formData.password,
              showName: this.formData.showName,
              userType: this.formData.userType,
              deptId: this.formData.deptId,
              userStatus: this.formData.userStatus,
              email: this.formData.email,
              workNo: this.formData.workNo,
              loginPhone: this.formData.loginPhone
            },
            dataPermIdListString: Array.isArray(this.formData.dataPermIdList) ? this.formData.dataPermIdList.join(',') : undefined,
            roleIdListString: Array.isArray(this.formData.roleIdList) ? this.formData.roleIdList.join(',') : undefined
          }

          let operation = null;
          if (this.formData.userId != null) {
            operation = SystemController.updateUser(params);
          } else {
            operation = SystemController.addUser(params);
          }

          operation.then(res => {
            if (res.success) {
              this.$Message.success(this.formData.userId != null ? '编辑成功' : '添加成功');
              this.$emit('on-success')
            }
            this.handleCancel('form');
          }).catch(e => {})
        }
      })
    },
    handleCancel (name) {
      this.$refs[name].resetFields();
    }
  },
  mounted () {
    this.loadRole();
    this.loadDataPerm();
    this.loadDeptList();
  },
  watch: {
    // isEdit(){
    //   if(this.isEdit){
    //     this.rules = {
    //       showName: [{required: true, message: '姓名不能为空', trigger: 'blur'}],
    //       loginPhone: [{required: true, message: '必须填写手机号码', trigger: 'blur'}],
    //       roleIdList: [{required: true, message: '必须选择角色', trigger: 'blur'}],
    //     }
    //   }else{
    //     this.rules = {
    //       showName: [{required: true, message: '姓名不能为空', trigger: 'blur'}],
    //       loginPhone: [{required: true, message: '必须填写手机号码', trigger: 'blur'}],
    //       password: [{required: true, message: '密码不能为空', trigger: 'blur'}],
    //       passwordCheck: [{required: true, message: '重输密码不能为空', trigger: 'blur'}],
    //       roleIdList: [{required: true, message: '必须选择角色', trigger: 'blur'}],
    //     }
    //   }
    // }
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
  .winbox-edit.add-member .ivu-form-item-content .ivu-tooltip{position:absolute;top:3px;right:-30px;}
  .winbox-edit.add-member .ivu-form-item-content .ivu-tooltip i.ivu-icon{color:#e78a2f;font-size:24px; margin-left:10px;}
  .winbox-edit.add-member .ivu-tooltip-inner { color: #333; background-color: rgba(255, 255, 255, 0.9);}
  .winbox-edit.add-member .ivu-tooltip-popper .ivu-tooltip-arrow { border-top-color: rgba(255, 255, 255, 0.9);box-shadow: 0 6px 6px rgba(0, 0, 0, 0.2);  }
  .winbox-edit.info-edit li > label{margin-right:15px;}
</style>
