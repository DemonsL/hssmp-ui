export const getDeviceType = (type) => {
  var deviceType = ''
  switch (type) {
    case 1:
      deviceType = 'server'
      break
    case 2:
      deviceType = 'router'
      break
    case 3:
      deviceType = 'exchange'
      break
    case 4:
      deviceType = 'firewall'
      break
  }
  return deviceType
}

export const getBaremetalStatus = (status, defaultStatus) => {
  var serStatus = defaultStatus
  switch (status) {
    case 'on':
      serStatus = '开机'
      break
    case 'off':
      serStatus = '关机'
      break
    case 'error':
      serStatus = '错误'
      break
  }
  return serStatus
}

export const getBaremetalAttributes = (attributes, keys=['hostName', 'osName', 'osVersion', 'biosVersion', 'firmwareVersion', 'ipAddress']) => {
  var attr = {}
  for (var j = 0, len = attributes.length; j < len; j++) {
    var key = attributes[j]['key']
    var value = attributes[j]['value']
    if (keys.indexOf(key) < 0) {
      continue
    }
    if (value !== '') {
      attr[key] = value
    }
  }
  return attr
}

export const getBaremetalPowerStatusClass = (powerStatus) => {
  var calssName = ''
  switch (powerStatus) {
    case '':
      calssName = 'unknown'
      break
    case 'on':
      calssName = ''
      break
    case 'off':
      calssName = 'off'
      break
    case 'error':
      calssName = 'err'
      break
  }
  return calssName
}
