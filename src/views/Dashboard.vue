<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-layout wrap>
      <v-flex
        md12
        sm12
        lg12
      >
        <v-parallax src="./img/cricket-dashboard.png" />
      </v-flex>
      <v-flex
        sm6
        xs12
        md6
        lg3
      >
        <material-stats-card
          color="green"
          icon="mdi-trophy-variant"
          title="Tournaments"
          :value="tournaments"
          sub-icon="mdi-trophy-variant"
          sub-text="Total Tournaments"
        />
      </v-flex>
      <v-flex
        sm6
        xs12
        md6
        lg3
      >
        <material-stats-card
          color="orange"
          icon="mdi-account-group"
          title="Teams"
          :value="teams"
          sub-icon="mdi-account-group"
          sub-text="Total Teams"
        />
      </v-flex>
      <v-flex
        sm6
        xs12
        md6
        lg3
      >
        <material-stats-card
          color="red"
          icon="mdi-run"
          title="Players"
          :value="players"
          sub-icon="mdi-run"
          sub-text="Total Players"
        />
      </v-flex>
      <v-flex
        sm6
        xs1
        md6
        lg3
      >
        <material-stats-card
          color="info"
          icon="mdi-account"
          title="Users"
          :value="users"
          sub-icon="mdi-account"
          sub-text="Total Users"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  computed: {
    tournaments () {
      return this.$store.state.tournament.tournamentsLength
        ? this.$store.state.tournament.tournamentsLength.toString()
        : '0'
    },
    teams () {
      return this.$store.state.team.teamsLength
        ? this.$store.state.team.teamsLength.toString()
        : '0'
    },
    players () {
      return this.$store.state.player.playersLength
        ? this.$store.state.player.playersLength.toString()
        : '0'
    },
    users () {
      return this.$store.state.user.usersLength
        ? this.$store.state.user.usersLength.toString()
        : '0'
    }
  }
}
</script>

<style scoped>
.container.grid-list-xl .layout .flex {
  padding: 0px 10px;
}

.v-card--material-stats.v-card:not(.v-card--material__header),
.v-card--material-chart.v-card:not(.v-card--material__header) {
  margin: -20px 5px !important;
}

.v-card >>> .v-card__text {
  height: 150px;
}

.v-card >>> .v-card__actions {
  height: 50px;
}

.v-card >>> .text-xs-right {
  margin-top: 70px;
}

.v-card >>> .v-offset {
  margin-left: 5px;
}
</style>
