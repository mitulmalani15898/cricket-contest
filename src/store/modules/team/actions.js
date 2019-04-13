import apiService from '@/service/api.service'

export default {
    getTeams({commit}, payload) {
        return new Promise((resolve, reject) => {
            apiService.getTeams(payload.offset, payload.limit, payload.column, payload.direction)
                .then(res => {
                    commit('setTeamsLength', res.data.count);
                    commit('setTeams', res.data.rows);
                    resolve(res);
                })
                .catch(err => reject(err.response.data.error))
        })
    },
    getAllTeams({commit}) {
        return new Promise((resolve, reject) => {
            apiService.getAllTeams()
                .then(res => {
                    commit('setAllTeams', res.data.rows);
                    resolve(res);
                })
                .catch(err => reject(err.response.data.error))
        })
    },
    postTeam({dispatch}, {formData, offset, limit, column, direction}) {
        return new Promise((resolve, reject) => {
            apiService.postTeam(formData)
                .then(res => {
                    this.payload = { offset, limit, column, direction };
                    dispatch('getTeams', this.payload)
                })
                .catch(err => reject(err.response.data.error))
        })
    },
    putTeam({dispatch}, {id, formData, offset, limit, column, direction}) {
        return new Promise((resolve, reject) => {
            apiService.putTeam(id, formData)
                .then(res => {
                    this.payload = { offset, limit, column, direction };
                    dispatch('getTeams', this.payload)
                })
                .catch(err => reject(err.response.data.error))
        })
    },
    deleteTeam({dispatch}, {id, offset, limit, column, direction}) {
        return new Promise((resolve, reject) => {
            apiService.deleteTeam(id)
                .then(res => {
                    this.payload = { offset, limit, column, direction };
                    dispatch('getTeams', this.payload)
                })
                .catch(err => reject(err.response.data.error))
        })
    },
}