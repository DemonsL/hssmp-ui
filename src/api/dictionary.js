import * as staticDict from '@/staticDict'
import axios from '@/libs/api.request'

export default class DictionaryController {
  static dictSysUserStatus () {
    return new Promise((resolve) => {
      resolve(staticDict.SysUserStatus);
    });
  }
  static dictSysUserType () {
    return new Promise((resolve) => {
      resolve(staticDict.SysUserType);
    });
  }
  static dictYesNo () {
    return new Promise((resolve) => {
      resolve(staticDict.YesNo);
    });
  }
  static dictSysUser (params) {
    return new Promise((resolve, reject) => {
      axios.get('/admin/upms/sysUser/listDict', params).then(res => {
        let dictData = new staticDict.DictionaryBase();
        dictData.setList(res.data);
        resolve(dictData);
      }).catch(err => {
        reject(err);
      });
    });
  }
  static dictSysDept (sender, params, axiosOption, httpOption) {
    return new Promise((resolve, reject) => {
      axios.get('/admin/upms/sysDept/listDict', params).then(res => {
        let dictData = new staticDict.DictionaryBase();
        dictData.setList(res.data);
        resolve(dictData);
      }).catch(err => {
        reject(err);
      });
    });
  }
  static dictSysDeptByParentId (params) {
    return new Promise((resolve, reject) => {
      axios.get('/admin/upms/sysDept/listDictByParentId',params).then(res => {
        let dictData = new staticDict.DictionaryBase();
        dictData.setList(res.data);
        resolve(dictData);
      }).catch(err => {
        reject(err);
      });
    });
  }
  static dictSysDataPermType () {
    return new Promise((resolve) => {
      resolve(staticDict.SysDataPermType);
    });
  }
}
