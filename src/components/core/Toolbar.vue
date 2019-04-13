<template>
  <v-toolbar
    id="core-toolbar"
    flat
    prominent
    accent
  >
    <div class="v-toolbar-title">
      <v-toolbar-title
        class="tertiary--text font-weight-light"
      >
        <v-btn
          v-if="responsive"
          class="default v-btn--simple"
          dark
          icon
          @click.stop="onClickBtn"
        >
          <v-icon>mdi-view-list</v-icon>
        </v-btn>
        {{ title | upperCase }}
      </v-toolbar-title>
    </div>

    <v-spacer />
    <v-toolbar-items>
      <v-flex
        align-center
        layout
        py-2
      >
        <v-menu offset-y>
          <template>
            <v-btn
                    icon
                    class="toolbar-items"
                    slot="activator"
            >
              <v-icon color="tertiary">mdi-account</v-icon>
              <v-icon color="tertiary">mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-tile>
              <v-list-tile-title class="tile-title clickable" color="tertiary" @click="logout">Logout</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-flex>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>

import {
  mapMutations
} from 'vuex'

export default {
  data: () => ({
    notifications: [
      'Mike, John responded to your email',
      'You have 5 new tasks',
      'You\'re now a friend with Andrew',
      'Another Notification',
      'Another One'
    ],
    title: null,
    responsive: false,
    responsiveInput: false
  }),

  watch: {
    '$route' (val) {
      this.title = val.name
    }
  },
  created() {
    this.title = this.$route.name
  },
  mounted () {
    this.onResponsiveInverted()
    window.addEventListener('resize', this.onResponsiveInverted)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResponsiveInverted)
  },
  methods: {
    ...mapMutations('app', ['setDrawer', 'toggleDrawer']),
    onClickBtn () {
      this.setDrawer(!this.$store.state.app.drawer)
    },
    logout () {
      this.$store.dispatch('logout')
    },
    onResponsiveInverted () {
      if (window.innerWidth < 991) {
        this.responsive = true
        this.responsiveInput = false
      } else {
        this.responsive = false
        this.responsiveInput = true
      }
    }
  },
    filters: {
        upperCase: function(v) {
            return v.toUpperCase();
        }
    }
}
</script>

<style scoped>
  #core-toolbar a {
    text-decoration: none;
  }
  .v-list.theme--light {
    padding: unset;
  }
  .v-menu__content.theme--light.menuable__content__active {
    border-radius: 0;
    width: 100px;
  }
  .v-list__tile__title.tile-title {
    height: 24px;
    line-height: 24px;
    position: relative;
    text-align: center;
    font-weight: lighter;
  }
  #core-toolbar {
    background-color: transparent;
    margin: unset;
  }
  .v-toolbar>>>.v-toolbar__title {
    font-size: 20px !important;
  }
</style>

<style>
  .clickable {
    cursor: pointer;
  }
</style>
