<template>
  <div class="maincont">
    <div class="dev-page">
      <div class="manage-tools">
        <Form :model="searchForm">
          <Select style="width:130px" placeholder="全部机房" v-model="searchForm.netroomId" @on-change="handleSearch">
            <Option v-for="item in listNetroom" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>

          <div class="manage-serch">
            <Input v-model.trim="searchForm.cabinetCode" search enter-button placeholder="请输入机柜编号 / 设备信息" style="width:300px;"  @on-search="handleSearch"/>
          </div>

        <div class="switch-dev">
          <router-link class="switch-dev-img" to="/Deview/device_page"></router-link>
          <router-link class="switch-dev-txt" to="/Deview/device_list"></router-link>
        </div>

        </Form>
      </div>
    </div>

    <div class="mainbox boxscoll">

<!--      科兴机房-->
      <div class="clearfix" v-if="listKxData.length">
        <h2><Icon type="md-arrow-dropright" size="24"/>科兴机房 <div class="more-btn" v-if ="listKxData.length>8" @click = "showTag"><span>{{flag?"查看更多":"收起"}}</span></div></h2>
          <div class="dev-comroom" :class="{'hidden':flag}">
            <List item-layout="vertical">
              <ListItem v-for="item in listKxData" :key="item.cabinetCode">
                <router-link :to="{path:'/Deview/device_info',query: {cabinetId: item.cabinetId}}">
                  <div :class="item.cabinetClass"></div>
                  <ListItemMeta :title="item.cabinetCode" />
                </router-link>
              </ListItem>
            </List>
          </div>
      </div>

<!--      环球机房-->
      <div class="clearfix" v-if="listHqData.length">
        <h2><Icon type="md-arrow-dropright" size="24"/>环球机房 <div class="more-btn" v-if ="listHqData.length>8" @click = "showTag"><span>{{flag?"查看更多":"收起"}}</span></div></h2>
        <div class="dev-comroom" :class="{'hidden':flag}">
          <List item-layout="vertical">
            <ListItem v-for="item in listHqData" :key="item.cabinetCode">
              <router-link :to="{path:'/Deview/device_info',query: {cabinetId: item.cabinetId}}">
                <div :class="item.cabinetClass"></div>
                <ListItemMeta :title="item.cabinetCode" />
              </router-link>
            </ListItem>
          </List>
        </div>
      </div>

<!--      南湾机房-->
      <div class="clearfix" v-if="listNwData.length">
        <h2><Icon type="md-arrow-dropright" size="24"/>南湾机房 <div class="more-btn" v-if ="listNwData.length>8" @click = "showTag"><span>{{flag?"查看更多":"收起"}}</span></div></h2>
        <div class="dev-comroom" :class="{'hidden':flag}">
          <List item-layout="vertical">
            <ListItem v-for="item in listNwData" :key="item.cabinetCode">
              <router-link :to="{path:'/Deview/device_info',query: {cabinetId: item.cabinetId}}">
                <div :class="item.cabinetClass"></div>
                <ListItemMeta :title="item.roomNumber+'-'+item.cabinetCode" />
              </router-link>
            </ListItem>
          </List>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import '../traffic.less'
import { assetCabinetList } from '@/api/asset'

export default {
  data () {
    return {
      searchForm: {},
      listNetroom: [
        {
          value: '0',
          label: '全部机房'
        },
        {
          value: '4',
          label: '科兴机房'
        },
        {
          value: '3',
          label: '环球机房'
        },
        {
          value: '31',
          label: '南湾机房'
        }
      ],
      listNwData: [],
      listKxData: [],
      listHqData: [],
      flag: true
    }
  },
  methods: {
    DescribeCabinetList (filterBy) {
      this.listKxData = []
      this.listHqData = []
      this.listNwData = []
      this.loading = true
      assetCabinetList(filterBy).then(res => {
        let dataList = res.data.dataList
        this.loading = false
        if (dataList) {
          dataList.forEach((item, i) => {
            let cabinetClass="dev-pic-cabinet";
            if(item.errorDevice){
              cabinetClass="dev-pic-cabinet-error";
            }
            item.cabinetClass=cabinetClass;

            if (item.netroomId === 4) {
              this.listKxData = this.listKxData.concat(item)
            }
            if (item.netroomId === 3) {
              this.listHqData = this.listHqData.concat(item)
            }
            if (item.netroomId === 31) {
              this.listNwData = this.listNwData.concat(item)
            }
          })
        }
      })
    },
    // 查询表单提交
    handleSearch () {
      this.loading = true
      let filterBy = {
        netroomId: this.searchForm.netroomId,
        cabinetCode: this.searchForm.cabinetCode
      }
      this.DescribeCabinetList(filterBy)
    },
    showTag () {
      this.flag = !this.flag
    }
  },
  mounted () {
    this.DescribeCabinetList()
  }
}
</script>
