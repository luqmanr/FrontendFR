<template>

    <div>   
        <button v-on:click="sendUserGeoLocation">
            GET GEO LOCATION
        </button>
    </div>

</template>

<script>

// LIBRARY IMPORTS
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

export default {
    data() {
        return {
            geocoderAPI: "https://nominatim.openstreetmap.org/reverse?",
            userLocation: {
                "latitude": 0.0,
                "longitude": 0.0,
                "specifics": {
                    "fullAddress": "",
                    "street": "",
                    "village": "",
                    "city": "",
                    "state": "",
                    "country": ""
                }
            }
        }
    },
    methods: {
        getUserGeoLocation() {
            return new Promise((resolve, reject) => {
                const successCallback = (position) => {
                    this.userLocation.latitude = position.coords.latitude
                    this.userLocation.longitude = position.coords.longitude
                    
                    console.log("position= ", this.userLocation)
                    this.requestToGeocoderAPI()
                }

                const failedCallback = (error) => {
                    console.log(error)
                }
                navigator.geolocation.getCurrentPosition(successCallback, failedCallback)
                resolve('success')
                console.log("resolve")
            })
        },
        getGeoVer2() {

        },
        requestToGeocoderAPI() {
            console.log("method called")
            var latitude = this.userLocation.latitude
            var longitude = this.userLocation.longitude
            
            var payloadData = "lat=" + latitude + "&lon=" + longitude + "&format=json"
            var payloadURI = this.geocoderAPI + payloadData

            console.log(payloadURI)

            axios.get(payloadURI)
              .then(response => {
                  console.log(response)
                  this.userLocation.specifics.fullAddress = response.data.display_name
                  this.userLocation.specifics.street = response.data.address.road
                  this.userLocation.specifics.village = response.data.address.village
                  this.userLocation.specifics.city = ""
                  this.userLocation.specifics.state = response.data.address.state
                  this.userLocation.specifics.country = response.data.address.country
                  console.log(this.userLocation)
              })
        },
        sendUserGeoLocation() {
            this.getUserGeoLocation()
            this.$emit('getGeoLocation', this.userLocation)
        },
    }
}

</script>

<style>

</style>