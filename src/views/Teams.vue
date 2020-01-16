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
          Add Team
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
            <v-toolbar-title>Team</v-toolbar-title>
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
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex
                  xs12
                  sm12
                  md12
                >
                  <v-text-field
                    v-model="name"
                    :rules="nameRules"
                    label="Team Name"
                    required
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
              @click="updateTeam"
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
            @click="deleteTeam"
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
    <v-data-table
      :headers="headers"
      :items="teams"
      :pagination.sync="pagination"
      :total-items="totalTeams"
      :loading="isLoading"
      :rows-per-page-items="[
        5,
        10,
        25,
        { text: 'All', value: totalTeams }
      ]"
      class="elevation-1 teamTable"
    >
      <template
        slot="items"
        slot-scope="props"
      >
        <tr>
          <td class="text-xs-center">
            <img
              :src="thumbnailPath + props.item.teamLogo"
              alt=""
            >
          </td>
          <td class="text-xs-center">
            {{ props.item.teamName }}
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
export default {
  data () {
    return {
      headers: [
        { text: 'Logo', value: 'logo', align: 'center', sortable: false },
        { text: 'Team', value: 'teamName', align: 'center' },
        { text: 'Delete', value: 'actions', align: 'center', sortable: false }
      ],
      nameRules: [v => !!v || 'Team name is required'],
      valid: true,
      isLoading: false,
      pagination: {},
      dialog: false,
      modalType: 'add',
      fileError: '',
      imagePath: '',
      name: '',
      dialogDelete: false
    }
  },
  computed: {
    teams () {
      return this.$store.state.team.teams
    },
    totalTeams () {
      return +this.$store.state.team.teamsLength
    },
    thumbnailPath () {
      return this.$store.state.app.thumbnailPath
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
          .dispatch('team/getTeams', payload)
          .then(res => (this.isLoading = false))
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
      this.name = item.teamName
      if (item.teamLogo !== 'defaultTeamLogo.png') {
        this.imagePath = this.thumbnailPath + item.teamLogo
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
        formData.append('teamName', this.name)
        if (this.imageFile) {
          formData.append('teamLogo', this.imageFile)
        }
        this.$store.dispatch('team/postTeam', {
          formData: formData,
          offset: (this.pagination.page - 1) * this.pagination.rowsPerPage,
          limit: this.pagination.rowsPerPage,
          column: this.pagination.sortBy ? this.pagination.sortBy : 'id',
          direction: this.pagination.descending ? 'desc' : 'asc'
        })
        this.dialog = false
        this.imagePath = ''
        this.imageFile = ''
        this.$refs.form.reset()
      }
    },
    deleteImage () {
      this.imagePath = ''
      this.imageFile = ''
    },
    updateTeam () {
      const formData = new FormData()
      formData.append('teamName', this.name)
      this.imageFile
        ? formData.append('teamLogo', this.imageFile)
        : formData.append('teamLogo', 'defaultTeamLogo.png')
      this.$store.dispatch('team/putTeam', {
        id: this.previousValues.id,
        formData: formData,
        offset: (this.pagination.page - 1) * this.pagination.rowsPerPage,
        limit: this.pagination.rowsPerPage,
        column: this.pagination.sortBy ? this.pagination.sortBy : 'id',
        direction: this.pagination.descending ? 'desc' : 'asc'
      })
      this.dialog = false
      this.imagePath = ''
      this.imageFile = ''
      this.$refs.form.reset()
    },
    deleteClicked (id) {
      this.id = id
      this.dialogDelete = true
    },
    deleteTeam () {
      this.$store.dispatch('team/deleteTeam', {
        id: this.id,
        offset: (this.pagination.page - 1) * this.pagination.rowsPerPage,
        limit: this.pagination.rowsPerPage,
        column: this.pagination.sortBy ? this.pagination.sortBy : 'id',
        direction: this.pagination.descending ? 'desc' : 'asc'
      })
      this.dialogDelete = false
    }
  }
}
</script>

<style scoped>
.teamTable >>> thead {
  background-color: #252525;
  line-height: 4;
}
.teamTable >>> th.column.text-xs-center,
th.column.text-xs-center.sortable:hover {
  font-size: 15px;
  color: white !important;
}
.teamTable >>> .v-icon {
  color: #999999 !important;
}
.teamTable >>> .v-datatable__progress {
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
</style>
