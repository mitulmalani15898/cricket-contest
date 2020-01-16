<template>
  <v-container>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="500px"
    >
      <template slot="activator">
        <v-btn
          color="success"
          @click="modalType = 'add'"
        >
          Add Tournament
        </v-btn>
      </template>
      <v-card>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          @submit.prevent="closeAndSaveDialog"
        >
          <v-toolbar
            dark
            color="primary"
            class="dialog-toolbar"
          >
            <v-toolbar-title>Tournament</v-toolbar-title>
            <v-spacer />
            <v-toolbar-items>
              <v-btn
                icon
                dark
                @click="dialog = false"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text>
            <v-container
              grid-list-md
            >
              <v-layout wrap>
                <v-flex
                  xs12
                  sm12
                  md12
                >
                  <v-text-field
                    v-model="name"
                    :rules="nameRules"
                    label="Tournament Name"
                    required
                  />
                </v-flex>
                <v-flex xs12>
                  <v-textarea
                    v-model="description"
                    :rules="descriptionRules"
                    label="Tournament Description"
                    auto-grow
                    rows="2"
                  />
                </v-flex>
                <v-flex xs12>
                  <v-card class="fileUploadContainer">
                    <div
                      v-if="!imagePath"
                      class="text-xs-center"
                    >
                      <div>
                        <v-icon>mdi-file-upload</v-icon>
                      </div>
                      <v-btn
                        dark
                        @click="pickFile"
                      >
                        Select Image
                      </v-btn>
                      <input
                        ref="image"
                        type="file"
                        accept="image/*"
                        style="display: none"
                        @change="filePicked"
                      >
                      <div
                        v-if="fileError"
                        class="error"
                      >
                        *{{ fileError }}
                      </div>
                    </div>
                    <div
                      v-else
                      class="text-xs-center"
                    >
                      <div class="box">
                        <v-icon
                          class="icon-error"
                          @click="deleteImage"
                        >
                          mdi-close
                        </v-icon>
                        <img
                          :src="imagePath"
                          style="height: 100px; width: 100px"
                        >
                      </div>
                    </div>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              v-if="modalType === 'add'"
              :disabled="!valid || fileError !== ''"
              color="green darken-1"
              type="submit"
              flat
            >
              Save
            </v-btn>
            <v-btn
              v-if="modalType === 'update'"
              color="green darken-1"
              flat
              @click="updateTournament"
            >
              Update
            </v-btn>
            <v-btn
              color="green darken-1"
              flat
              type="button"
              @click="closeDialog"
            >
              Cancel
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogDelete"
      max-width="290"
    >
      <v-card class="text-xs-center dialog-delete">
        <v-card-text>
          Are you sure you want to delete?
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="green darken-1"
            flat="flat"
            @click="deleteTournament"
          >
            Yes
          </v-btn>
          <v-btn
            color="green darken-1"
            flat="flat"
            @click="dialogDelete = false"
          >
            No
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialogTeams"
      scrollable
      max-width="450"
    >
      <v-card>
        <v-toolbar
          dark
          color="primary"
          class="dialog-toolbar"
        >
          <v-toolbar-title>{{ previousValues.tournamentName }}</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="
                dialogTeams = false;
                selected = [];
              "
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <div v-if="teams && !teams.length">
            No teams found in {{ previousValues.tournamentName }}
          </div>
          <v-card-actions style="justify-content: flex-end">
            <v-btn
              color="blue"
              @click="addTeamDialog"
            >
              Add Teams
            </v-btn>
          </v-card-actions>
          <div v-if="teams && teams.length">
            <v-checkbox
              v-model="selectAll"
              :checked="selectAll"
              :indeterminate.sync="example"
              class="select-all"
              label="Select all"
              @change="select"
            />
            <v-card style="padding-bottom: 20px;">
              <v-list-tile
                v-for="team in teams"
                :key="team.id"
              >
                <v-list-tile-content>
                  <v-checkbox
                    :label="team.teamName"
                    :key="team.id"
                    v-model="selected"
                    :value="team.id"
                    color="success"
                  />
                </v-list-tile-content>
              </v-list-tile>
            </v-card>
            <v-btn
              v-if="selected && selected.length"
              color="red"
              style="justify-content: space-between"
              dark
              @click="deleteTeams"
            >
              Delete
              <v-icon right>
                mdi-trash-can-outline
              </v-icon>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialogAddTeams"
      scrollable
      max-width="450"
    >
      <v-card height="450">
        <v-toolbar
          dark
          color="primary"
          class="dialog-toolbar"
        >
          <v-toolbar-title>Tournament</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="dialogAddTeams = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-select
            v-model="value"
            :items="teamsToAdd"
            item-text="teamName"
            item-value="id"
            attach
            chips
            deletable-chips
            label="Select Teams"
            multiple
          />
        </v-card-text>
        <v-card-actions style="justify-content: flex-end">
          <v-btn
            color="blue"
            @click="addTeam"
          >
            Submit
          </v-btn>
          <v-btn
            color="blue"
            @click="
              dialogAddTeams = false;
              dialogTeams = true;
              value = [];
            "
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-data-table
      :headers="headers"
      :items="tournaments"
      :total-items="totalTournaments"
      :pagination.sync="pagination"
      :loading="isLoading"
      :disable-page-reset="true"
      :rows-per-page-items="[
        5,
        10,
        25,
        { text: 'All', value: totalTournaments }
      ]"
      class="elevation-1 tournamentTable"
      must-sort
    >
      <template
        slot="items"
        slot-scope="props"
      >
        <tr>
          <td class="text-xs-center">
            <img
              :src="thumbnailPath + props.item.tournamentBanner"
              alt=""
            >
          </td>
          <td class="text-xs-center">
            {{ props.item.tournamentName }}
          </td>
          <td class="text-xs-center">
            {{ props.item.tournamentDescription }}
          </td>
          <td class="text-xs-center">
            <v-btn
              color="green darken-1"
              @click.stop="showTeams(props.item)"
            >
              Teams
            </v-btn>
          </td>
          <td class="text-xs-center">
            <v-icon
              @click.stop="update(props.item)"
            >
              mdi-square-edit-outline
            </v-icon>
            <v-icon
              @click.stop="deleteClicked(props.item.id)"
            >
              mdi-trash-can-outline
            </v-icon>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import _ from 'lodash'

