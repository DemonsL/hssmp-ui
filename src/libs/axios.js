import axios from 'axios'
import store from '@/store'
import { Message } from 'view-design'
import router from '@/router';
import { getToken, setToken } from '@/utils';
import JSONbig from 'json-bigint';
const addErrorLog = errorInfo => {
  const { statusText, status, request: { responseURL } } = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      timeout: 1000 * 30,
      withCredentials: true,
      headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        'Content-Type': 'application/json; charset=utf-8'
      },
      transformResponse: [
        function (data) {
          if (typeof data === 'string') {
            const JSONbigString = new JSONbig({storeAsString: true});
            return JSONbigString.parse(data);
          } else {
            return data;
          }
        }
      ]
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      this.queue[url] = true

      let token = getToken();
      let menuIdJsonStr = window.sessionStorage.getItem('currentMenuId');
      let currentMenuId;
      if (menuIdJsonStr != null) {
        currentMenuId = (JSON.parse(menuIdJsonStr) || {}).data;
      }
      if (token != null) config.headers['Authorization'] = token;
      if (currentMenuId != null) config.headers['MenuId'] = currentMenuId;
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(response => {
      this.destroy(url)
      const { data, status } = response
      if (data && data.errorCode === 'UNAUTHORIZED_LOGIN' || status === 401) { // 401, token失效
        setToken('')
        router.push({ name: 'login' })
      } else {
        if (response.headers['refreshedtoken'] != null) {
          setToken(response.headers['refreshedtoken']);
        }
      }
      return data
    }, error => {
      this.destroy(url)
      let response = error.response;
      if (response && response.data) {
        if (response.data.errorCode === 'UNAUTHORIZED_LOGIN' || response.status === 401) {
          setToken('')
          router.push({ name: 'login' });
        }
        return Promise.reject(response.data);
      } else {
        return Promise.reject(new Error({
          errorMessage: '数据获取失败，请稍后再试'
        }));
      }
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
  post (url, data) {
    let options = {url, method: 'post', data: this.buildPostData(data)}
    if (options.data === undefined) {
      delete options['data']
    }
    return this.call(options);
  }
  get (url, params) {
    let options = {url, method: 'get', params: this.buildGetData(params)}
    if (options.params === undefined) {
      delete options['params']
    }
    return this.call(options);
  }

  call (options) {
    let call = this.request(options)
    return new Promise((resolve, reject) => {
      call.then(data => {
        if (data && data.success) {
          resolve(data)
        } else {
          Message.error(data.errorMessage ? data.errorMessage : '数据请求失败');
          resolve(data);
        }
      }).catch(e => {
        Message.error(e.errorMessage ? e.errorMessage : '网络请求错误');
        reject(e);
      });
    })
  }

  buildGetData = (data) => {
    return this.buildPostData(data)
  }

  buildPostData = (data) => {
    if (data === undefined) {
      return {}
    }
    for (const key in data) {
      if (data.hasOwnProperty(key) && (data[key] === null || data[key] === undefined || data[key] === '' || data[key] === [])) {
        delete data[key]
      }
    }
    console.log('post:', data)
    return data
  }
}
export default HttpRequest
