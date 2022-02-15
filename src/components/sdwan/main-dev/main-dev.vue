<template>
  <Layout style="height:100%" class="main">
    <Header class="header-con">
      <header-bar>
        <user :user-avator="userAvator"/>
      </header-bar>
    </Header>
    <Sider hide-trigger collapsible :width="190" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">
      <div class="side-menu-wrapper">
        <div class="search-con">
          <Input suffix="" @on-change="queryByKey" v-model="queryData"	 placeholder="输入内容" style="width:100%" />
        </div>
        <Menu active-name="name1" :open-names="[11111]" ref="side_menu" width="190">
          <Submenu :name="11111">
            <template slot="title">
              <Icon type="ios-paper" />
              设备分组
            </template>
            <MenuItem :to="{path:'/Device/device_page'}" :name="'name' + (index+1)"  @click.native="clickGroupName(nav.url,{})"  v-for="(nav, index) in menus" :key="nav.name">{{ nav.title }}</MenuItem>
          </Submenu>
        </Menu>
      </div>

    </Sider>
<!--    <div style="width: 100%">-->
<!--      <Device_Dom :msg="devicedata" @success="serchValue"></Device_Dom>-->
<!--    </div>-->

    <Layout>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <Content class="content-wrapper" >
            <router-view :msg="devicedata"  @success="serchValue"/>
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>

