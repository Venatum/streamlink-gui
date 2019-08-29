<template>
    <v-container fluid grid-list-md>
        <v-data-iterator :items="getStreams"
                         :search="search"
                         :items-per-page.sync="itemsPerPage"
                         :footer-props="{
                            itemsPerPageOptions: itemsPerPageArray,
                            showCurrentPage: true,
                            showFirstLastPage: true
                         }">
        <template v-slot:header>
                <v-toolbar dark color="darken-3" class="mb-1">
                    <v-text-field v-model="search" clearable flat solo-inverted hide-details
                                  prepend-inner-icon="search" label="Search"></v-text-field>
                    <template v-if="$vuetify.breakpoint.mdAndUp">
                        <div class="flex-grow-1"></div>
                        <v-toolbar-title style="padding-right: 30px">Filter by</v-toolbar-title>
                        <v-btn-toggle v-model="streamFilter">
                            <v-btn rounded value="all" @click="filter('all')">Show All</v-btn>
                            <v-btn rounded value="favourite" @click="filter('favourite')">Favourite</v-btn>
                            <v-btn rounded value="onLine" @click="filter('onLine')">On Line</v-btn>
                            <v-btn rounded value="offLine" @click="filter('offLine')">Off Line</v-btn>
                        </v-btn-toggle>
                    </template>
                </v-toolbar>
            </template>

            <template v-slot:default="props">
                <v-layout wrap>
                    <v-flex xs-12 sm6 md4 lg2 v-for="stream in props.items" :key="stream.id">
                        <stream-information :stream="stream" v-on:deleteStream="deleteStream"></stream-information>
                    </v-flex>
                </v-layout>
            </template>
        </v-data-iterator>

        <!-- Delete Alert -->
        <v-dialog v-model="deleteAlerte" persistent max-width="500px">
            <v-card>
                <v-card-title class="headline red">Delete stream</v-card-title>
                <v-card-text>Are you sure to delete this stream?</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click.native="deleteAlerte = false">
                        Cancel
                    </v-btn>
                    <v-btn color="red darken-1" text @click.native="deleteAlerte = false" @click="deleteConfirm">
                        Delete
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- StreamQuality -->
        <stream-quality v-if="onQuality" :onQuality="onQuality"></stream-quality>
    </v-container>
</template>

<script>
  import StreamInformation from './StreamView/StreamInformation'
  import {StreamLinkGuiMutations} from '../store/mutations'
  import Isotope from 'vueisotope'
  import StreamQuality from './StreamView/StreamQuality'

  export default {
    name: 'StreamView',
    components: {StreamQuality, StreamInformation, Isotope},
    data: () => {
      return {
        streams: [],
        search: '',
        itemsPerPageArray: [2, 4, 6, 12, 24, -1],
        itemsPerPage: 12,
        streamFilter: true,
        deleteAlerte: false,
        deleteId: -1
      }
    },
    methods: {
      filter: function (key) {
        switch (key) {
          case 'all':
            this.setStreams()
            break
          case 'favourite':
            this.streams = this.$store.getters.getStreams.filter((stream) => stream.favourite)
            break
          case 'onLine':
            this.streams = this.$store.getters.getStreams.filter((stream) => stream.live)
            break
          case 'offLine':
            this.streams = this.$store.getters.getStreams.filter((stream) => !stream.live)
            break
        }
      },
      deleteStream (id) {
        this.deleteId = id
        this.deleteAlerte = true
      },
      deleteConfirm () {
        this.$store.commit(StreamLinkGuiMutations.DEL_STREAM, this.deleteId)
        this.setStreams()
      },
      setStreams () {
        this.streams = this.$store.getters.getStreams
        if (this.streams.length === 0) {
          setTimeout(this.setStreams)
        }
      }
    },
    computed: {
      getStreams () {
        return this.streams
        // return this.$store.getters.getStreams
      },
      onQuality () {
        return this.$store.state.quality.display
      }
    },
    mounted () {
      this.setStreams()
    }
  }
</script>

<style>

</style>
