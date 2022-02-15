<template>
  <div class="dev-colony">
    <h4>SD-WAN 隧道
      <div class="select-box">
        <Input search enter-button placeholder="名称 / 远端网关" @on-search="queryByKey"/>
      </div>
    </h4>
    <Table row-key="id" :columns="columns1" :data="data1"></Table>
  </div>
</template>
<script>
import {getSdWanDeviceRouter, getSdWanDeviceVpn} from "@/api/sdwan";
  import {getObjectFromSessionStorage} from "@/utils";

  export default {
    data() {
      return {
        columns1: [{
            title: '名称',
            key: 'name',
            tree: true,
            sortable: true
          },
          {
            title: '远程网关',
            align: 'center',
            key: 'gateway',
            sortable: true
          },
          // {
          //   title: '对端ID',
          //   width: 100,
          //   align: 'center',
          //   key: 'popid',
          //   sortable: true
          // },
          {
            title: '流进数据',
            width: 180,
            align: 'center',
            key: 'indata',
            sortable: true,
            render: (h, params) => {
              return h('span', [
                h('label', {}, params.row.indatas + 'M'),
                h("Progress", {
                  'class': {
                    sdwantubein: true,
                  },
                  props: {
                    type: "Progress",
                    size: "small",
                    'hide-info': true,
                    percent: parseFloat(
                      params.row.indata
                    ),
                  },
                })
              ])
            },
          },
          {
            title: '流出数据',
            width: 180,
            align: 'center',
            key: 'outdata',
            sortable: true,
            render: (h, params) => {
              return h('span', [
                h('label', {}, params.row.outdatas + 'M'),
                h("Progress", {
                  'class': {
                    sdwantubeout: true,
                  },
                  props: {
                    type: "Progress",
                    size: "small",
                    'hide-info': true,
                    percent: parseFloat(
                      params.row.outdata
                    ),
                  },
                })
              ])
            },
          },
          // {
          //   title: '时间',
          //   width: 100,
          //   align: 'center',
          //   key: 'time',
          //   sortable: true
          // },
          {
            title: '远程端口',
            width: 150,
            align: 'center',
            key: 'port',
            sortable: true
          },
          {
            title: '状态',
            width: 80,
            align: 'center',
            key: 'state',
            sortable: true,
             render:(h, params) => {
              let status = params.row.state;
              if (status===1){ return h('i',{
                'class': {
                  devstateup: true,
                },
              },'') };
              if (status===2){ return h('i',{
                'class': {
                  devstatedown: true,
                },
              },'')};
              if (status===3){ return ""}
             }
          }
        ],
        data1: [
          // {
          //   id: 'r01',
          //   name: 'root(1)',
          //   indata: '0',
          //   outdata: '0',
          //   cellClassName: {
          //     name: 'table-title-row',
          //     gateway: 'table-title-row',
          //     popid: 'table-title-row',
          //     indata: 'table-title-row',
          //     outdata: 'table-title-row',
          //     time: 'table-title-row',
          //     port: 'table-title-row',
          //     state: 'table-title-row'
          //   },
          //   children: [{
          //       id: 'r0101',
          //       name: 'CPE-BJ-A',
          //       gateway: '191.147.14.15',
          //       popid: 'ID0001',
          //       indatas: '3.5', // 流进
          //       indata: '30',
          //       outdatas: '1.7', //流出
          //       outdata: '36',
          //       time: '2021-02-18',
          //       port: '192.1554.124.1',
          //       state: 1,
          //     }
          //   ]
          // }
        ]
      }
    },methods:{
      queryByKey(value){
        this.getDeviceVpn(value.trim());
      },
      getDeviceVpn(value){
        let data = {};
        data.adomName   = this.adomName;;
        data.deviceName = this.deviceName;
        getSdWanDeviceVpn(data).then( res => {
          var dataArr = []; var serial = [];
          if(res.data.status.code == 0){
            res.data.response.forEach(function(v,k){
              var dataJson = {}; var childrenArr = [];
              dataJson.id = "";
              dataJson.name = v.vdom;
              dataJson.indata = '0';
              dataJson.indatas = '0';
              dataJson.outdata = '0';
              dataJson.outdatas = '0';
              dataJson.sortable = true;
              dataJson._showChildren = true;
              if(v.results.length > 0){
                v.results.forEach(function(value,key){
                  if(key > 100){
                    return false
                  }
                  var childrenJson = {};
                  childrenJson.id           = key;
                  childrenJson.name         = value.name;
                  childrenJson.gateway      = value.rgwy;
                  childrenJson.popid        = value.interface;
                  childrenJson.indatas      = ((value.incoming_bytes / 1024) / 1024).toFixed(1);//value.interface;//流进数据
                  childrenJson.indata       =  ((1024 / childrenJson.indatas).toFixed(0)) * 10;//value.incoming_bytes;
                  childrenJson.outdatas     = ((value.outgoing_bytes / 1024) / 1024).toFixed(1); //流出数据
                  childrenJson.outdata      =  ((1024 / childrenJson.outdatas).toFixed(0)) * 10;
                  // childrenJson.time         = value.interface;
                  childrenJson.port         = value.rport;
                  childrenJson.state        = value.proxyid[0].status == 'up' ? 1 : 0;
                  childrenArr.push(childrenJson)
                })
                dataJson.children = childrenArr;
                dataArr.push(dataJson);
                serial.push(v.serial)
              }
            })
          }
         this.data1 = dataArr;
          if(value != undefined){
            this.search(value);
          }
        });
      },search(value){
        let searchObj = this.data1; let searchArr = [];
        if( this.data1.length > 0){
          this.data1.forEach(function(v,k){
            v.children.forEach(function(vv,kk){
              if(vv.name.indexOf(value) !== -1 || vv.gateway.indexOf(value) !== -1){
                let searchJson = {};
                searchJson.id           = kk;
                searchJson.name         = vv.name;
                searchJson.gateway      = vv.gateway;
                searchJson.popid        = vv.popid;
                searchJson.indatas      = vv.indatas;//value.interface;//流进数据
                searchJson.indata       = vv.indata;//value.incoming_bytes;
                searchJson.outdatas     = vv.outdatas; //流出数据
                searchJson.outdata      = vv.outdata;
                // childrenJson.time         = value.interface;
                searchJson.port         = vv.port;
                searchJson.state        = vv.state;
                searchArr.push(searchJson);
              }
            })
            if(searchArr.length > 0 ){
              searchObj[k].children = searchArr
            }else{
              searchObj = [];
            }
          })
        }
        this.data1 = searchObj;
      }
    } ,mounted () {
      this.deviceName = getObjectFromSessionStorage("deviceName");
      this.adomName   = getObjectFromSessionStorage("sdWanAdom");
      this.getDeviceVpn();
    }
  }
</script>

<style>

</style>
