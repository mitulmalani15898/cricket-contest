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
          Add Player
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
                  md6
                >
                  <v-text-field
                    v-model="fname"
                    label="First Name"
                    required
                    :rules="nameRules"
                  />
                </v-flex>
                <v-flex
                  xs12
                  sm12
                  md6
                >
                  <v-text-field
                    v-model="lname"
                    label="Last Name"
                    required
                    :rules="nameRules"
                  />
                </v-flex>
                <v-flex
                  xs12
                  sm12
                  md12
                >
                  <v-menu
                    v-model="menu2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <template slot="activator">
                      <v-text-field
                        v-model="date"
                        label="Date of Birth"
                        prepend-icon="mdi-calendar"
                        :rules="dateRules"
                        readonly
                      />
                    </template>
                    <v-date-picker
                      v-model="date"
                      color="primary"
                      class="dob"
                      @input="menu2 = false"
                    />
                  </v-menu>
                </v-flex>
                <v-flex
                  xs12
                  md12
                >
                  <v-radio-group
                    v-model="gender"
                    label="Gender"
                    row
                  >
                    <v-radio
                      color="#4caf50"
                      label="Male"
                      value="1"
                    />
                    <v-radio
                      color="#4caf50"
                      label="Female"
                      value="2"
                    />
                  </v-radio-group>
                </v-flex>
                <v-flex xs12>
                  <v-textarea
                    v-model="description"
                    label="Description"
                    auto-grow
                    rows="2"
                    :rules="descriptionRules"
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
                      <div
                        class="box"
                      >
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
              color="green darken-1"
              :disabled="!valid || fileError !== ''"
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
            @click="deletePlayer"
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
      :items="players"
      :pagination.sync="pagination"
      :total-items="totalPlayers"
      :loading="isLoading"
      class="elevation-1 teamTable"
      :rows-per-page-items="[
        5,
        10,
        25,
        { text: 'All', value: totalPlayers }
      ]"
    >
      <template
        slot="items"
        slot-scope="props"
      >
        <tr>
          <td class="text-xs-center">
            <img
              :src="thumbnailPath + props.item.playerImage"
              alt=""
            >
          </td>
          <td class="text-xs-center">
            {{ props.item.firstName }} {{ props.item.lastName }}
          </td>
          <td class="text-xs-center">
            {{ getAge(props.item.dob) }}
          </td>
          <td class="text-xs-center">
            {{ props.item.gender === 1 ? "Male" : "Female" }}
          </td>
          <td class="text-xs-center">
            {{ props.item.description }}
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
        { text: 'Avatar', value: 'avatar', align: 'center', sortable: false },
        { text: 'Name', value: 'firstName', align: 'center' },
        { text: 'Age', value: 'dob', align: 'center' },
        { text: 'Gender', value: 'gender', align: 'center' },
        {
          text: 'Description',
          value: 'description',
          align: 'center',
          sortable: false
        },
        { text: 'Delete', value: 'actions', align: 'center', sortable: false }
      ],
      nameRules: [v => !!v || 'Name is required'],
      descriptionRules: [v => !!v || 'Description is required'],
      dateRules: [v => this.date !== '' || 'Date is required'],
      valid: true,
      isLoading: false,
      pagination: {},
      dialog: false,
      modalType: 'add',
      fileError: '',
      imagePath: '',
      fname: '',
      lname: '',
      description: '',
      gender: '1',
      dialogDelete: false,
      date: '',
      menu2: false
    }
  },
  computed: {
    players () {
      return this.$store.state.player.players
    },
    totalPlayers () {
      return +this.$store.state.player.playersLength
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
          .dispatch('player/getPlayers', payload)
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
      this.fname = item.firstName
      this.lname = item.lastName
      this.description = item.description
      this.date = item.dob
      this.gender = item.gender.toString()
      if (item.playerImage !== 'defaultPlayerImage.png') {
        this.imagePath = this.thumbnailPath + item.playerImage
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
        formData.append('firstName', this.fname)
        formData.append('lastName', this.lname)
        formData.append('gender', this.gender)
        formData.append('dob', this.date)
        formData.append('description', this.description)
        if (this.imageFile) {
          formData.append('playerImage', this.imageFile)
        }
        this.$store.dispatch('player/postPlayer', {
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
      formData.append('firstName', this.fname)
      formData.append('lastName', this.lname)
      formData.append('gender', this.gender)
      formData.append('dob', this.date)
      formData.append('description', this.description)
      this.imageFile
        ? formData.append('playerImage', this.imageFile)
        : formData.append('playerImage', 'defaultPlayerImage.png')
      this.$store.dispatch('player/putPlayer', {
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
    deletePlayer () {
      this.$store.dispatch('player/deletePlayer', {
        id: this.id,
        offset: (this.pagination.page - 1) * this.pagination.rowsPerPage,
        limit: this.pagination.rowsPerPage,
        column: this.pagination.sortBy ? this.pagination.sortBy : 'id',
        direction: this.pagination.descending ? 'desc' : 'asc'
      })
      this.dialogDelete = false
    },
    getAge (dob) {
      var birthdate = new Date(dob)
      var cur = new Date()
      var diff = cur - birthdate // This is the difference in milliseconds
      return Math.floor(diff / 31557600000)
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
.dob >>> .v-btn__content {
  color: black;
}
.dob >>> .v-btn.primary {
  background-color: #4caf50 !important;
  left: 10px;
  top: 5px;
  border-radius: 50%;
}
.dob >>> .v-btn--outline {
  border: none;
}
</style>
