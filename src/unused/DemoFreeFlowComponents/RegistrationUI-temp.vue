<template>
    <div class="app">
        <h5 v-if='this.formData.name == "" || this.formData.region == ""'
            style="margin-left: 2vh;">
            Isi NAMA dan MATA KULIAH</h5>
        
        <h5 v-if='this.formData.name && this.formData.region'
            style="margin-left: 2vh;">
            Tekan tombol "Record VIDEO"</h5>
        
        <button
            v-if="this.uploadStatus"
            v-on:click="newRegister"
            style="align-self: right;">
                New Register</button> 

        <div class="form-input">
            <div class="row">
                <span class="col-sm-2">Nama: </span>
                <input type=text v-model.lazy="formData.name" class="col-sm-3">           
            </div>
            
            <div class="row">
                <span class="col-sm-2">Mata Kuliah: </span>
                <select v-model.lazy="formData.region" class="col-sm-3">
                    <option v-for="regions in regionList">{{regions}}</option>
                </select>
            </div>
            <!-- {{uploadStatus}}
            {{formData}} -->
        </div>

        <!-- <img src="this.registrationGif"> -->
        

        <div class="registration-app row">
            <div class="video-app">

                <div class="video-container">
                    <video class="media-video"
                           ref="videoDOM"
                           autoplay>
                    </video>
                    <div id="myBar"
                         class="w3-container w3-green"
                         ref="progressBar"
                         style="height:24px;
                                width:1%;
                                background-color:dodgerblue"></div>
                </div>

                <button v-if="!this.vidStatus && this.formData.name && this.formData.region" v-on:click="startVideo">Record VIDEO</button>
                <button v-if='this.formData.name == "" || this.formData.region == ""' title="Isi NAMA dan MATA KULIAH terlebih dahulu" disabled>Record VIDEO</button>
                <button v-if="this.vidStatus" v-on:click="stopVideo">Stop VIDEO</button>
                <button v-if="this.videoBase64.length > 0" v-on:click="uploadVid">Upload VIDEO</button>

            </div>

            <div class="column"
                 style="padding: 3vh 0vh 0vh 5vh;
                        color: rgb(50,170,240);">
                <h5>Instruksi Registrasi</h5>
                <video src="../assets/registration-intructions/registration-instruction.mp4"
                    style="height: 256px; width: 256px;"
                    autoplay
                    loop></video>
            </div>
            
        </div>
        



    </div>
</template>

<script>

import { bus } from '../main';
import regionJSON from './regionList.json'

// LIBRARY IMPORTS
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

// IMAGE IMPORTS
import RegistrationVid from '../assets/registration-intructions/registration-instruction.mp4'
import * as faceapi from "face-api.js";

