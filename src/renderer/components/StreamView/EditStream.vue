<template>
    <v-dialog v-model="onEdit" persistent max-width="75%">
        <v-card>
            <v-card-title class="grey">
                <span class="headline">Edit Stream</span>
            </v-card-title>
            <v-card-text>
                <v-container grid-list-md>
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-text-field
                                    label="Stream URL" required autofocus clearable
                                    hint="Example: twitch.tv/[streamer]"
                                    prepend-icon="fas fa-link"
                                    v-model="stream.url">
                            </v-text-field>
                            <v-text-field
                                    label="Stream Name" required
                                    prepend-icon="fas fa-user-circle"
                                    v-model="stream.name">
                            </v-text-field>
                            <v-text-field disabled
                                    label="Plugin"
                                    prepend-icon="fas fa-info-circle"
                                    v-model="stream.plugin.name">
                            </v-text-field>
                        </v-flex>
                        <v-flex xs6>
                            <v-switch
                                    label="Favourite"
                                    color="yellow"
                                    prepend-icon="star"
                                    v-model="stream.favourite"
                            ></v-switch>
                        </v-flex>
                        <v-flex xs6>
                            <v-switch
                                    label="Sensitive content"
                                    color="red"
                                    prepend-icon="fas fa-user-lock"
                                    v-model="stream.sensitive"
                            ></v-switch>
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
                 <v-alert outline v-if="streamAlert.active" :value="streamAlert.active" :type="streamAlert.type" style="text-align: center">
                    {{ this.streamAlert.msg }}
                </v-alert>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" @click.native="onEdit = false" @click="onCancel">Cancel</v-btn>
                <v-btn color="green darken-1" @click.native="onEdit = false" @click="onSave">Save</v-btn>
            </v-card-actions>
        </v-card>
        <v-dialog
                v-model="loading"
                hide-overlay
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
    </v-dialog>
</template>

<script>
    import {StreamLinkGuiMutations} from '@/store/mutations'

    export default {
      name: 'AddStream',
      props: ['editStream', 'data'],
      data: function () {
        return {
          onEdit: this.editStream,
          loading: false,
          stream: {
            id: this.data.id,
            name: this.data.name,
            plugin: {
              name: this.data.plugin.name,
              auth: this.data.plugin.auth,
              login: this.data.plugin.login,
              password: this.data.plugin.password,
              key: this.data.plugin.key
            },
            url: this.data.url,
            quality: this.data.quality,
            icon: this.data.icon,
            favourite: this.data.favourite,
            live: this.data.live,
            sensitive: this.data.sensitive
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
            let tmp = val.split('/')
            this.stream.plugin.name = tmp[0]
            this.stream.name = tmp[1]
            this.checkPlugin()
          } else {
            this.stream.plugin.name = ''
            this.stream.name = ''
            this.resetStreamAlert()
          }
        }
      },
      methods: {
        checkPlugin () {
          for (let plugin in this.$store.state.plugins) {
            if (this.$store.state.plugins[plugin].urls.includes(this.stream.plugin.name)) {
              this.stream.plugin.name = this.$store.state.plugins[plugin].name
              if ('notes' in this.$store.state.plugins[plugin]) {
                this.streamAlert.active = true
                this.streamAlert.msg = this.$store.state.plugins[plugin].notes
                this.streamAlert.type = 'warning'
              }
              break
            }
          }
        },
        resetStreamAlert () {
          this.streamAlert.active = false
          this.streamAlert.msg = ''
          this.streamAlert.type = ''
        },
        onSave () {
          console.log('@Todo: check url before save')
          this.$store.commit(StreamLinkGuiMutations.UPDATE_STREAM, this.stream)
          this.onCancel()
        },
        onCancel () {
          this.onEdit = false
          this.resetStreamAlert()
          this.$emit('setEditStream', false)
        }
      }
    }
</script>

<style scoped>

</style>