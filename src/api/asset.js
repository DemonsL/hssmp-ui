import axios from '@/libs/api.request'

/**
 * 设备详情
 * @param {Long} deviceId  设备ID
 */
export const assetDeviceInfo = (deviceId) => {
  return axios.request({
    url: '/admin/assetmanagement/asset/device/info',
    params: { deviceId: deviceId },
    method: 'get'
  })
}

/**
 * 机柜详情
 * @param {Long} cabinetId 机柜ID
 */
export const assetCabinetInfo = (cabinetId) => {
  return axios.request({
    url: '/admin/assetmanagement/asset/cabinet/info',
    params: { cabinetId: cabinetId },
    method: 'get'
  })
}

/**
 * 裸服务器电源状态
 * @param {Long} deviceId 设备ID
 */
export const assetBmcPowerStatus = (deviceId) => {
  return axios.request({
    url: '/admin/assetmanagement/asset/bmc/power/status',
    params: { deviceId: deviceId },
    method: 'get'
  })
}

/**
 * 裸服务器电源动作
 * @param {Long} deviceId 设备ID
 */
export const assetBmcPowerAction = (deviceId, action, captcha) => {
  return axios.request({
    url: '/admin/assetmanagement/asset/bmc/power/action',
    params: { deviceId: deviceId, action: action, captcha: captcha },
    method: 'get'
  })
}

/**
 * 获取vncurl
 * @param {Long} deviceId 设备ID
 */
export const assetBmcVncUrl = (deviceId, captcha) => {
  return axios.request({
    url: '/admin/assetmanagement/asset/bmc/vnc/url',
    params: { deviceId: deviceId, captcha: captcha },
    method: 'get'
  })
}

/**
 * 发送设备操作短信验证码
 * @param {String} action
 * @param {int} action
 */
export const assetSmsActionSend = (action, mode) => {
  return axios.request({
    url: '/admin/assetmanagement/asset/bmc/ipmi/action/sms/send',
    params: { action: action, mode: mode },
    mathod: 'get'
  })
}

/**
 * 验证设备操作短信验证码
 * @param {String} action
 */
export const assetSmsActionVerify = (action, code) => {
  return axios.request({
    url: '/admin/assetmanagement/asset/bmc/ipmi/action/sms/verify',
    params: { action: action, code: code },
    mathod: 'get'
  })
}



/**
 * 修改redfish 设备属性( vncStatus，vncPassword，vncPort，vncTimeout)
 * @param {*} params 
 */
export const assetIpmiRedfishUpdate = (deviceId, config, captcha) => {
  return axios.request({
    url: '/admin/assetmanagement/asset/bmc/redfish/update',
    data: {deviceId: deviceId, config: config, captcha: captcha},
    method: 'post'
  })
}

/**
 * 修改ipmi网络属性(ip，mac, user, password)
 * @param {*} action 
 * @param {*} params 
 */
export const assetIpmiLanUpdate = (deviceId, config, captcha) => {
  return axios.request({
    url: '/admin/assetmanagement/asset/bmc/ipmi/update',
    data: {deviceId: deviceId, config: config, captcha: captcha},
    method: 'post'
  })
}

/**
 * 初始化ipmi网络属性(ip, user, password)
 * @param {*} action 
 * @param {*} params 
 */
export const assetIpmiLanInit = (deviceId, config, captcha) => {
  return axios.request({
    url: '/admin/assetmanagement/asset/bmc/ipmi/init',
    data: {deviceId: deviceId, config: config, captcha: captcha},
    method: 'post'
  })
}

// 判断是进入首次配置页面还是进入列表页面
export const assetFirstTimeConfigurePageLoad = () => {
  return axios.request({
    url: '/admin/assetmanagement/asset/init/initload',
    method: 'get'
  })
}

// 首次配置列表展示
export const assetFirstTimeConfigureList = (fieldName, orderBy) => {
  const data = {
    'pageParam': {
      'pageNum': 1,
      'pageSize': 9999
    },
    'orderParam': [{
      'asc': orderBy,
      'dateAggregateBy': '',
      'fieldName': fieldName
    }]
  }
  return axios.request({
    url: '/admin/assetmanagement/asset/init/list',
    data: data,
    method: 'post'
  })
}

// 首次配置保存数据
export const assetFirstTimeConfigureAction = (d) => {
  const data = {
    params: d
  }
  return axios.request({
    url: '/admin/assetmanagement/asset/init/configure',
    data,
    method: 'post'
  })
}

// 首次配置下载批量导入模板
export const assetFirstTimeConfigureDownloadTemplate = (fieldName, orderBy) => {
  const params = {
    'pageParam': {
      'pageNum': 1,
      'pageSize': 9999
    },
    'orderParam': [{
      'asc': orderBy,
      'dateAggregateBy': '',
      'fieldName': fieldName
    }]
  }
  var headers = {
    'content-disposition': 'attachment;filename=devices.xlsx'
  }
  return axios.request({
    url: '/admin/assetmanagement/asset/init/download',
    data: params,
    responseType: 'blob',
    headers: headers,
    method: 'post'
  })
}

/**
 * 机柜列表
 * @param filterBy
 * @param orderParam
 * @param pageParam
 * @returns {*}
 */
export const assetCabinetList = (filterBy = {}, orderParam = [], pageParam = {}) => {
  return axios.request({
    url: '/admin/assetmanagement/asset/cabinet/list',
    data: { filterBy: filterBy, orderParam: orderParam, pageParam: pageParam },
    method: 'post'
  })
}

/**
 * 设备列表
 * @param filterBy
 * @param orderParam
 * @param pageParam
 * @returns {*}
 */
export const assetDeviceList = (filterBy = {}, orderParam = [], pageParam = {}) => {
  return axios.request({
    url: '/admin/assetmanagement/asset/device/list',
    data: { filterBy: filterBy, orderParam: orderParam, pageParam: pageParam },
    method: 'post'
  })
}

/**
 * 执行日志
 * @param filterBy
 * @param orderParam
 * @param pageParam
 * @returns {*}
 */
export const assetActionLogList = (filterBy = {}, orderParam = [], pageParam = {}) => {
  return axios.request({
    url: '/admin/assetmanagement/asset/actionLog/list',
    data: { filterBy: filterBy, orderParam: orderParam, pageParam: pageParam },
    method: 'post'
  })
}
