<template>
  <div class="info-box">
    <h3>基本信息<Icon type="md-person" size="18" /></h3>
    <ul>

      <li><label>账户ID：</label><span>{{getUserInfo.bmsCode}}</span></li>
      <li><label>账户昵称：</label><span>{{getUserInfo.tenantName}}</span></li>
      <li><label>账户负责人：</label><span>{{getUserInfo.tenantName}}</span></li>

      <li v-if="!checkIsAdmin()"><label>用户名：</label><span>{{getUserInfo.userName}}</span></li>
      <li><label>手机号码：</label><span>{{getUserInfo.phone}}</span></li>

    </ul>
    <Divider />

    <h3>服务周期<Icon type="ios-list-box" size="18" /></h3>
    <ul>
      <li v-for="item in servicesList" :key="item.serviceId"><label>{{item.serviceName}} 服务周期：</label><span>{{item.startTime}} 至 {{item.endTime}}</span></li>
    </ul>
    <Divider />

    <h3>服务方式<Icon type="ios-call" size="18" /></h3>
    <ul>
      <li><label>服务热线：</label><span>0755-88878978</span></li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {SysUserController } from '@/api'
export default {
  name: 'info_edit_page',
  data () {
    return {
      servicesList: []
    }
  },
  methods: {
    getServicesList () {
      SysUserController.getServicesList().then(res => {
        console.log(res)
        if (res.success) {
          this.servicesList = res.data.filter((item,index,arr) => {
            if(item.serviceId !== 3 ){
              return item
            }
          });
        }
      }).catch(e => {})
    }
  },

  computed: {
    ...mapGetters(['getUserInfo'])
  },
  mounted () {
    this.getServicesList()
  }

}
</script>

<style>
  @import './info_box.css';
</style>
