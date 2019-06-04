<template>
    <v-container grid-list-md text-xs-center>
        <stream-alert class="px-0"></stream-alert>
        <v-card>
            <v-card-title class="grey">
                <span class="headline">Play VOD / Stream</span>
            </v-card-title>
            <v-card-text>
                <v-container grid-list-md>
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-text-field
                                    label="Stream / VOD URL" required autofocus clearable
                                    hint="Example: youtube.com/watch?v=XXXXXXXXX"
                                    prepend-icon="fas fa-link"
                                    v-model="stream.url">
                            </v-text-field>
                            <v-text-field disabled
                                          label="Plugin"
                                          prepend-icon="fas fa-info-circle"
                                          v-model="stream.plugin.name">
                            </v-text-field>
                        </v-flex>
                        <v-flex v-if="stream.plugin.auth" xs12>
                            <hr/>
                            <h2 class="grey" style="text-align: center">Login and/or Key</h2>
                            <hr/>
                            <v-text-field clearable
                                          label="Login"
                                          prepend-icon="far fa-user"
                                          v-model="stream.plugin.login">
                            </v-text-field>
                            <v-text-field clearable
                                          label="Password"
                                          type="password"
                                          prepend-icon="fas fa-unlock"
                                          v-model="stream.plugin.password">
                            </v-text-field>
                            <v-text-field clearable
                                          label="Key / Token"
                                          prepend-icon="fas fa-key"
                                          v-model="stream.plugin.key">
                            </v-text-field>
                        </v-flex>
                    </v-layout>
                </v-container>
                <small>* indicates required field</small>
                <v-alert outline v-if="streamAlert.active" :value="streamAlert.active" :type="streamAlert.type"
                         style="text-align: center">
                    {{ this.streamAlert.msg }}
                </v-alert>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" @click="onClear">Clear</v-btn>
                <v-btn color="green darken-1" @click="onPlay">Play</v-btn>
            </v-card-actions>
        </v-card>
        <v-dialog
                v-model="loading"
                persistent
                width="300">
            <v-card color="primary" dark>
                <v-card-text>
                    Please stand by
                    <v-progress-linear
                            indeterminate
                            color="white"
                            class="mb-0"
                    ></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>
        <!-- StreamQuality -->
        <stream-quality v-if="onQuality" :onQuality="onQuality"></stream-quality>
    </v-container>
</template>

<script>
  // import {checkURL, extractRootDomain} from '../tools'
  import {extractRootDomain} from '../tools'
  import {StreamLinkGuiActions} from '@/store/actions'
  import StreamQuality from './StreamView/StreamQuality'

  export default {
    name: 'PlayVODView',
    components: {StreamQuality},
    data: function () {
      return {
        loading: false,
        stream: {
          plugin: {
            name: '',
            auth: false,
            login: '',
            password: '',
            key: ''
          },
          url: '',
          quality: 'best'
        },
        streamAlert: {
          active: false,
          msg: '',
          type: ''
        }
      }
    },
    watch: {
      'stream.url': function (val) {
        if (val) {
          this.stream.plugin.name = extractRootDomain(val)
          this.checkPlugin()
          if (this.stream.plugin.name === '') {
            this.resetStreamAlert()
          }
        } else {
          this.stream.plugin.name = ''
          this.resetStreamAlert()
        }
      }
    },
    methods: {
      checkPlugin () {
        for (let plugin in this.$store.state.plugins) {
          if (this.$store.state.plugins[plugin].urls.includes(this.stream.plugin.name)) {
            this.stream.plugin.name = this.$store.state.plugins[plugin].name
            if ('notes' in this.$store.state.plugins[plugin] && this.$store.state.plugins[plugin].notes !== null) {
              this.setStreamAlert(true, this.$store.state.plugins[plugin].notes, 'warning')
            }
            if ('auth' in this.$store.state.plugins[plugin]) {
              // this.stream.plugin.auth = this.$store.state.plugins[plugin].auth
              // @TODO: set auth
            }
            break
          }
        }
      },
      pluginFound () {
        for (let plugin in this.$store.state.plugins) {
          if (this.$store.state.plugins[plugin].name === this.stream.plugin.name) {
            return true
          }
        }
        return false
      },
      setStreamAlert (active, msg, type) {
        this.streamAlert.active = active
        this.streamAlert.msg = msg
        this.streamAlert.type = type
      },
      resetStreamAlert () {
        this.streamAlert.active = false
        this.streamAlert.msg = ''
        this.streamAlert.type = ''
      },
      resetStream () {
        this.stream = {
          plugin: {
            name: '',
            auth: false,
            login: '',
            password: '',
            key: ''
          },
          url: '',
          quality: 'best'
        }
      },
      onPlay () {
        this.loading = true
        if (this.pluginFound()) {
          this.$store.dispatch(StreamLinkGuiActions.QUALITY_CHOICE, this.stream)
        } else {
          this.$notify({
            type: 'error',
            title: 'Plugin not found',
            text: `Unable to find plugin: <b>${this.stream.plugin.name}</b>`
          })
        }
        this.loading = false
      },
      onClear () {
        this.resetStreamAlert()
        this.resetStream()
      }
    },
    computed: {
      onQuality () {
        return this.$store.state.quality.display
      }
    }
  }
</script>

<style scoped>

</style>
