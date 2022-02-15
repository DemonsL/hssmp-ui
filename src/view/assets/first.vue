<template>
  <div class="first-login-cont">
    <div class="first-top-cont">
      <Row type="flex" justify="center" align="middle" class="code-row-bg">
        <Col span="5"><img src="@/assets/images/pic01.png" alt="" /></Col>
        <Col span="19"><p>Hi 亲爱的 <strong>{{companyName}}</strong>，欢迎您登录【资产管理】服务，请先进行以下设备信息的配置，再进入管理界面。</p></Col>
      </Row>
    </div>
    <div class="first-cont">
      <div class="first-btn-cont">
        <div style="float:left;">
          <Button icon="ios-download-outline" @click="showDownloadModal" type="primary" :loading="downloadLoading">
            <span v-if="!downloadLoading">下载批量导入模板</span>
            <span v-else>下载中...</span>
          </Button>
        </div>
        <div style="float:left;margin-left:10px;">
          <Upload
            ref="upload"
            action="/admin/assetmanagement/asset/init/upload"
            :before-upload="handleUpload"
            :on-success="uploadSuccess"
            :format="['xlsx']"
            :on-format-error="handleFormatError"
            :headers="uploadHeader">
            <Button icon="md-filing" type="primary" :loading="uploadLoading">
              <span v-if="!uploadLoading">数据批量导入</span>
              <span v-else>导入中...</span>
            </Button>
          </Upload>
        </div>
      </div>
      <div class="clearfix first-table">
        <Table max-height="400" :loading="loading" :columns="columns12" :data="deviceList" @on-sort-change="sortChange">
          <template slot-scope="{ row, index }" slot="ipAddress">
            <Input v-model="row.ipAddress" size="small" style="width:auto" @on-blur="ipAddressBlur(row, index)" />
          </template>
          <!--<template slot-scope="{ row, index }" slot="macaddress">
            <Input v-model="row.macaddress" size="small" style="width:auto" />
          </template> -->
          <template slot-scope="{ row, index }" slot="user">
            <Input v-model="row.user" size="small" style="width:auto" @on-blur="userBlur(row, index)" />
          </template>
          <template slot-scope="{ row, index }" slot="password">
            <Input v-model="row.password" size="small" style="width:auto" @on-blur="passwordBlur(row, index)" />
          </template>
          <!--<template slot-scope="{ row, index }" slot="vncport">
            <Input v-model="row.vncport" size="small" style="width:auto" />
          </template>
          <template slot-scope="{ row, index }" slot="vncpass">
            <Input v-model="row.vncpass" size="small" style="width:auto" />
          </template> -->
        </Table>
      </div>
      <center>
        <Button size="large" type="info" :loading="saveLoading" @click="saveConfigure">
          <span v-if="!saveLoading">保存</span>
          <span v-else>保存中...</span>
        </Button>
        <Button size="large" type="primary" :loading="submitLoading" @click="submitConfigure">
          <span v-if="!submitLoading">提交</span>
          <span v-else>提交中...</span>
        </Button>
      </center>
    </div>
  </div>
</template>

