<template>
    <v-dialog v-model="onConfig" persistent max-width="75%">
        <v-card>
            <v-card-title class="grey">
                <span class="headline">Streamlink configuration</span>
            </v-card-title>
            <v-card-text>
                <v-container grid-list-md>
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-select
                                    :items="languages"
                                    label="Language"
                                    v-model="config.language"
                            ></v-select>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" @click="onCancel">Cancel</v-btn>
                <v-btn color="green darken-1" @click="onSave">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
  export default {
    name: 'Config',
    props: ['showConfig'],
    data: function () {
      return {
        onConfig: this.showConfig,
        languages: ['English'],
        config: {
          language: 'English'
        }
      }
    },
    methods: {
      onSave () {
        this.onCancel()
      },
      onCancel () {
        this.onConfig = false

        // this.$emit('setAddStream', false)
      }
    }
  }
</script>

<style scoped>

</style>
