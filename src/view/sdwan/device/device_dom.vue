<template>
  <div>
<!--    <Header class="header-con">-->
<!--      <header-bar>-->
<!--        <user :user-avator="userAvator"/>-->
<!--      </header-bar>-->
<!--    </Header>-->
<!--    <Sider hide-trigger collapsible :width="190" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">-->
<!--      <div class="side-menu-wrapper">-->
<!--        <div class="search-con">-->
<!--          <Input suffix="" :on-search="queryByKey"  placeholder="输入内容" style="width:100%" />-->
<!--        </div>-->
<!--        <Menu active-name="1-1" :open-names="['1']">-->
<!--          <Submenu name="1">-->
<!--            <template slot="title">-->
<!--              <Icon type="ios-paper" />-->
<!--              设备分组-->
<!--            </template>-->
<!--            <MenuItem :name="nav.name"  @click.native="clickGroupName(nav.url)"  v-for="nav in menus">{{ nav.title }}</MenuItem>-->
<!--          </Submenu>-->
<!--        </Menu>-->
<!--      </div>-->
<!--    </Sider>-->
    <div class="maincont">
      <div class="mainbox" style="top:0;">
      <!--    <SLAtools @success="serchValue"></SLAtools>-->

      <div class="manage-tools">
        <Select v-model="decbox" style="width:130px" default-label=" "  ref="newText">
          <Option v-for="item in selList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <div class="manage-serch">
          <Input search enter-button clearable placeholder="请输入关键字" @on-search="queryByKey"  style="width:200px;"/>
        </div>
      </div>

        <Table row-key="id" :columns="devheader" :data="msg" style="width: 100%">
          <template slot-scope="{ row }" slot="device">
            <router-link  :to="{path:'/Device/device_info',query: {deviceName: row.deviceName}}" class="devmtitle">{{ row.device }}</router-link>
          </template>
        </Table>
      </div>
    </div>
  </div>
</template>
<script>
  import '../traffic.less'
  import {getObjectFromSessionStorage, setObjectToSessionStorage} from '@/utils'
  import {getSdWanGroupList,getSdWanGroupDeviceList,getSdWanGroupDeviceDetail} from "@/api/sdwan";
  export default {
    name: 'Device_Dom',
    methods:{
      queryByKey(search){
        var searchObj = {};
        searchObj.value  = search.trim();
        searchObj.name   = this.decbox;
        if(this.decbox.length  > 0 ){
          this.$emit("success",searchObj)  //传值到父类页面
        }
      }
    },
    props: ['msg'],
    data() {
      return {
        spinShow:true,
        collapsed: false,
        // msg:'init',
        // menus: [
        //   { name:'1-1' , title: '暂无分组' , url:'/device/device_page'},
        // ],
        // defaultGroupName:'',
        // adomName:getObjectFromSessionStorage('sdWanAdom'),
        // deviceList: [],
        // deviceDetaiListObj : {},
        // devicedata: [],
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
        decbox: '',
        devheader: [
          {
            title: '设备名称',
            slot: 'device',
            tree:true,
            sortable: true
          },
          {
            title: '主机名',
            key: 'host',
            sortable: true
          },
          {
            title: 'IP地址',
            key: 'ip',
            sortable: true
          },
          {
            title: '平台',
            key: 'os',
            sortable: true
          }
        ],
        // devicedata: []
      }
    },
    mounted() {
      // console.log(this.msg)
      // this.getGroupListName();
      // let $this = this;
      // // this.msg = this.$children[0].sonMsg;
      // console.log(this.$children);
      // console.log(this.decbox)
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
.ivu-table-cell-tree .ivu-icon{font-size:14px;}
.ivu-select-arrow { margin-top: 0; }

.manage-serch .ivu-icon-ios-close-circle{right:55px;}
</style>
