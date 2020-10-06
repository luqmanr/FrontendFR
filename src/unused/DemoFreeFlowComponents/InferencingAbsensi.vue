<template>

    <div class="main">
        <!-- <span>Inferencing Absensi</span> -->

        <!-- <div class="top-video row justify-content-center">
            <face-detection class="col-md-6 videoDOM"></face-detection>
        </div> -->

        <div class="http-container">
            <img
                src="http://192.168.100.52:80/video2.mjpg"
                height="720"
                width="1280"
            />
            <!-- <iframe 
                class="http-cam"
                src="http://192.168.100.52:80/video2.mjpg"
                scrolling="no"
            >
            </iframe> -->
        </div>

        <div class="row absensi-area">
            <div v-for="(person, index) in registeredJSON.reverse().slice(0,5)" class="registered-card">
                <b-card
                    v-bind:img-src="'data:image/png;base64,' + person.image"
                    class="card-image">
                    <span>{{person.name}}</span>
                    <!-- <span>{{index}}</span> -->
                    <!-- <b-card-text>
                        Selamat Datang
                    </b-card-text> -->
                </b-card>
            </div>
        </div>
    </div>

        <!-- <p style="color:white;">{{ registeredJSON }}</p> -->

</template>

<script>

import { bus } from '../main';
import registered from '../apiUNTAR/data.json'

import WebcamCapture from '../dashboardComponents/OpenWebcam.vue'
import FaceDetection from '../dashboardComponents/FaceDetectionTest'

// IMAGE ASSETS
import placeholderImg from '../assets/avatar_default.png'
  
export default {
    components: {
        'webcam-capture': WebcamCapture,
        'face-detection': FaceDetection
    },
    data() {
        return {
            placeholder_img: placeholderImg
        }
    },
    computed: {
        registeredJSON() {
            return registered.data.map((person) => {
                return person
            })
        },
        imageJSON() {
            return registered.data.map((person) => {
                let base64 = 'data:image/png;base64,' + person.image
                // console.log(person.image)
                // console.log(typeof base64)
                // var image = 'data:image/png;base64,' + person.image
                // console.log(person.image)
                // // return image
                return base64
            })
        },
    },
    methods: {
        
    }
}

</script>

<style scoped>

.main {
    background-color: rgb(30,30,30);
}

.http-container img{
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 1280;
}

.http-cam {
    height: 110vh;
    /* height: 1280px; */
    width: 100%;
    align-items: center;
    transform: scale(0.65);
    margin-top: -17%;
}

.top-video {
    height: 20%;
    width: 100%;
    overflow: hidden;
    background-color: dodgerblue;
    justify-self: center;
}

.videoDOM {
    height: 50vh;
    overflow: hidden;
    top: 0;
}

.absensi-area {
    margin-left: 14%;
    margin-top: -2%;
    width:80%;
    padding: 0vh 0vh 0vh 0vh;
    justify-self: center;
}

.registered-card {
    font-size: 1.7vh;
    /* height: 35vh; */
    width: 25vh;
    justify-self: center;
    margin: 3% 1% 1% 1%;
    padding: 0vh 0vh 0vh 0vh;
    background-color: white;
}

/* .card-image {
    height: 15vh;
    /* overflow: hidden; 
    padding: 0vh 0vh 0vh 0vh;
    background-color: white;
} */

.card-body {
    padding: 1vh 1vh 1vh 1vh;
    font-size: 3vh;
}

.card-img {
    display: block;
    margin-left: auto;
    margin-right: auto;
    height: 20vh;
    /* max-width: 15vw; */
}

</style>
