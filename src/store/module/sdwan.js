import { setObjectToSessionStorage, getObjectFromSessionStorage } from '@/utils'

export default {
  state: {
    sdWanAdom: getObjectFromSessionStorage('sdWanAdom', undefined)
  },
  mutations: {
    setSdWanADom (state, sdWanAdom) {
      if (setObjectToSessionStorage('sdWanAdom', sdWanAdom)) state.sdWanAdom = sdWanAdom
    }
  },
  actions: {
  }
}