export default {
    name: 'VideoMediaCanvasStream',
    data() {
        return {
            videoEl: {},
            canvasEl: {},
            theStream: undefined,
            recorderEl: undefined,
            videoBase64: [],
            videoConstraints: {
                audio: false,
                video: {
                    width: {
                      min: 320, ideal: 1920, max: 1920
                    },
                    height: {
                      min: 240, ideal: 1080, max: 1080
                    },
                    frameRate: {
                      min: 15, ideal: 60, max: 60
                    },
                }
            },
            timeInterval: 0,
            vidStatus: false,
            formData: {
                name: "",
                region: ""
            },
            uploadStatus: false,
            registrationVid: RegistrationVid
        }
    },
    methods: {
        // MULAI AMBIL MEDIASTREAM, YAITU VIDEO
        async startVideo() {
            this.videoEl = this.$refs.videoDOM;
            this.canvasEl = this.$refs.canvasDOM;
            this.vidStatus = true;

            await faceapi.loadTinyFaceDetectorModel("/models");

            await navigator.mediaDevices
              .getUserMedia(this.videoConstraints)
                .then(this.getMediaStreamSuccess)
                .catch(this.getMediaStreamError);

            await this.onPlay();

        },
        async onPlay() {
            console.log('onPlay()')
            const timestamp = Date.now();

            // CHECK IF VIDEO PAUSED OR ENDED
            if (this.videoEl.paused || this.videoEl.ended) {
                this.timeInterval = setInterval(() => this.onPlay());
                return;
            }
            console.log('faceapi loading...')

            const allFacesDetection = await faceapi.detectAllFaces(
                this.videoEl,
                new faceapi.TinyFaceDetectorOptions({
                    inputSize: 256,
                    scoreThreshold: 0.5
                })
            );

            const singleFaceDetection = await faceapi.detectSingleFace(
                this.videoEl,
                new faceapi.TinyFaceDetectorOptions({
                    inputSize: 224,
                    scoreThreshold: 0.5
                })
            );
            console.log('singleFaceDetection()')

            // console.log(singleFaceDetection)
            // console.log(allFacesDetection)

            if (singleFaceDetection) {
                console.log('face detected')
                this.failCount = 0;

                this.canvasEl.width = this.videoEl.videoWidth;
                this.canvasEl.height = this.videoEl.videoHeight;
                
                faceapi.draw.drawDetections(this.canvasEl, allFacesDetection)

                allFacesDetection.forEach(faces => {
                    // console.log(faces)
                    this.drawDetections(this.videoEl, this.canvasEl, [faces]);
                })

                this.drawDetections(this.videoEl, this.canvasEl, [allFacesDetection[0]]);
            }
              else {
                console.log('failed')
                this.failCount += 1;
                if (this.failCount > 20) {
                    this.canvasEl.width = this.videoEl.videoWidth;
                    this.canvasEl.height = this.videoEl.videoHeight;
                
                const context = this.canvasEl.getContext('2d');

                // context.font = '35px FZShuTi';
                context.fillText('Tolong Masuk Area Deteksi',20,50);
                }
              }

            // console.log('GAGALNYA SEGINI= ' + this.failCount)

            const runTime = {
                time: Math.round(Date.now() - timestamp),
                fps: faceapi.round(1000 / (Date.now() - timestamp))
            };
        },
        drawDetections(dimensions, canvas, detections) {
            console.log('drawDetections()')
            canvas.width = dimensions.videoWidth;
            canvas.height = dimensions.videoHeight;

            detections.forEach(detection => 
                {
                // console.log(detection)

                const { x, y, width, height } = detection.box;
                const context = canvas.getContext('2d');

                // console.log('x= '+ x)
                // console.log('y= '+ y)

                function myLoop (i) {
                    setTimeout(function () {
                        if (x > 300 && x < 700) {
                            console.log('Masuk Area Deteksi')                
                        }
                        if (--i) myLoop(i);
                    }, 3000)
                }

                var i = 1;
                myLoop(i);

                // DRAW DETECTION BOX
                context.strokeStyle = 'red';
                context.lineWidth = 14;
                context.strokeRect(x, y, width, height);

                // TULIS STATUS DETECTION
                context.font = '35px FZShuTi';
                context.fillStyle = '#ff00ff';
                context.fillText('FACE DETECTED',x,y);
                }
            )
        },
        getMediaStreamSuccess(stream) {
            window.stream = stream; // make stream available to browser console
            this.videoEl.srcObject = stream;
            this.theStream = stream;

            try {
                var recorder = new MediaRecorder(stream, {mimeType : "video/webm"});
                this.recorderEl = recorder;
            } catch (error) {
                console.error("Exception While creating MediaRecorder: " + error );
                return;
            }

            recorder.ondataavailable = (event) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    console.log(event)
                    this.videoBase64.push(event.target.result.split(',')[1])
                }
                reader.readAsDataURL(event.data)
                // console.log(this.videoBase64)
            };

            recorder.onstop = (event) => {
                var blobs = new Blob(this.videoBase64)

                stream.getTracks().forEach(track => track.stop())
                this.vidStatus = false;

                // console.log(this.videoBase64)
            };

            recorder.start();
            this.progressBar()

            setTimeout(this.stopVideo, 10000)
        },

        getMediaStreamError(error) {
            alert('Gagal buka webcam ' + error);
        },

        stopVideo() {
            this.recorderEl.stop();
            this.vidStatus = false;

            var barEl = this.$refs.progressBar;
            barEl.style.width = 100 + '%'

            clearInterval(this.timeInterval);

            // console.log(typeof window.stream)
            if (typeof window.stream === "object") {
                this.videoEl.srcObject = null;
                window.stream.getTracks().forEach(track => track.stop());
            }

            return true
        },

        download(blob) {
            let a = document.createElement('a');
            // console.log(blob)
            a.href = URL.createObjectURL(blob);

            a.download = 'recorded.webm';
            document.body.appendChild(a);
            a.click();
        },

        uploadVid() {
            const videoPayload = {
                "name": this.formData.name,
                "course": this.formData.region,
                "video": this.videoBase64[0]
            };
            console.log(this.videoBase64    )

            var apiEndPoint = 'http://localhost:1250';
            
            axios.post(apiEndPoint,
              JSON.stringify(videoPayload),
              {headers: {'Content-Type': 'application/json'}},
              {timeout: 10})
                .then((data) => {
                    var dataStatus = data.data.status
                    var status = data.status
                    var statusText = data.statusText

                    if (status == 200) {
                        this.uploadStatus == true
                        alert("Video upload successful")
                        location.reload();
                    }
                    else {
                        alert("Failed to upload, try again")
                    }

                    // this.uploadStatus = status
                    // console.log(status)
                })
        },
        progressBar() {
            var barEl = this.$refs.progressBar;
            var id = setInterval(frame, 100);
            var width = 1;
            function frame() {
                if (width >= 100) {
                    clearInterval(id);
                } 

                // else if (this.stopVideo()) {
                //     clearInterval(id);
                // }
                else {
                    width++;
                    barEl.style.width = width + '%';
                }
            }
        },
        newRegister() {
            // this.videoBase64 == null;
            // this.formData.name == null;
            // this.formData.region == null;
            location.reload();
        }
    },
    computed: {
        regionList() {
            return regionJSON.regions.map((regions) => {
                return regions
            })
        }
    },
    beforeDestroy() {
        this.stopVideo();
    },
    created() {
        
    },
    mounted() {
 
    }
}
</script>

<style scoped>

h5 {
    padding: 0vh 0vh 0vh 0vh;
    margin: 0vh 0vh 0vh 0vh;
}

.app {
    padding: 1% 2% 2% 2%;
    background-color: white;
}

.form-input {
    padding: 1% 1% 1% 1%;
    font-size: 90%;
}

.media {
    position: relative;
}

.video-app {
    margin-left: 4vh;
}

.video-container {
    width: 720px;
    height: 380px;
    overflow: hidden;
    background-color: black;
    display:block
}

.media-video {
    justify-self: center;
    width: 720px;
    height: 360px;
    /* overflow: hidden; */
    /* max-height: 860px; */
    /* width: 200vh; */
    /* left: -25vh; */
    /* display: block; */
    background-color: #242424;
    /* margin-left: -25vh; */
}

.media-canvas {
    justify-self: center;
    position: absolute;
    /* left: -25vh; */
    top: 0;
    /* margin-left: -25vh; */
    overflow: hidden;
}
</style>
