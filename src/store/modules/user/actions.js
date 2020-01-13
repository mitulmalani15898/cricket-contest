import apiService from '@/service/api.service'

export default {
  getUsers ({ commit }) {
    return new Promise((resolve, reject) => {
      apiService.getAllUsers()
        .then(res => {
          commit('setUsersLength', res.data.length)
        })
        .catch(err => reject(err.response.data.error))
    })
  }
}
