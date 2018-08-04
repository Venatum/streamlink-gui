<template>
    <div>
        <v-card flat class="elevation-20 white--text">
            <!--<v-card-media class="streamLogo"-->
                          <!--:src="`https://unsplash.it/200/200?image=${Math.floor(Math.random() * 100) + 1}`"-->
                          <!--width="200px" height="200px"-->
            <!--&gt;</v-card-media>-->
            <v-card-media class="streamLogo"
                          :src="getIcon"
                          width="200px" height="200px"
            ></v-card-media>
            <v-card-title>
                <v-layout align-center justify-space-around row fill-height>
                    <!--<v-icon>fab fa-twitch</v-icon>-->
                    {{ stream.name }}
                    <v-tooltip bottom>
                        <v-btn @click="playStream" icon flat slot="activator">
                            <v-icon>far fa-play-circle</v-icon>
                        </v-btn>
                        <span>Play</span>
                    </v-tooltip>
                </v-layout>
            </v-card-title>
            <v-card-actions>
                <v-layout align-center justify-space-around row fill-height>
                    <v-tooltip v-if="stream.favourite" bottom>
                        <v-btn @click="updateFavourite" icon flat color="yellow" slot="activator">
                            <v-icon>star</v-icon>
                        </v-btn>
                        <span>Remove from favourite</span>
                    </v-tooltip>
                    <v-tooltip v-else bottom>
                        <v-btn @click="updateFavourite" icon flat color="grey" slot="activator">
                            <v-icon>star</v-icon>
                        </v-btn>
                        <span>Add to favourite</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <v-btn @click="setEditStreamTrue" icon flat color="primary" slot="activator">
                            <v-icon>fas fa-edit</v-icon>
                        </v-btn>
                        <span>Edit stream</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <v-btn @click="deleteStream" icon flat color="red" slot="activator">
                            <v-icon>fas fa-trash-alt</v-icon>
                        </v-btn>
                        <span>Delete stream</span>
                    </v-tooltip>
                </v-layout>
            </v-card-actions>
        </v-card>
        <!-- Add/Update stream -->
        <edit-stream v-if="editStream" :editStream="editStream" :stream="stream" v-on:setEditStream="setEditStream" v-on:updateStream="updateStream"></edit-stream>
    </div>
</template>

<script>
    import EditStream from './EditStream'
    import {StreamLinkGuiMutations} from '../../store/mutations'
    import {StreamLinkGuiActions} from '../../store/actions'

    export default {
      name: 'StreamInformation',
      components: {EditStream},
      props: ['stream'],
      data: function () {
        return {
          editStream: false
        }
      },
      computed: {
        getIcon () {
          return (this.stream.icon) ? this.stream.icon : '/static/Icons/noImage.svg'
        }
      },
      methods: {
        updateFavourite () {
          this.$store.commit(StreamLinkGuiMutations.UPDATE_FAVOURITE, this.stream.id)
        },
        updateStream (stream) {
          this.$store.commit(StreamLinkGuiMutations.UPDATE_STREAM, stream)
        },
        deleteStream () {
          this.$emit('deleteStream', this.stream.id)
        },
        setEditStream (val) {
          this.editStream = val
        },
        setEditStreamTrue () {
          this.editStream = true
        },
        playStream () {
          this.$store.dispatch(StreamLinkGuiActions.PLAY_STREAM, this.stream)
        }
      }
    }
</script>

<style scoped>

</style>