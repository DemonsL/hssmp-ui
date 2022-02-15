<template>
   <div class="info-box baseinfo">
    <h3>基本信息<Icon type="md-person" size="18" /></h3>
    <ul>
      <li><label>SD-WAN设备：</label><span>FT-40F、60F</span></li>
      <li><label>城市：</label><span>深圳、上海</span></li>
      <li><label>加速带宽：</label><span>40M</span></li>
    </ul>
    <Divider />

    <h3>服务时间<Icon type="ios-list-box" size="18" /></h3>
    <ul>
      <li><label>服务时间：</label><span>{{startTime + ' - ' + endTime}}</span></li>
    </ul>
    <Divider />

    <h3>服务方式<Icon type="ios-call" size="18" /></h3>
    <ul>
      <li><label>服务热线：</label><span>0755-88878978</span></li>
<!--      <li><label>专属客服QQ：</label><span>294544125 <a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=294544125&site=qq&menu=yes"><img border="0" src="@/assets/images/qq.png" alt="" title="点击这里给我发消息" style="vertical-align: middle;"/></a></span></li>-->
    </ul>
    </div>
</template>

<script>
import { getServicesPeriod } from '@/api/upms'
export default {
  name: 'info',
  data () {
    return {
      startTime: '',
      endTime: ''
    }
  },
  methods: {
    getPeriod () {
      getServicesPeriod({ serviceType: 'SDWAN' }).then(res => {
        if (res.success) {
          this.startTime = res.data.startTime
          this.endTime = res.data.endTime
        }
      })
    }
  },
  mounted () {
    this.getPeriod()
  }
}
</script>

<style>
  @import './info_box.css';
</style>
