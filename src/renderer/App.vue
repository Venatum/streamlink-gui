<template>
    <div id="app">
        <v-app dark>
            <v-navigation-drawer
                    fixed
                    :mini-variant="miniVariant"
                    v-model="drawer"
                    app
            >
                <v-list>
                    <v-list-tile
                            router
                            :to="item.to"
                            :key="i"
                            v-for="(item, i) in items"
                            exact
                            @click="resetAlert"
                    >
                        <v-list-tile-action>
                            <v-icon v-html="item.icon"></v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title v-text="item.title"></v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-navigation-drawer>
            <v-toolbar fixed app>
                <v-toolbar-side-icon @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
                <v-btn icon @click.native.stop="miniVariant = !miniVariant">
                    <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
                </v-btn>
                <v-toolbar-title v-text="title"></v-toolbar-title>
                <v-spacer></v-spacer>
                <!-- TODO: check update -->
                <v-btn v-if="update" icon flat color="orange">
                    <v-icon>notification_important</v-icon>
                </v-btn>
                <v-btn v-if="isConnected" icon flat color="green">
                    <v-icon>wifi</v-icon>
                </v-btn>
                <v-btn v-else icon flat color="red">
                    <v-icon>wifi_off</v-icon>
                </v-btn>
                <v-btn icon flat color="red"
                       :loading="this.$store.state.liveLoader"
                       :disabled="this.$store.state.liveLoader"
                       @click="reloadIsLive">
                    <v-icon>cached</v-icon>
                </v-btn>
                <v-btn disabled icon @click="showConfig = !showConfig">
                    <v-icon>settings</v-icon>
                </v-btn>
            </v-toolbar>
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
            </v-content>
            <v-navigation-drawer temporary fixed app></v-navigation-drawer>
        </v-app>
    </div>
</template>

<script>
  import {StreamLinkGuiActions} from './store/actions'
  import {StreamLinkGuiMutations} from './store/mutations'
  import AddStream from './components/StreamView/AddStream'
  import Config from './components/Toolbar/Config'
  import axios from 'axios'

  const {app} = require('electron').remote

  export default {
    name: 'streamlink-gui',
    components: {Config, AddStream},
    data: () => ({
      drawer: true,
      items: [
        {icon: 'play_circle_outline', title: 'Play VOD / Stream', to: '/play_vod'},
        {icon: 'video_library', title: 'Streams', to: '/'},
        {icon: 'lock_open', title: 'Sensitive content', to: '/sensitive_content'},
        {icon: 'fab fa-vuejs', title: 'Electron-vue + Vuetify', to: '/vue'}
      ],
      miniVariant: false,
      title: 'Streamlink GUI',
      addStream: false,
      showConfig: false,
      update: false,
      liveInterval: null,
      isConnected: false,
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
      resetAlert () {
        this.$store.commit(StreamLinkGuiMutations.SET_ALERT, {msg: 'Welcome to Streamlink-GUI', type: 'success'})
      },
      checkInternet () {
        this.isConnected = navigator.onLine
      },
      updateAvailable () {
        axios
          .get('https://api.github.com/repos/Venatum/streamlink-gui/releases/latest')
          // .get('https://api.github.com/repos/streamlink/streamlink/releases/latest')
          .then(response => {
            console.log(response.data.tag_name)
            console.log(app.getVersion())
            this.update = (response.data.tag_name !== app.getVersion())
          }).catch(error => {
            console.error(error)
            this.update = false
          })
      }
    },
    mounted () {
      this.$store.dispatch(StreamLinkGuiActions.SET_CONFIG)
      this.$store.dispatch(StreamLinkGuiActions.SET_STREAMS)
      this.setExe()
      this.$store.dispatch(StreamLinkGuiActions.SET_PLUGINS)
      this.$store.dispatch(StreamLinkGuiActions.RESET_LIVE, this.$store.state.streams)
      this.isConnected = navigator.onLine
      this.internetInterval = setInterval(this.checkInternet, 10000)
      this.liveInterval = setInterval(this.$store.dispatch(StreamLinkGuiActions.ON_LIVE, this.$store.state.streams), 10 * 60 * 1000)
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
