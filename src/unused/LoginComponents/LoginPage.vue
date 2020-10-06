<template>
    <div class="container row" style="max-width: 1080px; margin: 0 auto; padding: 10px;">
        
        <!-- <div class="container-fluid col-md-12">

            <div></div>
            <div></div>
            
        </div> -->

        <div id="login_view" class="container-fluid col-md-12">

            <div class="row" style="margin: auto;">   

                <div class="col-sm-12 col-md-12 col-xs-12 row">
                    <span class="col-sm-12 col-md-12 col-xs-12">username: </span>
                    <input  type=email v-model.lazy="userData.userName" 
                            class="col-sm-12 col-md-12 col-xs-12">
                </div>

                <div class="col-sm-12 col-md-12 col-xs-12 row">
                    <span class="col-sm-12 col-md-12 col-xs-12">Password: </span>
                    <input  type=password v-model.lazy="userData.userPassword" 
                            class="col-sm-12 col-md-12 col-xs-12">
                </div>

                <div class='col-sm-12 col-md-12 col-xs-12 row button'>
                    <label  class="col-sm-12 col-md-12 col-xs-12"
                            for="submit-userdata">LOGIN</label>
                    <input  @click="submitLoginData()" 
                            id="submit-userdata" 
                            data-disable-touch-keyboard
                            readonly></input>
                </div>

                
            </div>

        </div>

        <!-- <div id="login_button">
            <button @click="submitLoginData()">LOGIN</button>
        </div> -->

        
    </div>
</template>

<script>

import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

import { bus } from '@/main';

export default {
    components: {

    },
    data() {
        return {
            loginEndpoint: "https://riset.luqmanr.xyz/fr_frontend_api/v1/Login",
            userData: {
                userName: "",
                userPassword: ""
            },
            receivedData: {
                loginToken: ""
            },
            testProp: false
        }
    },
    computed: {
        LoginState() {
            return this.$store.getters.getCurrentLoginState
        }
    },
    methods: {
        submitLoginData() {
            var userDataJSON = {
                "username": this.userData.userName,
                "password": this.userData.userPassword
                // "username": "luqmanr",
                // "password": "testpass"
            };
            this.$store.dispatch("setCurrentLoginState", userDataJSON)
        },
        sendLoginState() {
            bus.$emit('setLoginState', true);
        },
        goToAbsensiPage() {
            this.$router.push({path:'/absensi', query:{loginState: true}})
        }
    },
    created() {

    },
    watch: {
        LoginState(e) {
            if (e) {
                this.goToAbsensiPage()
            }
        }
    }
}

</script>

<style scoped>

#login_view {
    padding: 5vh;
    max-width: 80vw;
    color: white;
    /* background-color:aliceblue; */
    border-radius: 1vh;
    border-style: outset;
    border-color:rgb(136, 169, 231)
}

.button {
    padding: 1vh;
} .button input{
    z-index: -2;
    opacity: 0;
    position: absolute;
} .button label{
    border-radius: 4px;
    background:green;
    color: white;
    font-weight: bolder;
    max-width: 25vh;
    cursor: pointer;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    min-height: 5vw;
}

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
    max-height: 90vh;
}

</style>