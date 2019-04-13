// https://vuex.vuejs.org/en/actions.html

import apiService from '../service/api.service'
import router from '@/router/index.js'

export default {
    signup ({commit, dispatch}, userData) {
        return new Promise((resolve, reject) => {
            apiService.register(userData)
                .then(res => {
                    dispatch('login', {
                        email: userData.email,
                        password: userData.password
                    })
                    resolve(res)
                })
                .catch(err => reject(err.response.data.error))
        })
    },
    login ({commit}, authData) {
        return new Promise((resolve, reject) => {
            apiService.login(authData)
                .then(res => {
                    commit('authUser', {
                        token: res.data.user.token,
                        userId: res.data.user.id
                    })
                    localStorage.setItem('token', res.data.user.token)
                    localStorage.setItem('role', res.data.user.role)
                    router.replace('/dashboard')
                    resolve(res)
                })
                .catch(err => reject(err.response.data.error))
        })
    },
    logout({commit}) {
        commit('clearAuthData');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        router.replace('/signin');
    }
}
