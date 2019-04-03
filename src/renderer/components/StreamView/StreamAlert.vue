<template>
    <div class="streamAlert">
        <v-alert :value="getDisplay" :type="this.$store.state.alert.type" style="text-align: center">
            {{ this.$store.state.alert.msg }}
        </v-alert>
    </div>
</template>

<script>
    export default {
      // type: success, info, warning or error
      name: 'StreamAlert',
      computed: {
        getDisplay: function () {
          return this.$store.state.alert.display
        }
      }
    }
</script>

<style scoped>
    .streamAlert {
        width: 100%;
    }
</style>
