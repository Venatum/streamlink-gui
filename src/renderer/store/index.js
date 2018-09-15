import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const state = {
  streams: [],
  plugins: [],
  alert: {
    msg: 'Welcome on Streamlink-GUI',
    type: 'success',
    display: true
  },
  config: {
    id: 0,
    language: 'english'
  },
  liveLoader: false
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  strict: process.env.NODE_ENV !== 'production'
})
