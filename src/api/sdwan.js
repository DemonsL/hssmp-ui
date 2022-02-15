import axios from '@/libs/api.request'

export const getSdWanAdomList = () => {
  return axios.request({
    url: '/admin/sdwan/adom/list',
    method: 'get'
  })
}

// 获取FortiView数据
export const getFortiView = (data) => {
  return axios.request({
    url: '/admin/sdwan/view/getView',
    data: data,
    method: 'post'
  })
}

// 获取FortiView SLA监控数据
export const getFortiViewSla = (data) => {
  return axios.request({
    url: '/admin/sdwan/view/getSla',
    data: data,
    method: 'post'
  })
}

// 获取FortiView SLA资源
export const getFortiViewDev = (data) => {
  return axios.request({
    url: '/admin/sdwan/view/getDev',
    data: data,
    method: 'post'
  })
}

// 获取Sdwan设备组
export const getSdWanGroupList = (data) => {
  return axios.request({
    url: '/admin/sdwan/device/groupList',
    data: data,
    method: 'post'
  })
}

// 获取Sdwan设备组下面的设备
export const getSdWanGroupDeviceList = (data) => {
  return axios.request({
    url: '/admin/sdwan/device/groupDetail',
    data: data,
    method: 'post'
  })
}

// 获取Sdwan设备组下面的设备详情
export const getSdWanGroupDeviceDetail = (data) => {
  return axios.request({
    url: '/admin/sdwan/device/detail',
    data: data,
    method: 'post'
  })
}

// 获取Sdwan设备基本信息
export const getSdWanDeviceSummary = (data) => {
  return axios.request({
    url: '/admin/sdwan/device/summary',
    data: data,
    method: 'post'
  })
}

// 获取Sdwan设备运行时间
export const getSdWanDeviceRunningTime = (data) => {
  return axios.request({
    url: '/admin/sdwan/device/runningTime',
    data: data,
    method: 'post'
  })
}

// 获取Sdwan集群成员信息
export const getSdWanDeviceHaMember = (data) => {
  return axios.request({
    url: '/admin/sdwan/device/forward',
    data: data,
    method: 'post'
  })
}

// 获取Sdwan设备接口带宽信息
export const getSdWanDeviceInterfaceBandwidth = (data) => {
  return axios.request({
    url: '/admin/sdwan/device/interfaceBandwidth',
    data: data,
    method: 'post'
  })
}

// 获取Sdwan设备接口带宽下拉框条件信息
export const getSdWanDeviceForwardSelect = (data) => {
  return axios.request({
    url: '/admin/sdwan/device/forwardSelect',
    data: data,
    method: 'post'
  })
}

// 获取Sdwan设备路由信息
export const getSdWanDeviceRouter = (data) => {
  return axios.request({
    url: '/admin/sdwan/device/router',
    data: data,
    method: 'post'
  })
}

// 获取Sdwan设备路由信息
export const getSdWanDeviceVpn = (data) => {
  return axios.request({
    url: '/admin/sdwan/device/vpn',
    data: data,
    method: 'post'
  })
}
