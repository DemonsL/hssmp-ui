import {getMenuByRouter} from '@/libs/util'
import routers from '@/router/routers'

import { initUserInfo, findMenuItem } from './utils';
import { setObjectToSessionStorage, findItemFromList, treeDataTranslate, getObjectFromSessionStorage } from '@/utils';
// import * as StaticDict from '@/staticDict';

export default {
  state: {
    // 用户头像图片路径
    avatorImgPath: '',
    // 是否左侧菜单折叠
    isCollapse: false,
    // 是否多栏目
    supportColumn: false,
    // 是否多标签
    supportTags: false,
    // 浏览器客户区高度
    documentClientHeight: 100,
    // 用户登录信息
    userInfo: initUserInfo(),
    // 缓存页面
    cachePages: getObjectFromSessionStorage('cachePages', []),
    // 当前标签
    tagList: getObjectFromSessionStorage('tagList', []),
    // 菜单列表
    menuList: treeDataTranslate(getObjectFromSessionStorage('menuList', []), 'menuId', 'parentId'),
    // 当前菜单
    currentMenuId: getObjectFromSessionStorage('currentMenuId', undefined),
    // 当前栏目
    currentColumnId: getObjectFromSessionStorage('currentColumnId', undefined)
  },
  mutations: {
    setCollapse: (state, isCollapse) => {
      state.isCollapse = isCollapse;
    },
    setClientHeight: (state, height) => {
      state.documentClientHeight = height;
    },
    setUserInfo: (state, info) => {
      setObjectToSessionStorage('userInfo', info);
      state.userInfo = initUserInfo(info);
    },
    addCachePage (state, name) {
      if (state.cachePages.indexOf(name) === -1) {
        let temp = [...state.cachePages];
        temp.push(name);
        setObjectToSessionStorage('cachePages', temp);
        state.cachePages = temp;
      }
    },
    removeCachePage (state, name) {
      let pos = state.cachePages.indexOf(name);
      if (pos !== -1) {
        let temp = [...state.cachePages];
        temp.splice(pos, 1);
        setObjectToSessionStorage('cachePages', temp);
        state.cachePages = temp;
      }
    },
    clearCachePage (state) {
      setObjectToSessionStorage('cachePages', []);
      state.cachePages = [];
    },
    addTag (state, id) {
      if (id == null || id === '') return;
      // 新增的标签是否存在
      let tagList = state.tagList;
      let tagItem = null;
      if (Array.isArray(tagList)) {
        tagItem = findItemFromList(tagList, id, 'menuId');
      }
      if (tagItem != null) return;
      // 添加新增标签以及更新页面缓存
      let menuList = state.menuList;
      let menuObject = null;
      if (Array.isArray(menuList)) {
        for (let i = 0; i < menuList.length; i++) {
          menuObject = findMenuItem(menuList[i], id);
          if (menuObject != null) break;
        }
      }
      if (menuObject != null) {
        state.tagList = [...state.tagList, menuObject];
        if (Array.isArray(state.cachePages) && state.cachePages.indexOf(menuObject.formRouterName) === -1) {
          state.cachePages = [...state.cachePages, menuObject.formRouterName];
        }
      }
      setObjectToSessionStorage('cachePages', state.cachePages);
      setObjectToSessionStorage('tagList', state.tagList);
    },
    removeTag (state, id) {
      if (id == null || id === '') return;
      // 移除标签
      let nextPos = -1;
      let tagItem = null;
      for (let i = 0; i < state.tagList.length; i++) {
        if (state.tagList[i].menuId === id) {
          tagItem = state.tagList[i];
          state.tagList.splice(i, 1);
          nextPos = Math.min(i, state.tagList.length - 1);
        }
      }
      // let tagItem = findItemFromList(state.tagList, id, 'menuId', true);
      if (tagItem == null) return;
      // 移除页面缓存
      findItemFromList(state.cachePages, tagItem.formRouterName, undefined, true);
      setObjectToSessionStorage('cachePages', state.cachePages);
      setObjectToSessionStorage('tagList', state.tagList);
      // 如果移除的是当前显示页面，重新选择显示页面
      let showTag = null;
      if (state.currentMenuId === id) {
        showTag = state.tagList[nextPos];
        let tempId = (showTag || {}).menuId;
        if (setObjectToSessionStorage('currentMenuId', tempId)) state.currentMenuId = tempId;
      }
    },
    closeOtherTags (state, id) {
      if (id == null || id === '') return;
      // 移除其他所有标签
      if (Array.isArray(state.tagList)) {
        state.tagList = state.tagList.filter((item) => {
          return item.menuId === id;
        });
      }

      let menuObject = state.tagList[0];
      if (menuObject && menuObject.formRouterName && menuObject.formRouterName !== '') {
        state.cachePages = [menuObject.formRouterName];
        if (setObjectToSessionStorage('currentMenuId', menuObject.menuId)) state.currentMenuId = menuObject.menuId;
      }
      setObjectToSessionStorage('cachePages', state.cachePages);
      setObjectToSessionStorage('tagList', state.tagList);
    },
    clearAllTags (state) {
      if (setObjectToSessionStorage('currentMenuId', undefined)) state.currentMenuId = undefined;
      if (setObjectToSessionStorage('cachePages', [])) state.cachePages = [];
      if (setObjectToSessionStorage('tagList', [])) state.tagList = [];
    },
    setMenuList: (state, list) => {
      if (Array.isArray(list)) {
        if (setObjectToSessionStorage('menuList', list)) state.menuList = treeDataTranslate(list, 'menuId', 'parentId');
        let columnId = (state.menuList[0] || {}).menuId;
        if (setObjectToSessionStorage('currentColumnId', columnId)) state.currentColumnId = columnId;
      }
    },
    setCurrentMenuId: (state, menuId) => {
      let menuItem = null;
      if (setObjectToSessionStorage('currentMenuId', menuId)) state.currentMenuId = menuId;
      if (Array.isArray(state.tagList) && Array.isArray(state.menuList)) {
        for (let i = 0; i < state.menuList.length; i++) {
          menuItem = findMenuItem(state.menuList[i], menuId, 'menuId');
          if (menuItem != null) {
            // 添加新的tag
            let tagItem = findItemFromList(state.tagList, menuId, 'menuId');
            if (tagItem == null) {
              state.tagList = [...state.tagList, menuItem];
              setObjectToSessionStorage('tagList', state.tagList);
            }
            // 添加新缓存
            if (Array.isArray(state.cachePages) && state.cachePages.indexOf(menuItem.formRouterName) === -1) {
              state.cachePages = [...state.cachePages, menuItem.formRouterName];
              setObjectToSessionStorage('cachePages', state.cachePages);
            }
            break;
          }
        }
      }
    },
    setCurrentColumnId: (state, columnId) => {
      if (setObjectToSessionStorage('currentColumnId', columnId)) state.currentColumnId = columnId;
      if (setObjectToSessionStorage('currentMenuId', null)) state.currentMenuId = null;
    }
  },
  actions: {
    //
  },
  getters: {
    menuList: (state, getters, rootState) => getMenuByRouter(routers, []),
    getMultiTags: (state) => {
      return state.supportTags;
    },
    getCollapse: (state) => {
      return state.isCollapse;
    },
    getClientHeight: (state) => {
      return state.documentClientHeight;
    },
    getMainContextHeight: (state) => {
      return state.documentClientHeight - (state.supportTags ? 140 : 100);
    },
    getUserInfo: (state) => {
      return state.userInfo;
    },
    getCachePages: (state) => {
      return state.cachePages;
    },
    getTagList: (state) => {
      return state.tagList;
    },
    getMenuList: (state) => {
      if (state.supportColumn) {
        if (state.currentColumnId == null || state.currentColumnId === '') return [];
        for (let i = 0; i < state.menuList.length; i++) {
          if (state.menuList[i].menuId === state.currentColumnId) {
            return state.menuList[i].children || [];
          }
        }

        return [];
      } else {
        return state.menuList;
      }
    },
    getColumnList: (state) => {
      if (!state.supportColumn) return [];
      return state.menuList.map(menu => {
        // if (menu.menuType === StaticDict.SysMenuType.DIRECTORY) {
        return {
          columnId: menu.menuId,
          columnName: menu.menuName
        }
        // }
      }).filter(item => item != null);
    },
    getCurrentMenuId: (state) => {
      return state.currentMenuId;
    },
    getMenuItem: (state) => {
      if (Array.isArray(state.menuList)) {
        for (let i = 0; i < state.menuList.length; i++) {
          let temp = findMenuItem(state.menuList[i], state.currentMenuId);
          if (temp != null) return temp;
        }
      }
      return null;
    },
    getCurrentMenuPath: (state) => {
      let menuPath = [];
      if (Array.isArray(state.menuList)) {
        for (let i = 0; i < state.menuList.length; i++) {
          let temp = findMenuItem(state.menuList[i], state.currentMenuId, menuPath);
          if (temp != null) break;
        }
      }

      return menuPath;
    },
    getMultiColumn: (state) => {
      return state.supportColumn;
    },
    getCurrentColumnId: (state) => {
      return state.currentColumnId;
    }
  }
}
