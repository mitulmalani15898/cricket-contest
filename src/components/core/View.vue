<template>
  <v-content>
    <div id="core-view">
      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </div>
  </v-content>
</template>

<script>
export default {
}
</script>

<style scoped>
    #core-view {
        padding-bottom: 100px;
    }
</style>
