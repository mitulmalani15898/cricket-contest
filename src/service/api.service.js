import axios from 'axios'

export default {
    register (userData) {
        return axios.post('auth/signup', userData);
    },

    login (userData) {
        return axios.post('auth/login', userData);
    },

    getAllTournaments (offset, limit, column, direction) {
        return axios.get('api/tournament/' + offset + '/' + limit + '/' + column + '/' + direction);
    },

    getTournamentById(id) {
        return axios.get('api/tournament/' + id);
    },

    postTournament (formData) {
        return axios.post('api/tournament', formData);
    },

    putTournament(id, formData) {
        return axios.put('api/tournament/' + id, formData);
    },

    deleteTournament(id) {
        return axios.delete('api/tournament/' + id);
    },

    getTeams (offset, limit, column, direction) {
        return axios.get('api/team/' + offset + '/' + limit + '/' + column + '/' + direction);
    },

    postTeam (formData) {
        return axios.post('api/team', formData);
    },

    putTeam(id, formData) {
        return axios.put('api/team/' + id, formData);
    },

    deleteTeam(id) {
        return axios.delete('api/team/' + id);
    },

    getAllTeams () {
        return axios.get('api/team');
    },

    getAllPlayers (offset, limit, column, direction) {
        return axios.get('api/player/' + offset + '/' + limit + '/' + column + '/' + direction);
    },

    postPlayer (formData) {
        return axios.post('api/player', formData);
    },

    putPlayer (id, formData) {
        return axios.put('api/player/' + id, formData);
    },

    deletePlayer (id) {
        return axios.delete('api/player/' + id);
    },

    getAllUsers () {
        return axios.get('api/user');
    },

    postTournamentTeam(tournamentDetails) {
        return axios.post('api/tournamentteam', tournamentDetails);
    },

    deleteTournamentTeam(tournamentId, teamId) {
        return axios.delete('api/tournamentteam/' + tournamentId + '/' + teamId + '/' + localStorage.getItem('role'));
    }
}
