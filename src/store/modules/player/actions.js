import apiService from '@/service/api.service'

export default {
    getPlayers({commit}, payload) {
        return new Promise((resolve, reject) => {
            apiService.getAllPlayers(payload.offset, payload.limit, payload.column, payload.direction)
                .then(res => {
                    commit('setPlayersLength', res.data.count);
                    commit('setPlayers', res.data.rows);
                    resolve(res);
                })
                .catch(err => reject(err.response.data.error));
        });
    },
    postPlayer({dispatch}, {formData, offset, limit, column, direction}) {
        return new Promise((resolve, reject) => {
            apiService.postPlayer(formData)
                .then(res => {
                    dispatch('getPlayers', {offset, limit, column, direction});
                })
                .catch(err => reject(err));
        });
    },
    putPlayer({dispatch}, {id, formData, offset, limit, column, direction}) {
        return new Promise((resolve, reject) => {
            apiService.putPlayer(id, formData)
                .then(res => {
                    dispatch('getPlayers', {offset, limit, column, direction});
                })
                .catch(err => reject(err));
        });
    },
    deletePlayer({dispatch}, {id, offset, limit, column, direction}) {
        return new Promise((resolve, reject) => {
            apiService.deletePlayer(id)
                .then(res => {
                    dispatch('getPlayers', {offset, limit, column, direction});
                })
                .catch(err => reject(err));
        });
    }
}