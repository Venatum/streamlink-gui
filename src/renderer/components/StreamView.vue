<template>
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
            <v-container fluid>
                <v-expansion-panel expand popout>
                    <v-expansion-panel-content value="true">
                        <div slot="header">
                            <v-icon color="yellow">star</v-icon> Favourite
                        </div>
                        <v-layout row wrap>
                            <v-flex
                                    v-for="stream in getStreams"
                                    :key="stream.id"
                                    v-if="stream.favourite && !stream.sensitive"
                                    xs5 sm4 md3 lg2 xl2
                            >
                                <stream-information :stream="stream" v-on:deleteStream="deleteStream"></stream-information>
                            </v-flex>
                        </v-layout>
                    </v-expansion-panel-content>
                    <v-expansion-panel-content>
                        <div slot="header">
                            <v-icon color="red">video_library</v-icon>
                            Your streams
                        </div>
                        <v-layout row wrap>
                            <v-flex
                                    v-for="stream in getStreams"
                                    :key="stream.id"
                                    v-if="!stream.favourite && !stream.sensitive"
                                    xs5 sm4 md3 lg2 xl2
                            >
                                <stream-information :stream="stream" v-on:deleteStream="deleteStream"></stream-information>
                            </v-flex>
                        </v-layout>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-container>
        </v-layout>
        <!-- Delete Alerte -->
        <v-dialog v-model="deleteAlerte" persistent max-width="500px">
            <v-card>
                <v-card-title class="headline red">Delete stream</v-card-title>
                <v-card-text>Are you sure to delete this stream?</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click.native="deleteAlerte = false">
                        Cancel
                    </v-btn>
                    <v-btn color="red darken-1" flat @click.native="deleteAlerte = false" @click="deleteConfirm">
                        Delete
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import StreamInformation from './StreamView/StreamInformation'

    export default {
      name: 'StreamView',
      components: {StreamInformation},
      data: function () {
        return {
          panelFavourite: true,
          panelStreams: true,
          deleteAlerte: false,
          deleteId: -1
        }
      },
      methods: {
        updateStreamInfo (infos) {
          console.log(infos)
          for (let stream in this.streams) {
            if (stream.id === infos.id) {
              for (let info in infos) {
                console.log(stream[info])
                stream[info] = infos[info]
                break
              }
            }
          }
        },
        deleteStream (id) {
          this.deleteId = id
          this.deleteAlerte = true
        },
        deleteConfirm () {
          this.streams = this.streams.filter(stream => stream.id !== this.deleteId)
        }
      },
      computed: {
        getStreams () {
          return this.$store.state.streams
        }
      }
    }
</script>

<style scoped>

</style>