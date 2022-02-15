<template>
  <div class="dev-colony">
    <h4>集群成员<Icon type="md-refresh" @click="refresh" /></h4>
    <Table :columns="columns1" :data="data1"></Table>
<!--    <div class="devcon-page-crt"><Page :total="100" show-total /></div>-->
    <Spin fix v-if="spinShow">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>Loading</div>
    </Spin>
  </div>
</template>
<script>
    export default {
        data () {
            return {
                columns1: [
                    {
                        title: '主机名称',
                        key: 'name'
                    },
                    {
                        title: '序列号',
                        key: 'serial'
                    },
                    {
                        title: '角色',
                        width:80,
                        align:'center',
                        key: 'role'
                    },
                    {
                        title: '优先级',
                        width:80,
                        align:'center',
                        key: 'pri'
                    }
                ],
                data1: [],
                spinShow:false
            }
        },
      methods:{
        childMethod(colonyList){
          this.data1 = colonyList;
          this.spinShow = false;
        },
        refresh(){
          this.spinShow = true;
          this.$emit("success")  //传值到父类页面
        }
      }
    }
</script>

<style>
  .devcon-page-crt{padding-top:10px;text-align:right;}
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
  }
  .demo-spin-col{
    height: 100px;
    position: relative;
    border: 1px solid #eee;
  }

</style>
