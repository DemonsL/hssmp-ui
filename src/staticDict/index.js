/**
 * 常量字典数据
 */
import Vue from 'vue'

class DictionaryBase extends Map {
  constructor (dataList, keyId = 'id', symbolId = 'symbol') {
    super();
    this.setList(dataList, keyId, symbolId)
  }

  setList (dataList, keyId = 'id', symbolId = 'symbol') {
    this.clear()
    if (Array.isArray(dataList)) {
      dataList.forEach((item) => {
        this.set(item[keyId], item)
        if (item[symbolId] != null) {
          Object.defineProperty(this, item[symbolId], {
            get: function () {
              return item[keyId]
            }
          })
        }
      })
    }
  }

  getList (valueId = 'name', parentIdKey = 'parentId', filter) {
    let temp = []
    this.forEach((value, key) => {
      let obj = {
        id: key,
        name: (typeof value === 'string') ? value : value[valueId],
        parentId: value[parentIdKey]
      }
      if (typeof filter !== 'function' || filter(obj)) {
        temp.push(obj)
      }
    })

    return temp
  }

  getValue (id, valueId = 'name') {
    return (this.get(id) || {})[valueId]
  }
}

const SysUserStatus = new DictionaryBase([
  {
    id: 0,
    name: '启用',
    symbol: 'NORMAL'
  },
  {
    id: 1,
    name: '禁用',
    symbol: 'LOCKED'
  }
])
Vue.prototype.SysUserStatus = SysUserStatus

const SysUserType = new DictionaryBase([
  {
    id: 0,
    name: '管理员',
    symbol: 'ADMIN'
  },
  {
    id: 1,
    name: '系统操作员',
    symbol: 'SYSTEM'
  },
  {
    id: 2,
    name: '普通操作员',
    symbol: 'OPERATOR'
  }
])
Vue.prototype.SysUserType = SysUserType

const YesNo = new DictionaryBase([
  {
    id: 1,
    name: '是',
    symbol: 'YES'
  },
  {
    id: 0,
    name: '否',
    symbol: 'NO'
  }
])
Vue.prototype.YesNo = YesNo

const Gender = new DictionaryBase([
  {
    id: 1,
    name: '男',
    symbol: 'MALE'
  },
  {
    id: 0,
    name: '女',
    symbol: 'FEMALE'
  }
])
Vue.prototype.Gender = Gender

const SysPermModuleType = new DictionaryBase([
  {
    id: 0,
    name: '分组模块',
    symbol: 'GROUP'
  }, {
    id: 1,
    name: '接口模块',
    symbol: 'CONTROLLER'
  }
])
Vue.prototype.SysPermModuleType = SysPermModuleType

const SysPermCodeType = new DictionaryBase([{
  id: 0,
  name: '表单',
  symbol: 'FORM'
}, {
  id: 1,
  name: '片段',
  symbol: 'FRAGMENT'
}, {
  id: 2,
  name: '操作',
  symbol: 'OPERATION'
}])
Vue.prototype.SysPermCodeType = SysPermCodeType

const SysMenuType = new DictionaryBase([
  {
    id: 0,
    name: '目录',
    symbol: 'DIRECTORY'
  },
  {
    id: 1,
    name: '表单',
    symbol: 'MENU'
  },
  {
    id: 2,
    name: '片段',
    symbol: 'FRAGMENT'
  },
  {
    id: 3,
    name: '按钮',
    symbol: 'BUTTON'
  }
])
Vue.prototype.SysMenuType = SysMenuType

const SysDataPermType = new DictionaryBase([
  {
    id: 0,
    name: '查看全部',
    symbol: 'ALL'
  },
  {
    id: 1,
    name: '仅看自己',
    symbol: 'ONLY_USER'
  },
  {
    id: 2,
    name: '仅看所在部门',
    symbol: 'ONLY_DEPT'
  },
  {
    id: 3,
    name: '仅看所在部门及子部门',
    symbol: 'ONLY_DEPT_AND_CHILD'
  },
  {
    id: 4,
    name: '自选部门及子部门',
    symbol: 'CUSTOM_DEPT_AND_CHILD'
  },
  {
    id: 5,
    name: '仅自选部门',
    symbol: 'CUSTOM_DEPT'
  }
])
Vue.prototype.SysDataPermType = SysDataPermType

export {
  DictionaryBase,
  SysUserStatus,
  SysUserType,
  YesNo,
  Gender,
  SysDataPermType,
  SysPermModuleType,
  SysPermCodeType,
  SysMenuType
}
