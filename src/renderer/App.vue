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
        <v-btn icon @click.native.stop="miniVariant = !miniVariant" >
          <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
        </v-btn>
        <v-toolbar-title v-text="title"></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>add</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>settings</v-icon>
        </v-btn>
      </v-toolbar>
      <v-content>
        <v-container fluid fill-height>
          <v-slide-y-transition mode="out-in">
            <router-view></router-view>
          </v-slide-y-transition>
        </v-container>
      </v-content>
      <v-navigation-drawer temporary fixed app ></v-navigation-drawer>
      <!--<v-footer app>-->
        <!--<v-spacer></v-spacer>-->
        <!--<span>&copy; Vincent LE QUEC 2018</span>-->
        <!--<v-spacer></v-spacer>-->
      <!--</v-footer>-->
    </v-app>
  </div>
</template>

<script>
  // import {StreamLinkGuiMutations} from './store/mutations'
  import {StreamLinkGuiActions} from './store/actions'

  export default {
    name: 'streamlink-gui',
    data: () => ({
      drawer: true,
      items: [
        { icon: 'video_library', title: 'Streams', to: '/' },
        { icon: 'lock_open', title: 'Sensitive content', to: '/sensitive_content' },
        { icon: 'fab fa-vuejs', title: 'Electron-vue + Vuetify', to: '/vue' }
      ],
      miniVariant: false,
      title: 'Streamlink GUI'
    }),
    mounted () {
      this.$store.dispatch(StreamLinkGuiActions.SET_STREAMS)
      this.$store.dispatch(StreamLinkGuiActions.ON_LIVE, this.$store.state.streams)
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons');
  /* Global CSS */
</style>
