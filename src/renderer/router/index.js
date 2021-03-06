import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Streams',
      component: require('@/components/StreamView').default
    },
    {
      path: '/play_vod',
      name: 'Play VOD / Stream',
      component: require('@/components/PlayVODView').default
    },
    {
      path: '/vue',
      name: 'Electron-vue + Vuetify',
      component: require('@/components/WelcomeView').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
