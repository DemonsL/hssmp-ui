import axios from '@/libs/api.request'

export default class SysDeptController {
  static list (data) {
    return axios.post('/admin/upms/sysDept/list', data);
  }

  static view (params) {
    return axios.get('/admin/upms/sysDept/view', params);
  }

  static add (data) {
    return axios.post('/admin/upms/sysDept/add', data);
  }

  static update (data) {
    return axios.post('/admin/upms/sysDept/update', data);
  }

  static delete (data) {
    return axios.post('/admin/upms/sysDept/delete', data);
  }
}