export default {
  data () {
    return {
      headers: [
        { text: 'Banner', value: 'banner', align: 'center', sortable: false },
        { text: 'Tournament', value: 'tournamentName', align: 'center' },
        {
          text: 'Description',
          value: 'tournamentDescription',
          align: 'center'
        },
        { text: 'Teams', value: 'teams', align: 'center', sortable: false },
        { text: 'Delete', value: 'actions', align: 'center', sortable: false }
      ],
      nameRules: [v => !!v || 'Tournament name is required'],
      descriptionRules: [v => !!v || 'Tournament description is required'],
      valid: true,
      pagination: {},
      isLoading: false,
      dialog: false,
      fileError: '',
      imagePath: '',
      name: '',
      description: '',
      id: '',
      imageFile: '',
      modalType: 'add',
      previousValues: {},
      dialogDelete: false,
      dialogTeams: false,
      dialogAddTeams: false,
      selected: [],
      teamsToAdd: [],
      selectAll: false,
      example: false,
      value: [],
      teams: []
    }
  },
  computed: {
    tournaments () {
      return this.$store.state.tournament.tournaments
    },
    totalTournaments () {
      return +this.$store.state.tournament.tournamentsLength
    },
    thumbnailPath () {
      return this.$store.state.app.thumbnailPath
    },
    allTeams () {
      return this.$store.state.team.allTeams
    },
    tournamentTeam () {
      return this.$store.state.tournamentTeam.tournamentTeams
    }
  },
  watch: {
    pagination: {
      handler () {
        this.isLoading = true
        const payload = {
          offset: (this.pagination.page - 1) * this.pagination.rowsPerPage,
          limit: this.pagination.rowsPerPage,
          column: this.pagination.sortBy ? this.pagination.sortBy : 'id',
          direction: this.pagination.descending ? 'desc' : 'asc'
        }
        this.$store
          .dispatch('tournament/getTournaments', payload)
          .then(res => (this.isLoading = false))
      },
      deep: true
    },
    selected: {
      handler (value) {
        if (this.selected && this.selected.length) {
          if (this.selected.length === this.teams.length) {
            this.example = false
            this.selectAll = true
          } else {
            this.example = true
          }
        } else {
          this.example = false
          this.selectAll = false
        }
      }
    },
    tournamentTeam: {
      handler (value) {
        this.teams = this.tournamentTeam.length
          ? this.tournamentTeam.filter(team => {
            return !team.TournamentTeam.isDelete
          })
          : []
      }
    }
  },
  created () {
    this.pagination.sortBy = 'id'
    this.pagination.descending = true
  },
  methods: {
    update (item) {
      this.previousValues = item
      this.modalType = 'update'
      this.name = item.tournamentName
      this.description = item.tournamentDescription
      if (item.tournamentBanner !== 'defaultTournament.png') {
        this.imagePath = this.thumbnailPath + item.tournamentBanner
      }
      this.dialog = true
    },
    pickFile () {
      this.fileError = ''
      this.$refs.image.click()
    },
    filePicked (event) {
      const files = event.target.files
      if (files[0]) {
        if (files[0].type.split('/')[0] === 'image') {
          const fr = new FileReader()
          fr.readAsDataURL(files[0])
          fr.addEventListener('load', () => {
            this.imagePath = fr.result
            this.imageFile = files[0]
          })
        } else {
          this.$refs.image.value = ''
          this.fileError = 'Please choose image only'
        }
      }
    },
    closeDialog () {
      this.imagePath = ''
      this.dialog = false
      this.$refs.form.reset()
    },
    closeAndSaveDialog () {
      if (this.$refs.form.validate()) {
        const formData = new FormData()
        formData.append('tournamentName', this.name)
        formData.append('tournamentDescription', this.description)
        if (this.imageFile) {
          formData.append('tournamentBanner', this.imageFile)
        }
        this.$store.dispatch('tournament/postTournament', {
          formData: formData,
          offset: (this.pagination.page - 1) * this.pagination.rowsPerPage,
          limit: this.pagination.rowsPerPage,
          column: this.pagination.sortBy ? this.pagination.sortBy : 'id',
          direction: this.pagination.descending ? 'desc' : 'asc'
        })
        this.dialog = false
      }
    },
    deleteImage () {
      this.imagePath = ''
      this.imageFile = ''
    },
    updateTournament () {
      const formData = new FormData()
      formData.append('tournamentName', this.name)
      formData.append('tournamentDescription', this.description)
      this.imageFile
        ? formData.append('tournamentBanner', this.imageFile)
        : formData.append('tournamentBanner', 'defaultTournament.png')
      this.$store.dispatch('tournament/putTournament', {
        id: this.previousValues.id,
        formData: formData,
        offset: (this.pagination.page - 1) * this.pagination.rowsPerPage,
        limit: this.pagination.rowsPerPage,
        column: this.pagination.sortBy ? this.pagination.sortBy : 'id',
        direction: this.pagination.descending ? 'desc' : 'asc'
      })
      this.dialog = false
    },
    deleteClicked (id) {
      this.id = id
      this.dialogDelete = true
    },
    deleteTournament () {
      this.$store.dispatch('tournament/deleteTournament', {
        id: this.id,
        offset: (this.pagination.page - 1) * this.pagination.rowsPerPage,
        limit: this.pagination.rowsPerPage,
        column: this.pagination.sortBy ? this.pagination.sortBy : 'id',
        direction: this.pagination.descending ? 'desc' : 'asc'
      })
      this.dialogDelete = false
    },
    showTeams (item) {
      this.$store.commit('tournamentTeam/setTournamentTeams', item.Teams)
      this.$store.dispatch('team/getAllTeams')
      this.dialogTeams = true
      this.previousValues = item
    },
    select () {
      this.selected = []
      if (this.selectAll) {
        for (const i in this.teams) {
          this.selected.push(this.teams[i].id)
        }
      }
    },
    addTeamDialog () {
      this.selected = []
      this.dialogTeams = false
      this.dialogAddTeams = true
      this.teamsToAdd = _.differenceBy(this.allTeams, this.teams, 'id')
    },
    addTeam () {
      this.$store.dispatch('tournamentTeam/addTournamentTeam', {
        tournamentId: this.previousValues.id,
        teamIds: this.value,
        offset: (this.pagination.page - 1) * this.pagination.rowsPerPage,
        limit: this.pagination.rowsPerPage,
        column: this.pagination.sortBy ? this.pagination.sortBy : 'id',
        direction: this.pagination.descending ? 'desc' : 'asc'
      })
      this.value = []
      this.dialogAddTeams = false
      this.dialogTeams = true
    },
    deleteTeams () {
      this.$store.dispatch('tournamentTeam/deleteTournamentTeam', {
        tournamentId: this.previousValues.id,
        teamIds: this.selected,
        offset: (this.pagination.page - 1) * this.pagination.rowsPerPage,
        limit: this.pagination.rowsPerPage,
        column: this.pagination.sortBy ? this.pagination.sortBy : 'id',
        direction: this.pagination.descending ? 'desc' : 'asc'
      })
      this.selected = []
    }
  }
}
</script>

