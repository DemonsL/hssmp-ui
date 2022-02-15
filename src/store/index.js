import Vue from 'vue'
import Vuex from 'vuex'

import upms from './module/upms'
import sdwan from './module/sdwan'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    upms,
    sdwan
  }
})
