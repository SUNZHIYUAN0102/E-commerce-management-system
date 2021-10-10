import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/User/Users.vue'
import Rights from '../components/Power/Rights.vue'
import Roles from '../components/Power/Roles.vue'
import Categories from '../components/Goods/Categories.vue'
import Params from '../components/Goods/Params.vue'
import List from '../components/Goods/List.vue'
import Add from '../components/Goods/Add.vue'
Vue.use(VueRouter)

const routes = [{
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home,
        children: [{
                path: '/home/welcome',
                component: Welcome
            },
            {
                path: '/home/users',
                component: Users
            },
            {
                path: '/home/rights',
                component: Rights
            },
            {
                path: '/home/roles',
                component: Roles
            },
            {
                path: '/home/categories',
                component: Categories
            },
            {
                path: '/home/params',
                component: Params
            },
            {
                path: '/home/goods',
                component: List,
            },
            {
                path: '/home/addGoods',
                component: Add,
            }, {
                path: '',
                redirect: ('/home/welcome')
            }
        ]
    }, {
        path: '/',
        redirect: '/login'
    }
]

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next()
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})

export default router