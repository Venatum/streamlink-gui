<template>
    <v-dialog v-model="onEdit" persistent max-width="500px">
        <v-card>
            <v-card-title>
                <span class="headline">Stream informations</span>
            </v-card-title>
            <v-card-text>
                <v-container grid-list-md>
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-text-field label="Stream URL" required autofocus
                                          hint="Example: twitch.tv/[streamer]"
                                          @keyup.enter="onSave"
                                          @keyup.esc="onCancel"
                                          v-model="url">
                            </v-text-field>
                        </v-flex>
                    </v-layout>
                </v-container>
                <small>* indicates required field</small>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" @click.native="onEdit = false" @click="onCancel">Cancel</v-btn>
                <v-btn color="green darken-1" @click.native="onEdit = false" @click="onSave">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
      name: 'EditStream',
      props: ['editStream', 'stream'],
      data: function () {
        return {
          onEdit: this.editStream,
          onError: false,
          url: this.stream.url
        }
      },
      methods: {
        onSave () {
          console.log('@Todo: check url before save')
          console.log('@Todo: add favourite btn')
          console.log('@Todo: check 18+')
          let tmp = this.url.split('/')
          this.stream.name = tmp[1]
          this.stream.plugin = tmp[0]
          this.stream.url = this.url
          // this.$emit('updateStream', this.stream)
          this.onCancel()
        },
        onCancel () {
          this.onEdit = false
          this.$emit('setEditStream', false)
        }
      }
    }
</script>

<style scoped>

</style>