<style scoped>
.v-toolbar {
  margin-bottom: 0;
}

.tournamentTable >>> thead {
  background-color: #252525;
  line-height: 4;
}

.tournamentTable >>> th.column.text-xs-center,
th.column.text-xs-center.sortable:hover {
  font-size: 15px;
  color: white !important;
}

.tournamentTable >>> .v-icon {
  color: #999999 !important;
}

.tournamentTable >>> .v-datatable__progress {
  display: contents;
}

.fileUploadContainer {
  height: 150px;
}

.text-xs-center {
  padding-top: 25px;
}

.error {
  background-color: transparent !important;
  color: red;
  font-size: 14px;
}

.box {
  position: relative;
  height: 100px;
  width: 100px;
  margin: 0 auto;
}

.icon-error {
  position: absolute;
  right: 5px;
  top: 5px;
  background: white;
  padding: 3px;
  border-radius: 100%;
  font-size: 14px;
}

.text-xs-center.dialog-delete {
  padding: 0;
  margin: 0;
}

.text-xs-center.dialog-delete >>> .v-card__actions {
  display: block;
}

.dialog-toolbar >>> .v-toolbar__content {
  margin: 0;
}

.v-toolbar .v-toolbar__content .v-toolbar__title {
  color: white;
}

.select-all >>> .accent--text {
  color: #5cb85f !important;
}

.select-all >>> i.v-icon.mdi.mdi-minus-box.theme--light {
  color: #5cb85f !important;
}
</style>