<script >
import HeaderBar from '@/components/asset_manage/components/header-bar'
import User from '_c/public/user'
import { assetFirstTimeConfigureList, assetFirstTimeConfigureAction, assetFirstTimeConfigureDownloadTemplate, assetFirstTimeConfigurePageLoad } from '@/api/asset'
export default {
  components: {
    HeaderBar,
    User
  },
  data () {
    return {
      loading: true,
      saveLoading: false,
      submitLoading: false,
      downloadLoading: false,
      uploadLoading: false,
      companyName: '',
      columns12: [
        {
          type: 'index',
          width: 80,
          align: 'center',
          title: '序号'
        },
        {
          title: '所属机房',
          key: 'roomName',
          sortable: 'custom'
        },
        {
          title: '设备信息',
          key: 'deviceNumber'
        },
        {
          title: '机房号',
          key: 'roomnum',
          align: 'center'
        },
        {
          title: '机柜号',
          key: 'cabinum',
          align: 'center'
        },
        {
          title: 'U位',
          key: 'ulocat',
          align: 'center'
        },
        {
          title: 'IP地址',
          slot: 'ipAddress',
          align: 'center'
        },
        // {
        //   title: 'MAC地址',
        //   slot: 'macaddress',
        //   align: 'center'
        // },
        {
          title: '管理控制卡账号',
          slot: 'user',
          align: 'center'
        },
        {
          title: '管理控制卡密码',
          slot: 'password',
          align: 'center'
        },
        // {
        //   title: 'vnc端口',
        //   slot: 'vncport',
        //   align: 'center'
        // },
        // {
        //   title: 'vnc密码',
        //   slot: 'vncpass',
        //   align: 'center'
        // },
        {
          title: '上架时间',
          key: 'shelvesDate',
          align: 'center',
          sortable: 'custom'
        }
      ],
      deviceList: [],
      uploadHeader: { 'Authorization': this.$store.state.upms.userInfo.tokenData }
    }
  },

  methods: {
    handleUpload (file) {
      this.uploadLoading = true
    },
    uploadSuccess (response, file, fileList) {
      let that = this
      if (!response || !response.success) {
        that.uploadLoading = false
        that.$Notice.warning({
          title: '上传失败',
          desc: '文件 ' + file.name + ' 上传失败'
        })
      }
      if (response.data && parseInt(response.data.totalCount) > 0) {
        let dataObjs = []
        response.data.dataList.forEach(function (item, key) {
          dataObjs[item.deviceNumber] = item
        })
        that.deviceList.forEach(function (item, key) {
          if (dataObjs[item.deviceNumber]) {
            that.deviceList[key].ipAddress = dataObjs[item.deviceNumber].ipAddress
            that.deviceList[key].user = dataObjs[item.deviceNumber].user
            that.deviceList[key].password = dataObjs[item.deviceNumber].password
          }
        })
      }
      that.uploadLoading = false
    },
    handleFormatError (file) {
      this.uploadLoading = false
      this.$Notice.warning({
        title: '上传失败',
        desc: '文件 ' + file.name + ' 格式不正确，请上传 excel2007 文件'
      })
    },
    getAttrObject (key, value) {
      let attrObj = {}
      attrObj.key = key
      attrObj.value = value
      return attrObj
    },
    // 获取要发送的数据
    getRequestParams (saveOrSubmit) {
      let params = {}
      let that = this
      if (saveOrSubmit !== 'save' && saveOrSubmit !== 'submit') {
        this.$Message.error('操作类型错误')
        return false
      }
      if (saveOrSubmit === 'save') {
        this.saveLoading = true
      } else {
        this.submitLoading = true
      }

      params.saveOrSubmit = saveOrSubmit
      params.totalCount = parseInt(this.deviceList.length)
      params.devices = []
      let ipAddressError = ''
      let ipReg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
      this.deviceList.forEach(function (item, key) {
        // 如果某一行数据不完整，则跳过此行
        if (!item.ipAddress || !item.user || !item.password) {
          return true
        }
        if (!ipReg.test(item.ipAddress)) {
          ipAddressError = item.deviceNumber
        }

        let obj = {}
        obj.deviceId = item.deviceId
        obj.deviceNumber = item.deviceNumber
        obj.attributes = []
        obj.attributes.push(that.getAttrObject('ipAddress', item.ipAddress))
        obj.attributes.push(that.getAttrObject('user', item.user))
        obj.attributes.push(that.getAttrObject('password', item.password))
        params.devices.push(obj)
      })
      if (ipAddressError !== '') {
        this.$Message.error('设备：' + ipAddressError + '，IP地址输入错误')
        return false
      }

      if (params.devices.length <= 0) {
        this.$Message.error('请最少输入一台设备的IP地址，管理控制卡账号，管理控制卡密码')
        if (saveOrSubmit === 'save') {
          this.saveLoading = false
        } else {
          this.submitLoading = false
        }
        return false
      }
      return params
    },
    ipAddressBlur (row, index) {
      this.deviceList[index].ipAddress = row.ipAddress
    },
    userBlur (row, index) {
      this.deviceList[index].user = row.user
    },
    passwordBlur (row, index) {
      this.deviceList[index].password = row.password
    },
    showDownloadModal () {
      let that = this
      let content = '<br>注意：'
      content += '<br>1、下载的模板中包含初始数据，请勿修改模板结构<br>2、请勿修改除 “IP地址”，“管理控制卡账号”，“管理控制卡密码” 列以外的内容'
      this.$Modal.confirm({
        content: content,
        title: '提示',
        onOk: function () {
          that.downloadTemplate()
        }
      })
    },
    downloadTemplate () {
      this.downloadLoading = true
      assetFirstTimeConfigureDownloadTemplate('deviceId', true).then(response => {
        let url = window.URL.createObjectURL(new Blob([response])) // 创建下载的链接
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', '设备列表.xlsx') // 下载后的文件名
        document.body.appendChild(link)
        link.click() // 点击下载
        document.body.removeChild(link) // 下载完成移除元素
        window.URL.revokeObjectURL(url) // 下载完成释放掉blob对象
        this.downloadLoading = false
      }, error => {
        console.log('==============ERROR=============')
        console.log(error)
        this.downloadLoading = false
      })
    },
    // 保存
    saveConfigure () {
      let that = this
      let params = that.getRequestParams('save')
      if (params === false) {
        this.saveLoading = false
        return
      }
      assetFirstTimeConfigureAction(params).then(response => {
        this.saveLoading = false
        if (response && response.success) {
          this.$Message.success('操作成功')
          // this.pageLoad('deviceId', true)
        } else {
          this.$Message.error(response.errorMessage)
        }
      }, error => {
        console.log(error)
        this.saveLoading = false
      })
    },
    // 提交
    submitConfigure () {
      let that = this
      let params = {}
      if (this.deviceList.length > 0) {
        params = that.getRequestParams('submit')
        if (params === false) {
          this.submitLoading = false
          return
        }
      } else {
        params.saveOrSubmit = 'submit'
        params.totalCount = 0
        params.devices = []
      }

      assetFirstTimeConfigureAction(params).then(response => {
        this.submitLoading = false
        if (response && response.success) {
          this.$Message.success('操作成功')
          // this.pageLoad('deviceId', true)
          this.$router.push('/devinfo_page')
        } else {
          this.$Message.error(response.errorMessage)
        }
      }, error => {
        console.log(error)
        this.submitLoading = false
      })
    },
    // 页面初始化
    pageLoad (fieldName, orderBy) {
      this.loading = true
      this.deviceList = []
      let userInfo = this.$store.state.upms.userInfo
      this.companyName = userInfo.tenantName
      assetFirstTimeConfigureList(fieldName, orderBy).then(response => {
        if (!response || !response.success) {
          this.deviceList = []
          this.loading = false
          return
        }
        if (!response.data.totalCount || parseInt(response.data.totalCount) <= 0) {
          this.deviceList = []
          this.loading = false
          return
        }
        let dataList = response.data.dataList
        for (let i = 0; i < dataList.length; i++) {
          let obj = {}
          obj.deviceId = dataList[i].deviceId
          obj.roomName = dataList[i].roomName
          obj.deviceNumber = dataList[i].deviceNumber
          obj.roomnum = dataList[i].areaName
          if (dataList[i].areaName.indexOf('-') !== -1) {
            let areaNameArr = dataList[i].areaName.split('-')
            obj.roomnum = areaNameArr[2]
          } else {
            obj.roomnum = '-'
          }
          obj.cabinum = dataList[i].cabinetCode
          obj.ulocat = dataList[i].uPosition
          obj.ipAddress = dataList[i].ipAddress
          obj.user = dataList[i].user
          obj.password = dataList[i].password
          obj.shelvesDate = dataList[i].shelvesDate
          this.deviceList.push(obj)
          this.loading = false
        }
      }, error => {
        console.log(error)
        this.loading = false
      })
    },
    sortChange (obj) {
      let fieldName = 'deviceId'
      let orderBy = true
      switch (obj.order) {
        case 'asc':
          fieldName = obj.key
          orderBy = true
          break
        case 'desc':
          fieldName = obj.key
          orderBy = false
          break
        case 'normal':
          fieldName = 'deviceId'
          orderBy = true
          break
      }
      this.pageLoad(fieldName, orderBy)
    },
    // 判断跳转到首次配置页面还是管理页面
    beforeJump () {
      let normalUrl = '/devinfo_page'
      assetFirstTimeConfigurePageLoad().then(response => {
        if (!response || !response.success) {
          this.pageLoad('deviceId', true)
          return
        }
        if (!response.data) {
          this.pageLoad('deviceId', true)
          return
        }
        if (response.data.configured) {
          this.$router.push(normalUrl)
        } else {
          this.pageLoad('deviceId', true)
        }
      })
    }
  },
  mounted () {
    this.beforeJump()
  }
}
</script>

<style lang="less">
  .first-login-cont {background: #FFF;position: fixed;width: 100%;left: 0;bottom: 0;top:65px;z-index:9;}
  .first-top-cont {width: 1200px;margin: 0 auto;}
  .first-top-cont strong{color:#ec9a17;}
  .first-btn-cont {position:absolute;right:30px;top:-50px;}
  .first-cont {padding: 0 30px;position:relative; min-width: 1200px;}
  .first-table{margin-top:10px;}
  .first-table .ivu-table-cell{padding:0 5px;}
  .first-cont center{padding-top:20px;}
  .first-cont center button,
  .first-cont center a{margin:0 10px; padding:0 35px; height:32px;line-height: 32px;}
  .first-btn-cont .ivu-upload-list{display:none;}
</style>
