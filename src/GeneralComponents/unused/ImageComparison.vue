<template>
    
    <div>
        <p class="title">FACE COMPARISON APP</p>
        <div class="photo-compare row">

           <!-- INI ISINYA PREVIEW IMG dari object "images_in",
            DAN JUGA BUTTON UNTUK ORANG MASUKKIN FILE ke "files_in"-->
            <div class="photo-card col-md-6">
                <div class="photo-section">
                    <div class="photo">
                        <img v-bind:src="assets.placeholder_img" v-show="!assets.images_in.length">
                        <img v-bind:src="assets.base64" v-show="assets.images_in.length">                     
                    </div>
                </div>

                <!-- <img v-bind:src="this.assets.base64"> -->

                <div class="file-select">
                    <label for="file_in">add photo</label>
                    <input type="file" v-on:change="onInputChangeIn" id="file_in">
                </div>
                

            </div>

            <!-- INI ISINYA PREVIEW IMG dari object "images_in",
            DAN JUGA BUTTON UNTUK ORANG MASUKKIN FILE ke "files_in"-->
            <div class="photo-card col-md-6">
                <div class="photo-section">
                    <div class="photo">
                        <img v-bind:src="assets.placeholder_img" v-show="!assets.images_out.length">
                        <img v-bind:src="assets.images_out" v-show="assets.images_out.length" >
                    </div>
                </div>

                <div class="file-select">
                    <label for="file_out">add photo</label> 
                    <input type="file" v-on:change="onInputChangeOut" id="file_out">
                </div>

            </div>

            <b-button
                v-b-toggle.collapse-1 variant="primary"
                v-on:click="conditionals.webcam_in = !conditionals.webcam_in">
                Toggle Camera
            </b-button>

        </div>

        <div class="webcam-toggle">

            <b-collapse id="collapse-1" class="mt-2">
                <div class="row button-row">
                    <button v-on:click="sideToLeft(); selected = 1;" v-bind:class="{highlighted:selected == 1}" class="col-md-6">Left</button>
                    <button v-on:click="sideToRight(); selected = 2;" v-bind:class="{highlighted:selected == 2}" class="col-md-6">Right</button>
                </div>
                <webcam-capture v-if="conditionals.webcam_in"></webcam-capture>
            </b-collapse>

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
                <p>Upload Status: </p>
                <li v-show="response.status.length">{{ response.status }}</li>
                <p>confidence level: </p>
                <li v-show="response.conf_level.length">{{ response.conf_level }}</li>
            </div>
        </div>

        <!-- <webcam-capture></webcam-capture> -->

    </div>

</template>

<script>

// IMPORT COMPONENTS
import { bus } from '../main';
import WebcamCapture from '../GeneralComponents/OpenWebcam.vue'

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
                files_in: [],
                files_out: [],
                images_in: [],
                images_out: [],
                placeholder_img: placeholder_img,
                base64: undefined,
            },
            conditionals: {
                webcam_in: false
            },
            response: {
                status: [],
                conf_level: []
            },
            side_select: undefined,
            selected: undefined
        }
    },
    methods: {
        // KUMPULAN METHOD UNTUK UPLOAD IMAGE DARI KOMPUTER
        onInputChangeIn(e) {            
            const files = e.target.files;
            const file = files[0];

            if (!file.type.match('image.*')) {
                alert("Please insert an image file")
                return;
            }
            
            const reader = new FileReader();

            reader.onload = (e) => {
                // console.log(e)
                this.assets.images_in = e.target.result
                // console.log( this.assets.images_in)
                this.assets.files_in = this.assets.images_in.split(',')[1]
                // console.log( this.assets.files_in)
                this.assets.base64 = 'data:image/png;base64,' + this.assets.files_in   
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
                this.assets.base64 = 'data:image/png;base64,' + this.assets.files_out              
            };
            reader.readAsDataURL(file);

            // console.log(assets.images_out)
            // console.log(assets.files_out)
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

            this.response.status = "uploading, please wait"

            const photoPayload = {
                'image1' : this.assets.files_in,
                'image2' : this.assets.files_out
            }; console.log(photoPayload)

            axios.post('http://3.15.227.141:4441/Verification',
              JSON.stringify(photoPayload),
              {headers :{'Content-Type': 'application/json'}},
              {timeout: 10})
                .then((data) => {
                    console.log(data)
                    console.log(data.data.status)
                    console.log(data.data.confidence_level)
                    response.status = data.data.status
                    response.conf_level = data.data.confidence_level
               })
        
            alert("images uploaded");
        },
        sideToLeft() {
            this.side_select = "left"
        },
        sideToRight() {
            this.side_select = "right"
        }

    },
    created() {
        bus.$on('getSnapshot', (image) => {

            if (this.side_select == "left") {
                console.log("this.side_select changed")
                this.assets.images_in = image;
                this.assets.files_in = image.split(',')[1]
            }

            else if (this.side_select == "right") {
                console.log("this.side_select changed")
                this.assets.images_out = image;
                this.assets.files_out = image.split(',')[1]

                // console.log(this.assets.images_out)
                // console.log(this.assets.files_out)
            }

            else {
                alert("select which camera side you want to capture to")
            }
            
        })     
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

.file-select {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 2vh;
}   
    .file-select label {
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
    .file-select input {
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

.highlighted {
    background-color: white;
}

</style>
