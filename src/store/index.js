import Vue from "vue"
import Vuex from "vuex"
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(Vuex)
Vue.use(VueAxios, axios)

const loginURL = "https://riset.luqmanr.xyz/fr_frontend_api/v1/Login"
const headers = { Accept: "application/json" }

export default new Vuex.Store({
    state: {
        loginState: false
    },
    mutations: {  // syncronous functions
                  // usage = this.$store.getters.functionName()
        setCurrentLoginState(state, payload) {
            state.loginState = payload
        }

    },
    actions: {    // asyncronous functions
                  // this.$store.dispatch("functionName", parameter)
        async setCurrentLoginState(state, payload) {
            if (process.env.NODE_ENV == 'development') {
                state.commit("setCurrentLoginState", true)
            } else if (payload.username == "luqmanr" && payload.password == "testpass") {
                state.commit("setCurrentLoginState", true)
            } else {
                console.log("LOGIN FAILED")
            }
        }
    },
    modules: {},
    getters: {    // get state _↑
        getCurrentLoginState(state) {
            return state.loginState
        }
    }
})