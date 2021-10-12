import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
import Tree from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.config.productionTip = false
Vue.use(VueQuillEditor)
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(function(config) {
    NProgress.start();
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
}, function(error) {
    return Promise.reject(error)
})

axios.interceptors.response.use(function(config) {
    NProgress.done();
    return config
}, function(error) {
    return Promise.reject(error)
})

Vue.prototype.$http = axios

Vue.component('tree-table', Tree)

Vue.filter('dateFormat', (originVal) => {
    var date = new Date(originVal * 1000);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return (Y + M + D + h + m + s);
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')