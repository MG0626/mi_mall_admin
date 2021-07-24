import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 当前用户只能访问的路由地址
    pathArr: ['/']
  },
  mutations: {
    // 添加路由地址
    add(state, payload){
      state.pathArr.push(...payload);
    }
  },
  actions: {
    // 提交mutations添加路由地址
    add({ commit }, products){
      commit('add', products);
    }
  }
})
