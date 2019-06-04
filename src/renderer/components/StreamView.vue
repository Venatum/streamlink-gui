<template>
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
            <v-toolbar fixed app style="margin-top: 64px">

                <v-spacer></v-spacer>
                <v-toolbar-title>Filter by</v-toolbar-title>
                <v-spacer></v-spacer>

                <v-btn-toggle v-model="streamFilter">
                    <v-btn flat value="all" @click="filter('all')">Show All</v-btn>
                    <v-btn flat value="favourite" @click="filter('favourite')">Favourite</v-btn>
                    <v-btn flat value="onLine" @click="filter('onLine')">On Line</v-btn>
                    <v-btn flat value="offLine" @click="filter('offLine')">Off Line</v-btn>
                </v-btn-toggle>

                <v-spacer></v-spacer>
                <v-divider vertical inset></v-divider>
                <v-spacer></v-spacer>
                <v-toolbar-title>Sort by</v-toolbar-title>
                <v-spacer></v-spacer>

                <v-btn-toggle v-model="streamSort">
                    <v-btn flat value="id" @click="sort('id')">Id</v-btn>
                    <v-btn flat value="name" @click="sort('name')">Name</v-btn>
                </v-btn-toggle>

                <v-spacer></v-spacer>

            </v-toolbar>
            <v-container fluid>
                <isotope ref="isotope" :list="getStreams" :options='option' style="margin: 0 auto;">
                    <div v-for="stream in getStreams" :key="stream.id"
                         v-if="!stream.sensitive"
                         class="isotope" style="margin-bottom: 10px; padding: 10px; min-width: 300px; min-height: 300px;">
                        <stream-information :stream="stream" v-on:deleteStream="deleteStream"></stream-information>
                    </div>
                </isotope>
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
          panelFavourite: true,
          panelStreams: true,
          deleteAlerte: false,
          deleteId: -1,
          option: {
            itemSelector: '.isotope',
            getFilterData: {
              all: function () {
                return true
              },
              favourite: function (el) {
                return el.favourite
              },
              onLine: function (el) {
                return el.live
              },
              offLine: function (el) {
                return !el.live
              }
            },
            getSortData: {
              name: 'name',
              live: 'live'
            },
            layout: 'masonry',
            masonry: {
              columnWidth: 300,
              fitWidth: true,
              gutter: 10
            }
          },
          streamFilter: 'all',
          streamSort: 'id'
        }
      },
      methods: {
        sort: function (key) {
          this.$refs.isotope.sort(key)
        },
        filter: function (key) {
          this.$refs.isotope.filter(key)
        },
        deleteStream (id) {
          this.deleteId = id
          this.deleteAlerte = true
        },
        deleteConfirm () {
          this.$store.commit(StreamLinkGuiMutations.DEL_STREAM, this.deleteId)
        }
      },
      computed: {
        getStreams () {
          return this.$store.state.streams
        },
        onQuality () {
          return this.$store.state.quality.display
        }
      }
    }
</script>

<style scoped>

</style>
