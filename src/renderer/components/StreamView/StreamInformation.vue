<template>
    <div>
        <v-card flat class="elevation-20 white--text">
            <v-img class="streamLogo" :src="getIcon" height="200px"></v-img>
            <v-card-title>
                <v-layout align-center justify-space-around row fill-height>
                    <v-icon :style="{ color: (stream.live) ? 'red' : 'grey' }">fas fa-circle</v-icon>
                    <v-spacer></v-spacer>
                    <span class="body-2">{{ stream.name }}</span>
                    <v-spacer></v-spacer>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-btn @click="playStream" icon v-on="on">
                                <v-icon>far fa-play-circle</v-icon>
                            </v-btn>
                        </template>
                        <span>Play</span>
                    </v-tooltip>
                </v-layout>
            </v-card-title>
            <v-card-actions>
                <v-layout align-center justify-space-around row fill-height>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-btn @click="updateFavourite" icon :color="(stream.favourite) ? 'yellow' : 'grey'" v-on="on">
                                <v-icon>star</v-icon>
                            </v-btn>
                        </template>
                        <span v-if="stream.favourite">Remove from favourite</span>
                        <span v-else>Add to favourite</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-btn @click="setEditStreamTrue" icon color="primary" v-on="on">
                                <v-icon>fas fa-edit</v-icon>
                            </v-btn>
                        </template>
                        <span>Edit stream</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-btn @click="deleteStream" icon color="red" v-on="on">
                                <v-icon>fas fa-trash-alt</v-icon>
                            </v-btn>
                        </template>
                        <span>Delete stream</span>
                    </v-tooltip>
                </v-layout>
            </v-card-actions>
        </v-card>
        <!-- Add/Update stream -->
        <edit-stream v-if="editStream" :editStream="editStream" :data="stream"
                     v-on:setEditStream="setEditStream"></edit-stream>
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
        return (this.stream.icon) ? this.stream.icon : 'static/Icons/noImage.svg'
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
        this.$store.dispatch(StreamLinkGuiActions.QUALITY_CHOICE, this.stream)
      }
    }
  }
</script>

<style scoped>

</style>
