import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 当前用户只能访问的路由地址
    pathArr: JSON.parse(window.localStorage.getItem('pathArr')) || ['/'],
    // 用户信息
    userInfo: JSON.parse(window.localStorage.getItem('info')) || {},
    token: JSON.parse(window.localStorage.getItem('token')) || ''
  },
  mutations: {
    // 保存token
    saveToken(state, payload){
      window.localStorage.setItem('token', JSON.stringify(payload));
      state.token = payload;
    },
    // 保存用户信息
    saveUserInfo(state, payload){
      window.localStorage.setItem('info', JSON.stringify(payload));
      state.userInfo = payload;
    },
    // 添加路由地址
    add(state, payload){
      window.localStorage.setItem('pathArr', JSON.stringify(payload));
      state.pathArr = payload;
    }
  },
  actions: {
    updateToken({ commit }, products){
      commit('saveToken', products);
    },
    updateUserInfo({ commit }, products){
      commit('saveUserInfo', products);
    },
    // 提交mutations添加路由地址
    add({ commit }, products){
      commit('add', products);
    }
  }
})
