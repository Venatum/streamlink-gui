<template>
    <v-layout row justify-center>
        <v-dialog v-model="onQuality" scrollable max-width="300px">
            <v-btn slot="activator" color="primary" dark>Open Dialog</v-btn>
            <v-card>
                <v-card-title>Select Country</v-card-title>
                <v-divider></v-divider>
                <v-card-text style="height: 300px;">
                    <v-radio-group v-model="quality" column>
                        <v-radio v-for="(quality, i) in $store.state.quality.qualities" :key="i" :label="quality" :value="quality"></v-radio>
                    </v-radio-group>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-btn color="red darken-1" flat @click="onCancel">Cancel</v-btn>
                    <v-btn color="green darken-1" flat @click="onPlay">Play</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
  import {StreamLinkGuiMutations} from '../../store/mutations'
  import {StreamLinkGuiActions} from '../../store/actions'

  export default {
    name: 'StreamQuality',
    props: ['onQuality'],
    data () {
      return {
        quality: ''
      }
    },
    methods: {
      onPlay () {
        this.$store.commit(StreamLinkGuiMutations.UPDATE_STREAMED_STREAM, { quality: this.quality })
        this.$store.commit(StreamLinkGuiMutations.UPDATE_STREAM, this.$store.state.streamedStream)
        this.$store.dispatch(StreamLinkGuiActions.PLAY_STREAM, this.$store.state.streamedStream)
        this.onCancel()
      },
      onCancel () {
        this.$store.commit(StreamLinkGuiMutations.SET_STREAM_QUALITY, {display: false, qualities: []})
        this.$store.commit(StreamLinkGuiMutations.SET_ALERT, {msg: 'Welcome to Streamlink-GUI', type: 'success'})
      }
    }
  }
</script>

<style scoped>

</style>
