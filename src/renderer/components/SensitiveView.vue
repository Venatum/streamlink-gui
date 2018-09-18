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
            <!-- StreamAlert -->
            <stream-alert class="px-0"></stream-alert>
            <v-container fluid>
                <isotope ref="isotope" :list="getStreams" :options='option' style="margin: 0 auto;">
                    <div v-for="stream in getStreams" :key="stream.id"
                         v-if="stream.sensitive"
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
        <!-- +18 Alerte -->
        <v-dialog v-model="sensitiveAlerte" persistent max-width="500px">
            <v-card>
                <v-card-title class="headline red"><v-icon>lock</v-icon> Sensitive content 18+ </v-card-title>
                <v-card-text>Are you sure to enter this section?</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <router-link to="/" style="text-decoration: none">
                        <v-btn color="blue darken-1" flat @click.native="sensitiveAlerte = false">
                            Exit
                        </v-btn>
                    </router-link>
                    <v-btn color="red darken-1" flat @click.native="sensitiveAlerte = false" @click="onEnter">
                        Enter
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import StreamInformation from './StreamView/StreamInformation'
    import {StreamLinkGuiMutations} from '../store/mutations'
    import StreamAlert from './StreamView/StreamAlert'
    import Isotope from 'vueisotope'

    export default {
      name: 'SensitiveView',
      components: {StreamAlert, StreamInformation, Isotope},
      data: function () {
        return {
          panelFavourite: true,
          panelStreams: true,
          deleteAlerte: false,
          sensitiveAlerte: true,
          deleteId: -1,
          option: {
            itemSelector: '.isotope',
            filter: 'none',
            getFilterData: {
              all: function () {
                return true
              },
              none: function () {
                return false
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
          streamFilter: 'none',
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
        },
        onEnter () {
          this.filter('all')
          this.streamFilter = 'all'
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
