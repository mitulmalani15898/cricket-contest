<template>
    <v-app>
        <core-filter v-if="!isAuthPage"/>

        <core-toolbar v-if="!isAuthPage"/>

        <core-drawer v-if="!isAuthPage"/>

        <core-view/>
    </v-app>
</template>

<script>
    export default {
        data() {
            return {
                isAuthPage: true,
            }
        },
        watch: {
            $route(to, from) {
                if (to.path === '/signin' || to.path === '/signup') {
                    this.isAuthPage = true
                } else {
                    this.isAuthPage = false
                }
            }
        },
        created() {
            let payload = {
                offset: 0,
                limit: 5,
                column: 'id',
                direction: 'desc'
            };
            this.$store.dispatch('tournament/getTournaments', payload)
            this.$store.dispatch('team/getTeams', payload)
            this.$store.dispatch('player/getPlayers', payload)
            this.$store.dispatch('user/getUsers')
        }
    }
</script>

<style lang="scss">
    @import '@/styles/index.scss';

    /* Remove in 1.2 */
    .v-datatable thead th.column.sortable i {
        vertical-align: unset;
    }
</style>
