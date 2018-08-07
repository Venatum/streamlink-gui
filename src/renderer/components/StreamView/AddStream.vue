<template>
    <v-dialog v-model="onAdd" persistent max-width="75%">
        <v-card>
            <v-card-title>
                <span class="headline">Add Stream</span>
            </v-card-title>
            <v-card-text>
                <v-container grid-list-md>
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-text-field
                                    label="Stream URL" required autofocus clearable
                                    hint="Example: twitch.tv/[streamer]"
                                    prepend-icon="fas fa-link"
                                    v-model="streamUrl">
                            </v-text-field>
                            <v-text-field
                                    label="Stream Name" required
                                    prepend-icon="fas fa-user-circle"
                                    v-model="streamName">
                            </v-text-field>
                            <v-text-field disabled required
                                    label="Plugin"
                                    prepend-icon="fas fa-info-circle"
                                    v-model="streamPlugin">
                            </v-text-field>
                        </v-flex>
                    </v-layout>
                </v-container>
                <small>* indicates required field</small>
                 <v-alert v-if="streamAlert.active" :value="streamAlert.active" :type="streamAlert.type" style="text-align: center">
                    {{ this.streamAlert.msg }}
                </v-alert>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" @click.native="onAdd = false" @click="onCancel">Cancel</v-btn>
                <v-btn color="green darken-1" @click.native="onAdd = false" @click="onSave">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
      name: 'AddStream',
      props: ['addStream'],
      data: function () {
        return {
          onAdd: this.addStream,
          valid: true,
          streamUrl: '',
          streamName: '',
          streamPlugin: '',
          streamAlert: {
            active: false,
            msg: '',
            type: ''
          }
        }
      },
      watch: {
        streamUrl: function (val) {
          let tmp = val.split('/')
          this.streamPlugin = tmp[0]
          this.streamName = tmp[1]
        }
      },
      methods: {
        onSave () {
          console.log('@Todo: check url before save')
          console.log('@Todo: add favourite btn')
          console.log('@Todo: check 18+')
          // let tmp = this.url.split('/')
          // this.stream.name = tmp[1]
          // this.stream.plugin = tmp[0]
          // this.stream.url = this.url
          // this.$emit('updateStream', this.stream)
          this.onCancel()
        },
        onCancel () {
          this.onAdd = false
          this.$emit('setAddStream', false)
        }
      }
    }
</script>

<style scoped>

</style>