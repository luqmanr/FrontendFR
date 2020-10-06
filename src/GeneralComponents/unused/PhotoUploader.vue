<template>
    
    <div>
        <p class="title">FACE COMPARISON APP</p>
        <div class="photo-compare row">

           <!-- INI ISINYA PREVIEW IMG dari object "images_in",
            DAN JUGA BUTTON UNTUK ORANG MASUKKIN FILE ke "files_in"-->
            <div class="photo-card col-md-6">
                <div class="photo-section">
                    <div class="photo">
                        <img v-bind:src="placeholder_img" v-show="!assets.images_in.length">
                        <img v-bind:src="assets.images_in" v-show="assets.images_in.length"> 
                        <webcam-capture v-if="conditionals.webcam_in"></webcam-capture>
                    </div>
                </div>

                <div class="file-input">
                    <label for="file_in">add photo</label>
                    <input type="file" v-on:change="onInputChangeIn" id="file_in">
                </div>

                <!-- <div class="file-input"> -->
                    <!-- <label for="webcam_in">capture webcam</label> -->
                    <button v-on:click="conditionals.webcam_in = true">capture webcam</button>
                <!-- </div> -->
            </div>

            <!-- INI ISINYA PREVIEW IMG dari object "images_in",
            DAN JUGA BUTTON UNTUK ORANG MASUKKIN FILE ke "files_in"-->
            <div class="photo-card col-md-6">
                <div class="photo-section">
                    <div class="photo">
                        <img v-bind:src="placeholder_img" v-show="!assets.images_out.length">
                        <img v-bind:src="assets.images_out" v-show="assets.images_out.length" >
                    </div>
                </div>

                <div class="file-input">
                    <label for="file_out">add photo</label> 
                    <input type="file" v-on:change="onInputChangeOut" id="file_out">
                </div>
            </div>
        </div>



        <!-- INI ISINYA BUTTON UNTUK ORANG MENGUPLOAD
        ANTARA
        "files_in" & "files_out",
                atau
        "images_in" & "images_out" -->
        <div class="upload-section">
            <button v-on:click="uploadImg">UPLOAD</button>
        </div>

        <!-- INI ISINYA RESPONSE JSON DARI SERVER
        YAITU "response" & "conf_level" -->
        <div class="response-area">
            <div class="column">
                <li v-show="response.length">Upload Status: {{ response }}</li>
                <li v-show="conf_level.length">confidence level: {{conf_level}}</li>
            </div>
        </div>

    </div>

</template>

<script>

// IMPORT COMPONENTS
import { bus } from '../main';
import WebcamCapture from './OpenWebcam'

// LIBRARY IMPORTS
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

// IMAGE ASSETS
import placeholder_img from '../assets/avatar_default.png'


Vue.use(VueAxios, axios)

export default {
    components: {
        'webcam-capture': WebcamCapture
    },
    data() {
        return {
            assets: {
                test: "asdasdas",
                files_in: [],
                files_out: [],
                images_in: [],
                images_out: []
            },
            conditionals: {
                webcam_in: false
            },
            test: "",
            placeholder_img: placeholder_img,
            response: [],
            conf_level: []
        }
    },
    methods: {
        onInputChangeIn(e) {
            
            console.log("e= " + e)
            
            const files = e.target.files;

            console.log("files= " + files)

            const file = files[0];

            console.log("file= " + file)

            if (!file.type.match('image.*')) {
                alert("Please insert an image file")
                return;
            }
            
            const reader = new FileReader();

            reader.onload = (e) => {

                console.log("e= " + e)

                this.assets.images_in = e.target.result

                console.log("this.assets.images_in= " + this.assets.images_in)

                this.assets.files_in = this.assets.images_in.split(',')[1]

                console.log("this.assets.files_in= " + this.assets.files_in)
            };
            reader.readAsDataURL(file);
        },
        onInputChangeOut(e) {
            const files = e.target.files;
            const file = files[0];

            if (!file.type.match('image.*')) {
                alert("Please insert an image file")
                return;
            }
            
            const reader = new FileReader();

            reader.onload = (e) => {
                this.assets.images_out = e.target.result
                this.assets.files_out = this.assets.images_out.split(',')[1]                
            };
            reader.readAsDataURL(file);
        },
        uploadImg() {
            if (!this.assets.images_in.length) {
                alert("Please Insert Two Images");
                return;
            } 
            else if (!this.assets.images_out.length) {
                alert("Please Insert Two Images");
                return;
            }

            const photoPayload = {
                'image1' : this.assets.files_in,
                'image2' : this.assets.files_out
            };

            console.log(photoPayload);

            axios.post('http://3.15.227.141:4441/Verification',
              JSON.stringify(photoPayload),
              {headers :{'Content-Type': 'application/json'}})
              
              .then((data) => {
                    console.log(data)
                    console.log(data.data.status)
                    console.log(data.data.confidence_level)
                    this.response = data.data.status
                    this.conf_level = data.data.confidence_level
               })
        
            alert("images uploaded");
        }
    }
}        

</script>

<style scoped>

.title {
    font-size: 5vh;
}

.photo-compare {
    background-color: dodgerblue;
    border-radius: 20px;
    padding: 2vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.photo-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.photo {
    width:200px;
    height: 200px;
    overflow: hidden;
    border-radius: 10px;
    display: flex;
    align-content: center;
    align-items: center;
    align-self: center;
    box-shadow: 2px 5px 25px black;
}
    .photo img {
        max-height: 200px;
        max-width: 200px;
    }

.file-input {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 2vh;
}   
    .file-input label {
        border-radius: 4px;
        background: white;
        color: indianred;
        width: 15vh;
        position:relative;
        align-items: center;
        cursor: pointer;
        justify-content: center;
        align-content: center;
    }
    .file-input input {
        opacity: 0;
        z-index: -2;
    }

.upload-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2vh;
}

.response-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2vh;
}

</style>
