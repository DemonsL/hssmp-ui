import Vue from 'vue';
import { mapGetters } from 'vuex';

// 全局mixin对象
const globalMixin = {
  data () {
    return {
    }
  },
  methods: {
    /**
     * 判读用户是否有权限
     * @param {String} permCode  权限字
     */
    checkPermCodeExist (permCode) {
      if ((this.getUserInfo || {}).permCodeSet != null) {
        return this.getUserInfo.permCodeSet.has(permCode);
      } else {
        return this.getUserInfo.isAdmin;
      }
    },
    /**
     * 判读用户是否为管理员
     * @param {String} permCode  权限字
     */
    checkIsAdmin () {
      return this.getUserInfo.isAdmin;
    },
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  }
}

Vue.mixin(globalMixin);
