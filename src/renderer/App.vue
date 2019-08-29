<template>
    <v-app dark>
        <v-navigation-drawer
                fixed
                :mini-variant="miniVariant"
                v-model="drawer"
                app
                dark
                clipped
        >
            <v-list>
                <v-list-item
                        router
                        :to="item.to"
                        :key="i"
                        v-for="(item, i) in items"
                        exact
                >
                    <v-list-item-action>
                        <v-icon v-html="item.icon"></v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title v-text="item.title"></v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar fixed app dark clipped-left>
            <v-app-bar-nav-icon @click.native.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-btn icon @click.native.stop="miniVariant = !miniVariant">
                <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
            </v-btn>
            <v-toolbar-title v-text="title"></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn v-if="update" icon color="orange" @click="openUpdate">
                <v-icon>notification_important</v-icon>
            </v-btn>
            <v-btn v-if="isConnected" icon color="green">
                <v-icon>wifi</v-icon>
            </v-btn>
            <v-btn v-else icon color="red">
                <v-icon>wifi_off</v-icon>
            </v-btn>
            <v-btn icon color="red"
                   :loading="this.$store.state.liveLoader"
                   :disabled="this.$store.state.liveLoader"
                   @click="reloadIsLive">
                <v-icon>cached</v-icon>
            </v-btn>
            <v-btn icon color="grey" @click="showConfig = !showConfig">
                <v-icon>settings</v-icon>
            </v-btn>
        </v-app-bar>
        <v-content>
            <v-container fluid fill-height>
                <v-slide-y-transition mode="out-in">
                    <router-view></router-view>
                </v-slide-y-transition>

                <add-stream v-if="addStream" :add-stream="addStream" v-on:setAddStream="setAddStream"></add-stream>

                <config v-if="showConfig" :show-config="showConfig"></config>

                <v-fab-transition>
                    <v-btn dark fab fixed bottom right
                           v-show="activeFab"
                           color="primary"
                           @click="addStream = !addStream">
                        <v-icon>add</v-icon>
                    </v-btn>
                </v-fab-transition>

            </v-container>
            <notifications position="bottom left" animation-type="velocity"></notifications>
        </v-content>
        <v-navigation-drawer temporary fixed app></v-navigation-drawer>
    </v-app>
</template>

<script>
  import {StreamLinkGuiActions} from './store/actions'
  import {StreamLinkGuiMutations} from './store/mutations'
  import AddStream from './components/StreamView/AddStream'
  import Config from './components/Toolbar/Config'
  import axios from 'axios'

  export default {
    name: 'streamlink-gui',
    components: {Config, AddStream},
    data: () => ({
      drawer: true,
      items: [
        {icon: 'play_circle_outline', title: 'Play VOD / Stream', to: '/play_vod'},
        {icon: 'video_library', title: 'Streams', to: '/'},
        {icon: 'fab fa-vuejs', title: 'Electron-vue + Vuetify', to: '/vue'}
      ],
      miniVariant: false,
      title: 'Streamlink GUI',
      addStream: false,
      showConfig: false,
      update: false,
      liveInterval: null,
      isConnected: false,
      notConnected: false,
      internetInterval: null
    }),
    methods: {
      setAddStream (val) {
        this.addStream = val
      },
      setExe () {
        let platform = require('os').platform()
        let config = this.$store.state.config

        if (platform === 'win32') {
          config['exe'] = 'streamlink.exe'
        } else {
          // TODO: check this
          config['exe'] = 'streamlink'
        }
        this.$store.commit(StreamLinkGuiMutations.SET_CONFIG, config)
      },
      reloadIsLive () {
        this.$store.dispatch(StreamLinkGuiActions.ON_LIVE, this.$store.state.streams)
      },
      checkInternet () {
        this.isConnected = navigator.onLine
        this.notConnected = !this.notConnected
        if (!this.isConnected) {
          this.$notify({
            type: 'error',
            title: 'Internet',
            text: 'Please check your internet connection',
            duration: 10000
          })
        }
      },
      openUpdate () {
        window.open('https://github.com/Venatum/streamlink-gui/releases')
      },
      updateAvailable () {
        // TODO: Update version on build
        axios
          .get('https://api.github.com/repos/Venatum/streamlink-gui/releases/latest')
          .then(response => {
            this.update = (response.data.tag_name !== 'Streamlink-gui_v0.2')
            if (this.update) {
              this.$notify({
                type: 'info',
                title: 'Update',
                text: 'A new version of Streamlink-GUI is available',
                duration: -1
              })
            }
          }).catch(error => {
            console.error(error)
            this.update = false
          })
      }
    },
    created () {
      this.$vuetify.theme.dark = true
    },
    mounted () {
      this.$store.dispatch(StreamLinkGuiActions.SET_CONFIG)
      this.$store.dispatch(StreamLinkGuiActions.SET_STREAMS)
      this.setExe()
      this.$store.dispatch(StreamLinkGuiActions.SET_PLUGINS)
      this.$store.dispatch(StreamLinkGuiActions.RESET_LIVE, this.$store.state.streams)
      this.checkInternet()
      this.internetInterval = setInterval(this.checkInternet, 10000)
      this.liveInterval = setInterval(this.$store.dispatch(StreamLinkGuiActions.ON_LIVE, this.$store.state.streams), 10 * 60 * 1000)
      this.$notify({
        type: 'success',
        title: 'Welcome to <b>Streamlink-GUI</b>',
        text: 'Thank to use it',
        duration: 5000
      })
      this.updateAvailable()
    },
    computed: {
      activeFab () {
        switch (this.$route.name) {
          case 'Streams':
          case 'Sensitive content':
            return true
          default:
            return false
        }
      }
    },
    destroyed () {
      clearInterval(this.internetInterval)
      clearInterval(this.liveInterval)
    }
  }
</script>

<style>
    @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons');
    /* Global CSS */
</style>
