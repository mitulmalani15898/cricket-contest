import apiService from '@/service/api.service'

export default {
    addTournamentTeam({dispatch}, payload) {
        let teamIds = payload.teamIds;
        teamIds.forEach(id => {
            apiService.postTournamentTeam({tournamentId: payload.tournamentId, teamId: id})
                .then(res => {
                    if (teamIds.indexOf(id) === (teamIds.length - 1)) {
                        dispatch('tournament/getTournamentById', payload.tournamentId, {root: true});
                        dispatch('tournament/getTournaments', {
                            offset: payload.offset,
                            limit: payload.limit,
                            column: payload.column,
                            direction: payload.direction,
                        }, {root: true});
                    }
                });
        });
    },
    deleteTournamentTeam({dispatch}, payload) {
        let teamIds = payload.teamIds;
        teamIds.forEach(id => {
            apiService.deleteTournamentTeam(payload.tournamentId, id)
                .then(res => {
                    if (teamIds.indexOf(id) === (teamIds.length - 1)) {
                        dispatch('tournament/getTournamentById', payload.tournamentId, {root: true});
                        dispatch('tournament/getTournaments', {
                            offset: payload.offset,
                            limit: payload.limit,
                            column: payload.column,
                            direction: payload.direction,
                        }, {root: true});
                    }
                });
        });
    }
}