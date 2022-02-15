import { getFortiView, getFortiViewSla, getFortiViewDev,
  getSdWanGroupList, getSdWanGroupDeviceList } from '../api/sdwan';

// 获取FortiView数据
export const getViewData = (params) => {
  return new Promise(function (resolve) {
    getFortiView(params).then(res => {
      let resData = JSON.parse(res.data.result)
      if (res.success === true) {
        resolve(resData.result.data)
      }
    })
  })
}

// 获取FortiView折线图数据
export const getViewLine = (params) => {
  return new Promise(function (resolve) {
    getFortiView(params).then(res => {
      let resData = JSON.parse(res.data.result)
      if (res.success === true) {
        resolve(resData.result.data)
      }
    })
  })
}

// 获取SLA监控数据
export const getSlaData = (params) => {
  return new Promise(function (resolve) {
    getFortiViewSla(params).then(res => {
      let resData = JSON.parse(res.data.result)
      if (resData.code === 0) {
        resolve(resData.data.result[0].data)
      }
    })
  })
}

// 获取SLA 资源
export const getSlaDevData = (params) => {
  return new Promise(function (resolve) {
    getFortiViewDev(params).then(res => {
      let resData = JSON.parse(res.data.result)
      if (resData.code === 0) {
        resolve(resData.data.result[0].data[0].response.results)
      }
    })
  })
}

// 获取设备组
export const getDeviceGroup = (adomName) => {
  return new Promise(function (resolve) {
    getSdWanGroupList({adomName: adomName}).then(res => {
      if (res.success === true) {
        resolve(res.data)
      }
    })
  })
}

// 获取设备组下的设备
export const getDeviceList = (adomName, groupName) => {
  return new Promise(function (resolve) {
    getSdWanGroupDeviceList({adomName: adomName, groupName: groupName}).then(res => {
      if (res.success === true) {
        resolve(res.data)
      }
    })
  })
}

// 时间戳格式化
export const timeFormat = (timestamp, type) => {
  let dateTime = new Date(timestamp)
  let month = dateTime.getMonth() + 1
  let dt = {
    year: dateTime.getFullYear(),
    month: (month.toString().length === 1) ? ('0' + month) : month,
    date: dateTime.getDate(),
    hour: dateTime.getHours(),
    min: dateTime.getMinutes()
  }
  if (type === 'time') {
    return dt.hour + ':' + dt.min
  }
  if (type === 'date') {
    return dt.year + '-' + dt.month + '-' + dt.date + ' ' + dt.hour + ':' + dt.min
  }
}
