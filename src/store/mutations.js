// https://vuex.vuejs.org/en/mutations.html

export default {
    authUser (state, userData) {
        state.token = userData.token
        state.userId = userData.userId
    },
    storeUser (state, user) {
        state.user = user
    },
    clearAuthData (state) {
        state.token = null
        state.userId = null
    }
}
