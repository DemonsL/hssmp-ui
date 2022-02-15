import axios from '@/libs/api.request'

export default class SysUserController {
  // 用户用户列表
  static list (data) {
    return axios.post('/admin/upms/sysUser/list', data)
  }
  // 查看用户详情
  static view (params) {
    return axios.get('/admin/upms/sysUser/view', params)
  }
  // 新增用户
  static add (data) {
    return axios.post('/admin/upms/sysUser/view', data)
  }
  // 更新用户
  static update (data) {
    return axios.post('/admin/upms/sysUser/update', data)
  }

  // 更新用户状态
  static updateStatus (data) {
    return axios.post('/admin/upms/sysUser/updateUserStatus', data)
  }

  // 删除用户
  static delete (data) {
    return axios.post('/admin/upms/sysUser/delete', data)
  }
  // 获取服务周期
  static getServicesList (data) {
    return axios.get('admin/upms/sysUser/services/period');
  }
}
