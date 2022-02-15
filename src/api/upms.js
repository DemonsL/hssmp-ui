import axios from '@/libs/api.request'

export const Action = {
  PRE_LOGIN: '/admin/upms/login/preLogin',
  PHONE_WITH_PASSWORD_LOGIN: '/admin/upms/login/phoneWithPaswordLogin',
  SMS_LOGIN: '/admin/upms/login/phoneLogin',
  CODE_LOGIN: '/admin/upms/login/tenantCodeLogin',
  LOGIN_OUT: '/admin/upms/login/doLogout'
}

// 获取修改密码手机验证码
export const smsForChangePassword = (data) => {
  return axios.post('/admin/upms/login/smsForChangePassword', data)
}

// 获取修改密码手机验证码
export const checkOldPass = (data) => {
  return axios.post('/admin/upms/login/checkOldPass', data)
}

// 修改密码
export const changePassword = (data) => {
  return axios.post('/admin/upms/login/changePassword', data)
}

// 获取图形验证码
export const getCaptchaImage = () => {
  return axios.get('/admin/upms/login/captchaImage', {type: 'char'})
}

// 获取短信验证码
export const getSmsCode = (data) => {
  return axios.post('/admin/upms/login/sms', data)
}

// 校验图形验证码
export const checkCaptchaImage = (data) => {
  return axios.post('/admin/upms/login/checkCaptcha', data)
}

// 获取用户登入信息(用于用户在新的tab中打开页面是保持token)
export const getLoginInfo = () => {
  return axios.get('/admin/upms/login/getLoginInfo')
}

// 获取用户登入信息(用于用户在新的tab中打开页面是保持token)
export const getBasicInfo = () => {
  return axios.get('/admin/upms/login/getBasicInfo')
}

// 租户选择
export const preLogin = (data) => {
  return axios.post(Action.PRE_LOGIN, data)
}

// 手机验证码登入
export const phoneLogin = (data) => {
  return axios.post(Action.SMS_LOGIN, data)
}

// 手机账号密码登入
export const phoneWithPaswordLogin = (data) => {
  return axios.post(Action.PHONE_WITH_PASSWORD_LOGIN, data)
}

// 通过企业号登入
export const tenantCodeLogin = (data) => {
  return axios.post(Action.CODE_LOGIN, data)
}
// 登出
export const logout = () => {
  return axios.post(Action.LOGIN_OUT)
}

// 查询服务周期
export const getServicesPeriod = (data) => {
  data = JSON.stringify(data)
  return axios.request({
    url: '/admin/upms/servicesPeriod/detail',
    data: data,
    method: 'post'
  })
}

// 查询服务周期
export const getServicesPeriodList = (data) => {
  return axios.request({
    url: '/admin/upms/servicesPeriod/list',
    data: data,
    method: 'post'
  })
}
