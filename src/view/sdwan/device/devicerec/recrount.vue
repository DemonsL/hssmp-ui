<template>
  <div class="dev-colony">
    <h4>路由
<!--      <div class="select-box">-->
<!--        <Input search enter-button placeholder="网络 / 远端网关"  @on-search="queryByKey"/>-->
<!--      </div>-->
    </h4>

<!--        <vxe-table show-overflow highlight-hover-row max-height="390" :sort-config="{trigger: 'cell'}" ref="xTree"-->
<!--                   :tree-config="{children: 'children', expandAll: true,iconOpen: 'ivu-icon ivu-icon-ios-remove', iconClose: 'ivu-icon ivu-icon-ios-add'}"-->
<!--                   :data="data1">-->
<!--          <vxe-table-column field="net" title="网络" tree-node></vxe-table-column>-->
<!--          <vxe-table-column field="ipway" title="网关IP"></vxe-table-column>-->
<!--          <vxe-table-column field="port" title="接口" show-overflow></vxe-table-column>-->
<!--        </vxe-table>-->

<!--    <Scroll :on-reach-bottom="test">-->
<!--    <Table row-key="id" :columns="columns1" :data="data1" ></Table>-->
<!--    </Scroll>-->

    <vxe-table resizable :data="data1">
      <vxe-table-column field="net" title="网络"></vxe-table-column>
      <vxe-table-column field="ipway" title="网关IP"></vxe-table-column>
      <vxe-table-column field="port" title="接口"></vxe-table-column>
      <vxe-table-column title="操作" width="100" align="center" show-overflow>
        <template #default="{ row }">
          <Button shape="circle" icon="ios-paper-outline" @click="detail(row)"></Button>
        </template>
      </vxe-table-column>
    </vxe-table>

    <Modal v-model="modal11" type="info" title="详情" width="800" >
      <vxe-toolbar>
        <template #buttons>
          <vxe-input v-model="filterName" type="search" placeholder="网络 / 网关IP /接口" @keyup="searchEvent1"></vxe-input>
        </template>
      </vxe-toolbar>
      <vxe-table auto-resize show-overflow highlight-hover-row max-height="430" style="margin:0 auto 20px auto;" :data="list1">
        <vxe-table-column field="net" sortable  align="left" title="网络"></vxe-table-column>
        <vxe-table-column field="ipway" sortable  align="center" title="网关IP"></vxe-table-column>
        <vxe-table-column field="port" sortable  align="center" title="接口" show-overflow></vxe-table-column>
      </vxe-table>
    </Modal>
<!--    <div class="devcon-page-crt">-->
<!--      <Page class="paging" :total="totalCount" :page-size="pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-total show-elevator show-sizer />-->
<!--    </div>-->
  </div>
</template>
<script>
  import {getObjectFromSessionStorage} from "@/utils";
  import {getSdWanDeviceRunningTime} from "@/api/sdwan";
  import {getSdWanDeviceRouter} from "@/api/sdwan";
  import XEUtils from 'xe-utils'

  export default {
    data() {
      return {
        modal11:false,
        list1:[],
        filterName: '',
        pageNum: 1,
        totalCount: 0,
        pageSize: 10,
        columns1: [{
            title: '网络',
            key: 'net',
            tree: true,
            sortable: true
          },
          {
            title: '网关IP',
            key: 'ipway',
            sortable: true
          },
          {
            title: '接口',
            align: 'center',
            key: 'port',
            sortable: true,
            render: (h, params) => {
              return h('span', [
                h('i', {
                  'class': {
                    portico: true,
                  },
                },''),
                h("span", {}, params.row.port)
              ])
            }
          }
        ],
        data1:  [],
        data2:[]
      }
    },
    methods:{
      detail(row){
          this.data2 = row.children
          this.modal11 = true;
          this.searchEvent1();
      },
    //   queryByKey(value){
    //     this.getDeviceRouter(value);
    // },
      getDeviceRouter(){
        let data = {};
        data.adomName   = this.adomName;
        data.deviceName = this.deviceName;
        getSdWanDeviceRouter(data).then( res => {
          var dataArr = []; var serial = [];
          if(res.data.status.code == 0){
            res.data.response.forEach(function(v,k){
              if(serial.indexOf(v.serial) == "-1"){
                var dataJson = {}; var childrenArr = [];
                dataJson.id  = v.build + 1;
                dataJson.net = v.vdom;
                dataJson._showChildren = true;
                if(v.results.length > 0){
                  v.results.forEach(function(value,key){
                    // if(key > 10){
                    //   return false
                    // }
                    var childrenJson = {};
                    childrenJson.id       = key;
                    childrenJson.net      = value.ip_mask;
                    childrenJson.ipway    = value.gateway;
                    childrenJson.port     = value.interface;
                    childrenArr.push(childrenJson)
                  })
                }
                dataJson.children = childrenArr;
                dataArr.push(dataJson);
                serial.push(v.serial)
              }
            })
          }
          this.data1 = dataArr;

          // if(value != undefined){
          //   this.search(value);
          // }
          // this.getTestData(this.pageNum, this.pageSize)
        });
      }
      // ,search(value){
      //   let searchObj = this.data1; let searchArr = [];
      //   if( this.data1.length > 0){
      //     this.data1.forEach(function(v,k){
      //       v.children.forEach(function(vv,kk){
      //         if(vv.ipway.indexOf(value) !== -1 || vv.net.indexOf(value) !== -1){
      //           let searchJson = {};
      //           searchJson.id       = kk;
      //           searchJson.net      = vv.net;
      //           searchJson.ipway    = vv.ipway;
      //           searchJson.port     = vv.port;
      //           searchArr.push(searchJson);
      //         }
      //       })
      //       if(searchArr.length > 0 ){
      //         searchObj[k].children = searchArr
      //       }else{
      //         searchObj = [];
      //       }
      //     })
      //   }
      //   this.data1 = searchObj;
      // }
      ,searchEvent1 () {
        const filterName = XEUtils.toValueString(this.filterName).trim().toLowerCase()
        if (filterName) {
          const filterRE = new RegExp(filterName, 'gi')
          const searchProps = ['net', 'ipway', 'port']
          const rest = this.data2.filter(item => searchProps.some(key => XEUtils.toValueString(item[key]).toLowerCase().indexOf(filterName) > -1))

          this.list1 = rest.map(row => {
            const item = Object.assign({}, row)
            searchProps.forEach(key => {
              item[key] = XEUtils.toValueString(item[key]).replace(filterRE, match => `${match}`)
            })
            return item
          })
        } else {
          this.list1 = this.data2
        }
      }
    }, created () {
      this.deviceName = getObjectFromSessionStorage("deviceName");
      this.adomName   = getObjectFromSessionStorage("sdWanAdom");
      this.getDeviceRouter();
      this.searchEvent1()
    }
  }
</script>

<style>
  .devcon-page-crt {
    padding-top: 10px;
    text-align: right;
  }
  .vxe-table--render-default .vxe-tree--btn-wrapper { height:auto;}
  .vxe-tree--btn-wrapper i{font-size:20px;}
  .ivu-modal-footer .ivu-btn-text{display:none;}
  .ivu-modal-body .vxe-table,
  .ivu-modal-body .vxe-toolbar {width:96%;margin:0 auto;}
</style>
