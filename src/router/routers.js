import Single from '@/components/single'
import Assets from '@/components/asset_manage'
import First from '@/components/asset_manage/first.vue'
import Sdwan from '@/components/sdwan/main'
import Sdwaninfo from '@/components/sdwan/main-info'
import SdwanDev from '@/components/sdwan/main-dev'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */
export default [{
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录',
    hideInMenu: true
  },
  component: () => import('@/view/login/login.vue')
},
{
  path: '/home',
  name: 'home',
  meta: {
    title: '业务选择',
    hideInMenu: true
  },
  component: () => import('@/nav.vue')
},
{
  path: '/',
  name: 'home',
  meta: {
    title: '业务选择',
    hideInMenu: true
  },
  component: () => import('@/nav.vue')
},

{
  path: '/info',
  name: 'info',
  component: Sdwaninfo,
  meta: {
    hideInMenu: true
  },
  children: [{
    path: 'info_path',
    name: 'information',
    meta: {
      title: '信息',
      notCache: true,
      icon: ''
    },
    component: () => import('@/view/sdwan/info/info.vue')
  }]
},

{
  path: '/Statistics',
  name: 'traffic',
  meta: {
    icon: 'md-pulse',
    title: '流量统计',
    hideInMenu: true
  },
  component: Sdwan,
  children: [{
    path: 'monitor_page',
    name: 'monitor',
    meta: {
      //  icon: 'md-trending-up',
      title: 'SLA监控'
    },
    component: () => import('@/view/sdwan/monitor/monitor.vue')
  },
  {
    path: 'traffic_in',
    name: 'traffic_in',
    meta: {
      //  icon: 'ios-infinite',
      title: '内部流量'
    },
    component: () => import('@/view/sdwan/traffic-in/traffic_in.vue')
  },
  {
    path: 'traffic_out',
    name: 'traffic_out',
    meta: {
      //  icon: 'ios-infinite',
      title: '外部访问流量'
    },
    component: () => import('@/view/sdwan/traffic-out/traffic_out.vue')
  },
  {
    path: 'ranking',
    name: 'ranking',
    meta: {
      //  icon: 'ios-infinite',
      title: '国家区域排名'
    },
    component: () => import('@/view/sdwan/ranking/ranking.vue')
  },
  {
    path: 'traffic_app',
    name: 'traffic_app',
    meta: {
      //  icon: 'ios-infinite',
      title: '应用流量'
    },
    component: () => import('@/view/sdwan/traffic-app/traffic_app.vue')
  }
  ]
},

{
  path: '/Device',
  name: 'dev',
  meta: {
    icon: 'logo-buffer',
    notCache: true,
    hideInMenu: true,
    title: '设备分组'
  },
  component: SdwanDev,
  children: [{
    path: 'device_page',
    name: 'device',
    meta: {
      //  icon: 'md-trending-up',
      title: '默认分组'
    },
    component: () => import('@/view/sdwan/device/device_dom.vue'),
    children: [
    ]
  },
  {
    path: 'device_info',
    name: 'deviceinfo',
    meta: {
      //  icon: 'ios-infinite',
      notCache: true,
      hideInMenu: true,
      title: '基本信息'
    },
    component: () => import('@/view/sdwan/device/device_show.vue')
  },
  {
    path: 'device_moni',
    name: 'devicemoni',
    meta: {
      //  icon: 'ios-infinite',
      notCache: true,
      hideInMenu: true,
      title: '网络监控'
    },
    component: () => import('@/view/sdwan/device/device_moni.vue')
  },
  {
    path: 'device_recouce',
    name: 'devicerecouce',
    meta: {
      //  icon: 'ios-infinite',
      notCache: true,
      hideInMenu: true,
      title: '资源监控'
    },
    component: () => import('@/view/sdwan/device/device_recouce.vue')
  }
  ]
},