</template>
<script>
import HeaderBar from '../main/components/header-bar'
import User from '_c/public/user'
import {getObjectFromSessionStorage, setObjectToSessionStorage} from '@/utils'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import '../main/main.less'
import {getSdWanGroupList,getSdWanGroupDeviceList,getSdWanGroupDeviceDetail} from "@/api/sdwan";
import Device_Dom from '@/view/sdwan/device/device_dom.vue'
export default {
  name: 'MainDev',
  components: {
    HeaderBar,
    User,
    Device_Dom
  },
  data () {
    return {
      queryData: '',
      collapsed: false,
      msg:'init',
      menus: [
        // { name:'1-1' , title: '暂无分组' , url:'/device/device_page'},
      ],
      defaultGroupName:'',
      adomName:getObjectFromSessionStorage('sdWanAdom'),
      deviceList: [],
      deviceDetaiListObj : {},
      devicedata: [],
      addManage: false,
      decbox: '',
      serchDataObj: {},
      sList:[],
      menus2:[],
      sList1: []
    }
  },
  computed: {
    userAvator () {
      return this.$store.state.upms.avatorImgPath
    }
  },
  methods: {
    queryByKey(){
        if(this.menus2.length > 0){
          this.menus = this.menus2;
        }
        let queryData = this.queryData.trim(); let dataArr = [];
        if(this.menus.length > 0){
          this.menus.forEach(function(v,k){
            let dataJson = {};
            if(v.name.indexOf(queryData) != "-1") {
              dataJson.name  = v.name;
              dataJson.title = v.name;
              dataJson.url   = v.name;
              dataArr.push(dataJson);
            }
          });
          this.menus2 = this.menus;
          this.menus = dataArr;

        }
    },
    getGroupListName(){
      let data  = {};
      data.adomName = this.adomName;
      getSdWanGroupList(data).then(res => {   //获取组列表
        if (res.data && res.data.length > 0){
          this.menus = [];
          for (let i = 0; i < res.data.length; i++){
            if(i === 0){
              this.defaultGroupName = res.data[i].name;
            }
            let obj = {};
            obj.name  = res.data[i].name;
            obj.title = res.data[i].name;
            obj.url   = res.data[i].name;
            this.menus.push(obj);
          }
        }
      }).then(res=>{   //获取组下面的设备信息
        let data  = {};
        data.adomName  = this.adomName;
        data.groupName = this.defaultGroupName;
        getSdWanGroupDeviceList(data).then(res => {
          if(res.data && res.data['object member'].length > 0){
            for (let i = 0; i < res.data['object member'].length; i++){
              if(this.deviceList.indexOf(res.data['object member'][i].name) == "-1"){
                this.deviceList.push(res.data['object member'][i].name);
              }
            }
          }
        }).then(res => {   //获取设备的详细信息
          let data  = {}; let deviceDetaiListArr = [];  let vdomListArray = [];
          data.adomName  = this.adomName;
          if(this.deviceList.length > 0){
            for (let i = 0; i < this.deviceList.length;i++){
              data.deviceName = this.deviceList[i];
              getSdWanGroupDeviceDetail(data).then(res => {
                this.deviceDetaiListObj.id                =  i;
                this.deviceDetaiListObj.deviceName            = res.data.name;
                this.deviceDetaiListObj.device            = res.data.name;
                this.deviceDetaiListObj.host              = res.data.hostname;
                this.deviceDetaiListObj.ip                = res.data.ip;
                this.deviceDetaiListObj.os                = res.data.platform_str;
                if( res.data.vdom.length > 0){
                  res.data.vdom.forEach(function(item, index){

                    let vdomListObj = {};
                    vdomListObj.id     = index + 1;
                    vdomListObj.deviceName = res.data.name;
                    vdomListObj.device = item.name;
                    vdomListObj.ip     = item.ip ? item.ip : '-';
                    vdomListObj.host   = item.hostname ? item.hostname : '-';
                    vdomListObj.os     = '-';//res.data.name
                    vdomListArray.push(vdomListObj)
                  })
                }
                this.deviceDetaiListObj.children = vdomListArray;
                deviceDetaiListArr.push( this.deviceDetaiListObj );
              })
            }
            this.devicedata =  deviceDetaiListArr;
            this.sList      =  deviceDetaiListArr;
          }
        });
      })
    },clickGroupName(groupName,serchObj){
      let data  = {};
      if(serchObj.name){
        data.serchName = serchObj.name;
      }

      if(serchObj.value){
        data.serchValue = serchObj.value;
      }
      data.adomName  = this.adomName;
      data.groupName = groupName;
      this.deviceList = [];
      this.deviceDetaiListObj = {};
      this.devicedata = [];
      getSdWanGroupDeviceList(data).then(res => {
        if(res.data && res.data['object member'] && res.data['object member'].length > 0){
          for (let i = 0; i < res.data['object member'].length; i++){
            if(this.deviceList.indexOf(res.data['object member'][i].name) == "-1"){
              this.deviceList.push(res.data['object member'][i].name);
            }
          }
        }
      }).then(res => {   //获取设备的详细信息
        let data  = {}; this.deviceDetaiListObj = {}; let deviceDetaiListArr = [];   let vdomListArray = [];
        data.adomName  = this.adomName;
        if(this.deviceList.length > 0){
          for (let i = 0; i < this.deviceList.length;i++){
            data.deviceName = this.deviceList[i];
            getSdWanGroupDeviceDetail(data).then(res => {
              this.deviceDetaiListObj.id                =  i;
              this.deviceDetaiListObj.device            = res.data.name;
              this.deviceDetaiListObj.host              = res.data.hostname;
              this.deviceDetaiListObj.ip                = res.data.ip;
              this.deviceDetaiListObj.os                = res.data.platform_str;
              if( res.data.vdom.length > 0){
                res.data.vdom.forEach(function(item, index){
                  let vdomListObj = {};
                  // vdomListObj.id     = index;
                  vdomListObj.device = item.name;
                  vdomListObj.ip     = item.ip ? item.ip : '-';
                  vdomListObj.host   = item.hostname ? item.hostname : '-';
                  vdomListObj.os     = '-';//res.data.name
                  vdomListArray.push(vdomListObj)
                })
              }
              this.deviceDetaiListObj.children = vdomListArray;
              deviceDetaiListArr.push( this.deviceDetaiListObj );
            })
          }
          this.devicedata = deviceDetaiListArr;
          this.sList =  deviceDetaiListArr;
        }
      });

    },
    serchValue(dataObj){
      if(dataObj.value == ''){
        this.devicedata = this.sList; return ;
      }
      let serchData = [];
      if(this.sList.length > 0 && dataObj.value != ''){
        this.sList.forEach(function(item, index) {
          if(dataObj.name == 'deviceName'){
              if(item.device.indexOf(dataObj.value) != "-1" ){
                serchData.push(item);
              }
          }else if(dataObj.name == 'name'){
            if(item.host.indexOf(dataObj.value) != "-1" ){
              serchData.push(item);
            }
          }else if(dataObj.name == 'ip'){
            if(item.ip.indexOf(dataObj.value) != "-1" ){
                serchData.push(item);
              }
          }
        })
        this.devicedata = serchData;
      }
      // this.clickGroupName(this.defaultGroupName,dataObj);
    },
  },
  watch: {
    menus: function (val, oldVal) {
      this.$nextTick(() => {
        this.$refs.side_menu.updateOpened()
        this.$refs.side_menu.updateActiveName()
      })
    },
  },
  mounted () {
    this.getGroupListName();
    let $this = this;
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
