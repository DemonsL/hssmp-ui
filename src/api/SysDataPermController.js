import axios from '@/libs/api.request'

export default class SysDataPermController {
  /**
   * @param params    {dataPermId, dataPermName, deptIdListString}
   */
  static add (data) {
    return axios.post('admin/upms/sysDataPerm/add', data);
  }

  /**
   * @param params    {dataPermId, dataPermName, deptIdListString}
   */
  static update (data) {
    return axios.post('admin/upms/sysDataPerm/update', data);
  }

  /**
   * @param params    {dataPermId}
   */
  static delete (data) {
    return axios.post('admin/upms/sysDataPerm/delete', data);
  }

  /**
   * @param params    {dataPermName}
   */
  static list (data) {
    return axios.post('admin/upms/sysDataPerm/list', data);
  }

  /**
   * @param params    {dataPermId}
   */
  static view (params) {
    return axios.get('admin/upms/sysDataPerm/view', params);
  }

  /**
   * @param params    {dataPermId, searchString}
   */
  static listDataPermUser (data) {
    return axios.post('admin/upms/sysDataPerm/listDataPermUser', data);
  }

  /**
   * @param params    {dataPermId, userIdListString}
   */
  static addDataPermUser (data) {
    return axios.post('admin/upms/sysDataPerm/addDataPermUser', data);
  }

  /**
   * @param params    {dataPermId, userId}
   */
  static deleteDataPermUser (data) {
    return axios.post('admin/upms/sysDataPerm/deleteDataPermUser', data);
  }

  static listNotInDataPermUser (data) {
    return axios.post('admin/upms/sysDataPerm/listNotInDataPermUser', data);
  }
}