{
  path: '/manager',
  name: 'manager',
  meta: {
    icon: 'md-person',
    title: '管理员'
  },
  component: Single,
  children: [
    {
      path: 'manage',
      name: 'manage',
      meta: {
        //  icon: 'md-trending-up',
        title: '管理员管理'
      },
      component: () => import('@/view/single/manage/manage.vue')
    },
    {
      path: 'post',
      name: 'post',
      meta: {
        //  icon: 'ios-infinite',
        title: '角色管理'
      },
      component: () => import('@/view/single/post-list/role-list.vue')
    }
  ]
},
{
  path: '/userinfo',
  name: 'userinfo',
  meta: {
    icon: 'ios-paper',
    title: '帐号信息'
  },
  component: Single,
  children: [
    {
      path: 'baseinfo',
      name: 'baseinfo',
      meta: {
        //  icon: 'ios-document',
        title: '基本信息'
      },
      component: () => import('@/view/single/info/info_edit.vue')
    },
    {
      path: 'repass',
      name: 'repass',
      meta: {
        // icon: 'md-clipboard',
        title: '修改密码'
      },
      component: () => import('@/view/single/info/repass.vue')
    }
  ]
},
{
  path: '/syslog',
  name: 'sys_log',
  meta: {
    icon: 'ios-list-box',
    title: '系统日志',
    showAlways: 'true'
  },
  component: Single,
  children: [
    {
      path: 'syslogpage',
      name: 'syslog',
      meta: {
        //  icon: 'md-add',
        title: '系统日志'
      },
      component: () => import('@/view/single/syslog/syslog.vue')
    }
  ]
},

{
  path: '/',
  name: '_first',
  component: First,
  meta: {
    hideInMenu: true
  },
  children: [{
    path: '/first',
    name: 'first',
    meta: {
      hideInMenu: true,
      notCache: true,
      title: '首次配置'
    },
    component: () => import('@/view/assets/first.vue')
  }]
},
{
  path: '/devinfo',
  name: 'devinfos',
  component: Assets,
  meta: {
    hideInMenu: true
  },
  children: [{
    path: '/devinfo_page',
    name: 'devinfo',
    meta: {
      title: '设备信息',
      notCache: true,
      icon: ''
    },
    component: () => import('@/view/assets/device/device_dom.vue')
  }]
},
{
  path: '/',
  name: 'run-log',
  component: Assets,
  meta: {
    hideInMenu: true
  },
  children: [{
    path: '/runlog',
    name: 'runlog',
    meta: {
      title: '执行记录',
      notCache: true,
      icon: ''
    },
    component: () => import('@/view/assets/run_log.vue')
  }]
},
{
  path: '/asset',
  name: 'asset',
  component: Assets,
  meta: {
    hideInMenu: true
  },
  children: [
    {
      path: '/asset',
      name: 'assetup',
      meta: {
        title: '资产配置',
        notCache: true,
        icon: ''
      },
      component: () => import('@/view/assets/asset_list.vue')
    },
    {
      path: '/assetview',
      name: 'assetview',
      meta: {
        title: '资产配置',
        notCache: true,
        icon: ''
      },
      component: () => import('@/view/assets/asset_view.vue')
    }
  ]
},

{
  path: '/Deview',
  name: 'deview',
  meta: {
    hideInMenu: true,
    icon: 'logo-buffer',
    title: '设备信息'
  },
  component: Assets,
  children: [{
    path: 'device_page',
    name: 'device-cab',
    meta: {
      //  icon: 'md-trending-up',
      title: '机柜列表'
    },
    component: () => import('@/view/assets/device/device_dom.vue'),
    children: [
    ]
  },
  {
    path: 'device_list',
    name: 'device-cab2',
    meta: {
      //  icon: 'ios-infinite',
      title: '机柜列表'
    },
    component: () => import('@/view/assets/device/device_txt.vue')
  },
  {
    path: 'device_info',
    name: 'device_info',
    meta: {
      //  icon: 'ios-infinite',
      notCache: true,
      hideInMenu: true,
      title: '基本信息'
    },
    component: () => import('@/view/assets/device/device_show.vue')
  }
  ]
},

{
  path: '/401',
  name: 'error_401',
  meta: {
    hideInMenu: true
  },
  component: () => import('@/view/error-page/401.vue')
},
{
  path: '/500',
  name: 'error_500',
  meta: {
    hideInMenu: true
  },
  component: () => import('@/view/error-page/500.vue')
},
{
  path: '*',
  name: 'error_404',
  meta: {
    hideInMenu: true
  },
  component: () => import('@/view/error-page/404.vue')
}
]
