/**
 * Define all of your application routes here
 * for more information on routes, see the
 * official documentation https://router.vuejs.org/en/
 */
export default [
    {
        path: '/dashboard',
        // Relative to /src/views
        view: 'Dashboard',
        meta: {
            requiresAuth: true,
            is_admin: true,
            is_user: false
        }
    },
    {
        path: '/signup',
        view: 'Signup',
    },
    {
        path: '/signin',
        view: 'Signin',
    },
    {
        path: '/tournament',
        name: 'Tournament',
        view: 'Tournaments',
        meta: {
            requiresAuth: true,
            is_admin: true,
            is_user: false,
        }
    },
    {
        path: '/user-profile',
        name: 'User Profile',
        view: 'UserProfile',
        meta: {
            requiresAuth: true,
            is_admin: true,
            is_user: false,
        }
    },
    {
        path: '/userDashboard',
        name: 'User Dashboard',
        view: 'UserProfile',
        meta: {
            requiresAuth: true,
            is_admin: false,
            is_user: true,
        }
    },
    {
        path: '/team',
        name: 'Teams',
        view: 'Teams',
        meta: {
            requiresAuth: true,
            is_admin: true,
            is_user: false
        }
    },
    {
        path: '/player',
        view: 'Players',
        meta: {
            requiresAuth: true,
            is_admin: true,
            is_user: false
        }
    },
    {
        path: '/icons',
        view: 'Icons',
        meta: {
            requiresAuth: true,
            is_admin: true,
            is_user: false
        }
    },
    {
        path: '/maps',
        view: 'Maps',
        meta: {
            requiresAuth: true,
            is_admin: true,
            is_user: false
        }
    },
    {
        path: '/notifications',
        view: 'Notifications',
        meta: {
            requiresAuth: true,
            is_admin: true,
            is_user: false
        }
    },
    {
        path: '/upgrade',
        name: 'Upgrade to PRO',
        view: 'Upgrade',
        meta: {
            requiresAuth: true,
            is_admin: true,
            is_user: false
        }
    }
]
