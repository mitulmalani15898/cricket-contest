<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-layout
      justify-center
      wrap
    >
      <v-flex
        xs12
        md4
      >
        <material-card style="margin-top: 30px">
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
            @submit.prevent="login"
          >
            <v-container py-0>
              <v-layout wrap>
                <v-flex
                  xs12
                  md12
                  text-xs-center
                  class="title"
                >
                  <div class="title">
                    Login
                  </div>
                </v-flex>
                <v-flex
                  v-if="error"
                  xs12
                  md12
                >
                  <div class="error">
                    *{{ error }}
                  </div>
                </v-flex>
                <v-flex
                  xs12
                  md12
                >
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="Email Address"
                    prepend-inner-icon="mdi-email"
                    class="success-input"
                  />
                </v-flex>
                <v-flex
                  xs12
                  md12
                >
                  <v-text-field
                    v-model="password"
                    :rules="passwordRules"
                    type="password"
                    label="Password"
                    prepend-inner-icon="mdi-lock"
                    class="success-input"
                  />
                </v-flex>
                <v-flex
                  xs12
                  md12
                  sm4
                  text-xs-center
                >
                  <v-btn
                    :disabled="!valid"
                    type="submit"
                    class="mx-0 font-weight-light"
                    color="success"
                  >
                    Sign In
                  </v-btn>
                </v-flex>
                <v-flex
                  xs12
                  md12
                  sm4
                  text-xs-center
                >
                  Don't have an account?
                  <router-link to="/signup">
                    Register
                  </router-link>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      valid: true,
      email: '',
      password: '',
      error: '',
      emailRules: [
        v => !!v || 'Email is required',
        v =>
          /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(v) ||
          'Email must be valid'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v =>
          /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{8,14}$/.test(v) ||
          'Password must contain 8 - 14 characters with a number'
      ]
    }
  },
  created () {
    if (localStorage.getItem('token')) {
      if (localStorage.getItem('role') && +localStorage.getItem('role') === 1) {
        this.$router.push('/dashboard')
      } else if (
        localStorage.getItem('role') &&
        +localStorage.getItem('role') === 2
      ) {
        this.$router.push('/userDashboard')
      }
    }
  },
  methods: {
    login () {
      if (this.$refs.form.validate()) {
        const userData = {
          email: this.email,
          password: this.password
        }
        this.$store
          .dispatch('login', userData)
          .then(res => '')
          .catch(err => (this.error = err))
      }
    }
  }
}
</script>

<style scoped>
.v-card > :first-child:not(.v-btn):not(.v-chip) {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  max-width: 100%;
}
.v-card.v-sheet.theme--light {
  box-shadow: 2px 2px 35px 2px rgba(0, 0, 0, 0.5);
}
button.mx-0.font-weight-light.v-btn.theme--light {
  width: 100%;
}
.v-card .title {
  font-size: xx-large !important;
  margin-top: 15px;
  color: #aaa;
  font-weight: 400;
}
.error {
  font: inherit;
  color: red;
  background-color: transparent !important;
  border-color: transparent !important;
  font-size: 14px;
}

:host .v-text-field__slot {
  margin-left: 7px !important;
}
</style>
