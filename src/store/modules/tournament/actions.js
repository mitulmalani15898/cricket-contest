import apiService from '@/service/api.service'

export default {
  getTournaments ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      apiService.getAllTournaments(payload.offset, payload.limit, payload.column, payload.direction)
        .then(res => {
          commit('setTournamentsLength', res.data.count)
          commit('setTournaments', res.data.rows)
          resolve(res)
        })
        .catch(err => reject(err.response.data.error))
    })
  },
  postTournament ({ dispatch }, { formData, offset, limit, column, direction }) {
    return new Promise((resolve, reject) => {
      apiService.postTournament(formData)
        .then(res => {
          dispatch('getTournaments', { offset, limit, column, direction })
        })
        .catch(err => reject(err.response.data.error))
    })
  },
  putTournament ({ dispatch }, { id, formData, offset, limit, column, direction }) {
    return new Promise((resolve, reject) => {
      apiService.putTournament(id, formData)
        .then(res => {
          dispatch('getTournaments', { offset, limit, column, direction })
        })
        .catch(err => reject(err.response.data.error))
    })
  },
  deleteTournament ({ dispatch }, { id, offset, limit, column, direction }) {
    return new Promise((resolve, reject) => {
      apiService.deleteTournament(id)
        .then(res => {
          dispatch('getTournaments', { offset, limit, column, direction })
        })
        .catch(err => reject(err.response.data.error))
    })
  },
  getTournamentById ({ commit }, id) {
    return new Promise((resolve, reject) => {
      apiService.getTournamentById(id)
        .then(res => {
          commit('tournamentTeam/setTournamentTeams', res.data.Teams, { root: true })
        })
        .catch(err => reject(err))
    })
  }
}
