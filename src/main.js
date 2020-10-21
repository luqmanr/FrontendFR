import Vue from 'vue'
import App from './App.vue'

// router and vuex store imports
import router from './router'
import store from './store'

// 3rd party library imports
import axios from 'axios'
import VueAxios from 'vue-axios'
import BootstrapVue from 'bootstrap-vue'
import { ToastPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueCarousel from 'vue-carousel'
import PortalVue from 'portal-vue'
import VueQrcodeReader from "vue-qrcode-reader"

// initialize 3rd party libraries
Vue.use(VueAxios, axios)
Vue.use(BootstrapVue)
Vue.use(ToastPlugin)
Vue.use(VueCarousel)
Vue.use(PortalVue)
Vue.use(VueQrcodeReader)

export const bus = new Vue()

new Vue({
    el: '#app',
    render: h => h(App),
    router,
    store,
    created () {
        if (sessionStorage.redirect) {
            const redirect = sessionStorage.redirect
            delete sessionStorage.redirect
            this.$router.push(redirect)
        }
    }
})
