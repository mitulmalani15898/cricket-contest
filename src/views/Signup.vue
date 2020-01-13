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
            @submit.prevent="register"
          >
            <v-container py-0>
              <v-layout wrap>
                <v-flex
                  xs12
                  md12
                  text-xs-center
                >
                  <div class="title">
                    Registration
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
                  md6
                >
                  <v-text-field
                    v-model="firstName"
                    :rules="nameRules"
                    label="First Name"
                    prepend-inner-icon="mdi-account"
                    class="success-input"
                  />
                </v-flex>
                <v-flex
                  xs12
                  md6
                >
                  <v-text-field
                    v-model="lastName"
                    :rules="nameRules"
                    label="Last Name"
                    prepend-inner-icon="mdi-account"
                    class="success-input"
                  />
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
                    type="password"
                    :rules="passwordRules"
                    label="Password"
                    prepend-inner-icon="mdi-lock"
                    class="success-input"
                  />
                </v-flex>
                <v-flex
                  xs12
                  md12
                >
                  <v-text-field
                    v-model="confirmPassword"
                    type="password"
                    :rules="confirmPasswordRules"
                    label="Confirm Password"
                    prepend-inner-icon="mdi-lock"
                    class="success-input"
                  />
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
                <v-flex
                  xs12
                  md12
                  sm4
                  text-xs-center
                >
                  <v-btn
                    class="mx-0 font-weight-light"
                    color="success"
                    :disabled="!valid"
                    type="submit"
                  >
                    Sign Up
                  </v-btn>
                </v-flex>
                <v-flex
                  xs12
                  md12
                  sm4
                  text-xs-center
                >
                  Already have an account?
                  <router-link to="/signin">
                    Login
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
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      gender: '1',
      error: '',
      nameRules: [v => !!v || 'Name is required'],
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
      ],
      confirmPasswordRules: [
        v => !!v || 'Confirm password is required',
        v => v === this.password || 'Confirm password and password must be same'
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
    register () {
      if (this.$refs.form.validate()) {
        const userData = {
          firstName: this.firstName,
          lastName: this.lastName,
          gender: this.gender,
          email: this.email,
          password: this.password
        }
        this.$store
          .dispatch('signup', userData)
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
.error {
  font: inherit;
  color: red;
  background-color: transparent !important;
  border-color: transparent !important;
  font-size: 14px;
}
.v-card .title {
  font-size: xx-large !important;
  margin-top: 15px;
  color: #aaa;
  font-weight: 400;
}
</style>
