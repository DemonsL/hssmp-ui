import axios from '@/libs/api.request'
export const Action = {
  PRE_LOGIN : '/admin/upms/login/preLogin',
  PHONE_WITH_PASSWORD_LOGIN: '/admin/upms/login/phoneWithPaswordLogin',
  SMS_LOGIN: '/admin/upms/login/phoneLogin',
  CODE_LOGIN: '/admin/upms/login/tenantCodeLogin',
  LOGIN_OUT: '/admin/upms/login/doLogout',
}

export default class SystemController {



//获取修改密码手机验证码
  static smsForChangePassword = (data) =>{
    return axios.post('/admin/upms/login/smsForChangePassword',data)
  }

//获取修改密码手机验证码
  static checkOldPass = (data) =>{
    return axios.post('/admin/upms/login/checkOldPass',data)
  }

//修改密码
  static changePassword = (data) =>{
    return axios.post('/admin/upms/login/changePassword',data)
  }

//获取图形验证码
  static getCaptchaImage = () =>{
    return axios.get('/admin/upms/login/captchaImage',{type:'char'})
  }

//获取短信验证码
  static getSmsCode = (data) =>{
    return axios.post('/admin/upms/login/sms',data)
  }

//校验图形验证码
  static checkCaptchaImage = (data) =>{
    return axios.post('/admin/upms/login/checkCaptcha',data)
  }

//获取用户登入信息(用于用户在新的tab中打开页面是保持token)
  static getLoginInfo = () => {
    return axios.get('/admin/upms/login/getLoginInfo')
  }

//获取用户登入信息(用于用户在新的tab中打开页面是保持token)
  static getBasicInfo = () => {
    return axios.get('/admin/upms/login/getBasicInfo')
  }

//租户选择
  static preLogin = (data) => {
    return axios.post(Action.PRE_LOGIN,data)
  }

//手机验证码登入
  static phoneLogin = (data) => {
    return axios.post(Action.SMS_LOGIN,data)
  }

//手机账号密码登入
  static phoneWithPaswordLogin = (data) => {
    return axios.post(Action.PHONE_WITH_PASSWORD_LOGIN,data)
  }

//通过企业号登入
  static tenantCodeLogin = (data) => {
    return axios.post(Action.CODE_LOGIN,data)
  }

//登出
  static logout = () => {
    return axios.post(Action.LOGIN_OUT)
  }

  static login (data) {
    return axios.post('admin/upms/login/tenantCodeLogin',data);
  }

  static logout (data) {
    return axios.post('admin/upms/login/doLogout',data);
  }

  static doLoginByUaa (data) {
    return axios.post('admin/upms/login/doLoginByUaa',data);
  }

  static getUaaLoginUrl (params) {
    return axios.post('admin/upms/login/getUaaLoginUrl', params);
  }

  static getUaaLogoutUrl (params) {
    return axios.post('admin/upms/login/getUaaLogoutUrl', params);
  }

  static changePasswordByUaa (data) {
    return axios.post('admin/upms/login/changePasswordByUaa',data);
  }

  static getDictList (data) {
    return axios.post('admin/upms/sysDict/list',data);
  }

  static getRoleList (data) {
    return axios.post('admin/upms/sysRole/list',data);
  }

  static getRole (params) {
    return axios.get('admin/upms/sysRole/view', params);
  }

  static deleteRole (data) {
    return axios.post('admin/upms/sysRole/delete',data);
  }

  static addRole (data) {
    return axios.post('admin/upms/sysRole/add',data);
  }

  static updateRole (data) {
    return axios.post('admin/upms/sysRole/update',data);
  }

  static getUserList (data) {
    return axios.post('admin/upms/sysUser/list',data);
  }

  static getUser (params) {
    return axios.get('admin/upms/sysUser/view', params);
  }

  static resetUserPassword (data) {
    return axios.post('admin/upms/sysUser/resetPassword',data);
  }

  static deleteUser (data) {
    return axios.post('admin/upms/sysUser/delete',data);
  }

  static addUser (data) {
    return axios.post('admin/upms/sysUser/add',data);
  }

  static updateUser (data) {
    return axios.post('admin/upms/sysUser/update',data);
  }

  static addDepartment (data) {
    return axios.post('admin/upms/sysDept/add',data);
  }

  static deleteDepartment (data) {
    return axios.post('admin/upms/sysDept/delete',data);
  }

  static updateDepartment (data) {
    return axios.post('admin/upms/sysDept/update',data);
  }

  static getDepartmentList (data) {
    return axios.post('admin/upms/sysDept/list',data);
  }

  // 菜单接口
  static getMenuPermList (data) {
    return axios.post('admin/upms/sysMenu/list',data);
  }
  static updateMenu (data) {
    return axios.post('admin/upms/sysMenu/update',data);
  }
  static viewMenu (params) {
    return axios.get('admin/upms/sysMenu/view', params);
  }
  /**
   * @param params    {roleId, searchString}
   */
  static listRoleUser (data) {
    return axios.post('admin/upms/sysRole/listUserRole',data);
  }

  static listNotInUserRole (data) {
    return axios.post('admin/upms/sysRole/listNotInUserRole',data);
  }

  /**
   * @param params    {roleId, userIdListString}
   */
  static addRoleUser (data) {
    return axios.post('admin/upms/sysRole/addUserRole',data);
  }

  /**
   * @param params    {roleId, userId}
   */
  static deleteRoleUser (data) {
    return axios.post('admin/upms/sysRole/deleteUserRole',data);
  }

  /**
   * @param params {}
   */
  static queryRoleByPermCode (data) {
    return axios.post('admin/upms/sysRole/listAllRolesByPermCode',data);
  }

  static getSysLogList (data) {
    return axios.post('admin/upms/sysLog/list',data);
  }

}
