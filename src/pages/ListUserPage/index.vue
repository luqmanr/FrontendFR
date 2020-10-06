<template>

    <div>

        <div style="padding: 2vh 2vw 2vh 2vw; background-color:rgba(18, 18, 139, 0.466)">
            <p style="color: white;">Isi data-data berikut untuk request list User yang terdaftar</p>
        </div>

        <div class="row user-data">

            <div class="col-md-6 row">
                <span class="col-sm-12">Cluster: </span>
                <input type=text v-model="payloadData.region" class="col-sm-11">  
            </div>

            <div class="col-md-6 row">
                <span class="col-sm-12">Access Token: </span>
                <input type=text v-model="payloadData.accessToken" class="col-sm-11">  
            </div>
            
        </div>

        <div class="row user-data">
            <b-button @click="listUser" variant="primary">Submit List User</b-button>
        </div>

        <div class="row response-data" style="color:white;">
            <div>
                {{responseData.rawData}}
            </div>
        </div>

    </div>

</template>

<script>

// regionList.json isinya region2 / database tempat registrasi
import regionJSON from '@/GeneralComponents/regionList.json'

// LIBRARY IMPORTS
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

export default {
    data() {
        return {
            listUserAPI: "https://riset.luqmanr.xyz/api_fr/v2/listface",
            payloadData: {
                region: "Trial",
                accessToken: "",
                trx_id: "",
                timestamp: ""
            },
            responseData: {
                rawData: "",
                status: "",
                message: "",
                userID: [],
                userName: []
            }
        }
    },
    methods: {
        listUser() {
            const listUserPayload = {
                "trx_id": this.payloadData.trx_id,
                "client_id": this.payloadData.region,
                "access_token": this.payloadData.accessToken,
                "timestamp": this.payloadData.timestamp
            };
            console.log(listUserPayload)
            // var listUserPayload = '{"trx_id":"89274u98zjs","client_id":"Trial","access_token":"notatoken","timestamp":"0987"}' // testing

            // var apiEndPoint = 'dummy'
            var apiEndpoint = this.listUserAPI

            axios.post(apiEndpoint,
              JSON.stringify(listUserPayload),
              {headers :{'Content-Type': 'application/json'}},
              {timeout: 1000})
                .then((data) => {      
                    console.log(data.data)
                    this.responseData.rawData = data.data
                })
                .catch(error => {
                    console.log(error.data)
                    this.responseData.rawData = error.data
                })
        },
        makeTrx_id() { // generate random string, seperti ini "ck5bec23-51f5-4c6e-aca5-ebd7115a8f40" / "8s-4s-4s-4s-12s"
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            var eight = '';
            for ( var i = 0; i < 8; i++ ) {
                eight += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            var four_one = '';
            for ( var i = 0; i < 4; i++ ) {
                four_one += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            var four_two = '';
            for ( var i = 0; i < 4; i++ ) {
                four_two += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            var four_three = '';
            for ( var i = 0; i < 4; i++ ) {
                four_three += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            var twelve = '';
            for ( var i = 0; i < 12; i++ ) {
                twelve += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            var trx_id = ''.concat(eight, '-', four_one, '-', four_two, '-', four_three, '-', twelve);

            this.payloadData.trx_id = trx_id;
            console.log(this.payloadData.trx_id)
        },
        makeTimestamp() { // generate timestamp dengan format seperti ini "2020-05-13 09:43:26+0700" / "yyyy-mm-dd hh:mm:ss+tttt"
            var currentDate = new Date();
            var date = ('0' + currentDate.getDate()).slice(-2);
            var month = ('0' + (currentDate.getMonth()+1)).slice(-2); //Be careful! January is 0 not 1
            var year = currentDate.getFullYear();
            var hours = ('0' + currentDate.getHours()).slice(-2);
            var minutes = ('0' + currentDate.getMinutes()).slice(-2);
            var seconds = ('0' + currentDate.getSeconds()).slice(-2);
            var clock = hours + ":" +  minutes + ":" +  seconds;
            var timezone = '+0700'
            var dateString = year + "-" + month + "-" + date + " " + clock + timezone;

            this.payloadData.timestamp = dateString
            console.log(this.payloadData.timestamp)
        },
    },
    computed: {
        regionList() {
            return regionJSON.regions.map((regions) => {
                return regions
            })
        }
    },
    created() {
        this.makeTrx_id()
        this.makeTimestamp()
    },
}

</script>

<style scoped>
.user-data {
    color: white;
    /* background-color: dodgerblue; */
    border-radius: 20px;
    padding: 2vh 2vw 2vh 2vw;
    display: flex;
    align-items: center;
    justify-content: center;
    max-height: 100vh;
}
</style>