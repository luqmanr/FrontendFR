<template>
    <div>
        <div class="button-control">
            <button v-if="this.formData.region != null" v-on:click="startVideo">Record VIDEO</button>
            <button v-if="this.vidStatus" v-on:click="stopMediaStreamTrack">Stop VIDEO</button>
            <!-- <button v-on:click="captureCanvas">Capture video</button>
            <button v-on:click="uploadImg">Upload Img</button> -->
        </div>

        <div class="row">
            <span class="col-sm-2">Mata Kuliah: </span>
            <select v-model.lazy="formData.region" class="col-sm-3">
                <option v-for="regions in regionList">{{regions}}</option>
            </select>
        </div>
        
        <div class="video-container">
            <video
                class="media-video" ref="videoDOM"
                autoplay muted>
            </video>
            <canvas 
                class="media-canvas" ref="canvasDOM">
            </canvas>
            <!-- <canvas
                class="capture-canvas" ref="captureDOM">
            </canvas> -->
        </div>

        <!-- <inferenced-notification></inferenced-notification> -->

        <div
          class="uploading-status">
            Selamat Datang: {{this.recognized_name}}
        </div>
        
        <div
          v-if="this.uploadingStatus"
          class="uploading-status">
            Uploading image, Please Wait
        </div>

        <!-- <img class="img-preview" v-bind:src="this.captures" /> -->

        <!-- <div class="row absensi-area">
            <div v-for="(person, index) in registeredJSON.reverse()" class="registered-card">
                <b-card
                    v-bind:img-src="'data:image/png;base""
                    <!-- <span>{{index}}</span> -->
                    <!-- <b-card-text>
                        Selamat Datang
                    </b-card-text> -->
                <!-- </b-card>
            </div>
        </div> -->

    </div>
</template>

<script>

// import { bus } from '../main';
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import * as faceapi from "face-api.js";
import registered from '../apiUNTAR/data.json'
import regionJSON from '../GeneralComponents/regionList.json'

// import InferencedNotification from '../BootstrapModalComponents/InferencedNotification'

Vue.use(VueAxios, axios)

export default {
    name: 'VideoMediaCanvasStream',
    components: {
        // 'inferenced-notification': InferencedNotification
    },
    data() {
        return {
            captures: [],
            videoEl: {},
            canvasEl: {},
            captureEl: {},
            canvasCtx: {},
            captureCtx: {},
            sampling: 0,
            theStream: undefined,
            facingMode: false,
            videoConstraints: {
                audio: false,
                video: {
                    width: {
                      min: 320,     ideal: 1280,    max: 1920
                    },
                    height: {
                      min: 240,     ideal: 720,     max: 1080
                    },
                    frameRate: {
                      min: 5,       ideal: 15,      max: 30
                    },
                }
            },
            timeInterval: 0,
            failCount: 0,
            vidStatus: false,
            uploadingStatus: false,
            recognized_name: [],
            formData: {
                region: null
            },
        }
    },
    methods: {
        async startVideo() {
            faceapi.loadTinyFaceDetectorModel("/models");
            this.videoEl = this.$refs.videoDOM;
            this.canvasEl = this.$refs.canvasDOM;
            // this.captureEl = this.$refs.captureDOM;
            this.canvasCtx = this.canvasEl.getContext('2d')
            // this.captureCtx = this.captureEl.getContext('2d')
            // console.log(this.canvasCtx)
            this.vidStatus = true;

            await navigator.mediaDevices
              .getUserMedia(this.videoConstraints)
                .then(this.getMediaStreamSuccess)
                .catch(this.getMediaStreamError);
            
            await this.onPlay();
        },
        async onPlay() {

            if (this.videoEl.paused || this.videoEl.ended) {
                this.timeInterval = setInterval(() => this.drawCanvas(this.videoEl, this.canvasEl, this.canvasCtx));
                return;
            }

        },
        async drawCanvas(video, canvas, context) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight
            context.drawImage(video, 0, 0, canvas.width, canvas.height)
            
            const detections = await this.getFaceDetections(video)
            // var cnt = 0
            if (detections.length) {
                // console.log(detections)
                var frame_sampling = 15
                
                this.uploadingStatus = true

                // if (this.sampling == 0) {
                //     this.captureCanvas(video, canvas)
                // }
                this.sampling += 1
                // console.log(this.sampling)
                if (this.sampling == frame_sampling) {
                    // capturectx.drawImage(video,350,50,720,1280,0,0,930,670)
                    this.captureCanvas(video, canvas)
                    this.sampling = 0
                }

                // this.drawDetections(video, canvas, context, detections)
            }
        },
        async getFaceDetections(video) {
            let detections = faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({
                scoreThreshold: 0.5,
                inputSize: 224
            }))

            detections = await detections
            return detections
        },
        drawDetections(video, canvas, context, detections) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            detections.forEach(detection => {
                const { x, y, width, height } = detection.box;

                function myLoop (i) {
                    setTimeout(function () {
                        if (x > 300 && x < 700) {
                            // console.log('Masuk Area Deteksi')                
                        }
                        if (--i) myLoop(i);
                    }, 3000)
                }

                var i = 1;
                myLoop(i);

                // DRAW DETECTION BOX
                context.strokeStyle = 'red';
                context.lineWidth = 7;
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
        },
        getMediaStreamError(error) {
            alert('Error, webcam not opened' + error);
        },
        stopMediaStreamTrack() {
            // this.videoEl.stop();
            this.vidStatus = false;
            clearInterval(this.timeInterval);
            if (typeof window.stream === "object") {
                this.videoEl.srcObject = null;
                window.stream.getTracks().forEach(track => track.stop());
            }
            return true
        },
        captureCanvas(video, canvas) {
            // this.canvasEl = this.$refs.canvasDOM;
            // var context = canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
            // var context = canvas.getContext("2d").drawImage(video,400,200,1000,1600,0,0,900,700)
            // this.captures.push(canvas.toDataURL("image/png"));
            var base64 = canvas.toDataURL("image/png")
            this.captures = base64.split(',')[1]
            // console.log(this.captures)
            this.uploadImg()
            
            // console.log(this.captures)
        },
        uploadImg() {

            const photoPayload = {
                'image' : this.captures,
                'class': this.formData.region
            };
            console.log(photoPayload)

            axios.post('http://192.168.3.6:3000/InferencingImage',
              JSON.stringify(photoPayload),
              {
                headers :{
                    'Content-Type': 'application/json'
                },
                onUploadProgress: progressEvent => this.uploadingStatus = true
              },
              {timeout: 10})
                .then((data) => {
                    this.uploadingStatus = false
                    // console.log(data)
                    // this.recognized_name = []
                    var list_of_name = data.data.face

                    if (list_of_name.length < 14) {
                        list_of_name.forEach(array => {
                            var names = array.label
                            // if (names == "unregistered")
                            if (names != this.recognized_name && names != "unregistered") {
                                alert(names)
                                this.recognized_name = names
                            }

                            if (names == "unregistered") {
                                console.log(names)
                            }
                            
                            // this.recognized_name = []
                            // this.recognized_name.push(names)
                            
                            console.log(array)
                        })
                        // console.log(list_of_name.label)
                    }
                    // console.log(list_of_name.length)
                    // console.log(list_of_name.label)

                    // console.log(data.data.status)
                    // console.log(data.data.confidence_level)
                    // response.status = data.data.status
                    // response.conf_level = data.data.confidence_level
               })
        },
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
                return base64
            })
        },
        regionList() {
            return regionJSON.regions.map((regions) => {
                return regions
            })
        }
    },
    beforeDestroy() {
        this.stopMediaStreamTrack();
    },
    created() {
        // this.startVideo();
    },
}
</script>

<style scoped>
.media {
  position: relative;
}

.button-control {
    display: inline-block;
    text-align: center;
    height: 5vh; 
    width: 100vw;
}

.uploading-status {
    background: aliceblue;
    /* text-align: center; */
    /* position: absolute; */
    padding: 1vh 1vh 1vh 1vh;
    margin: 1vh 1vh 1vh 1vh;
    /* display: block; */
    height: 5vh; 
    width: 100vw;
    font-size: 3vh;
    text-align: center;
}

.video-container {
    display: inline-block;
    text-align: center;
    height: 720px;
    width: 1024px;
    overflow: hidden;
}

.media-video {
    display: inline-block;
    text-align: center;
    text-align: center;
    margin-left: -20vh;
    /* background: black; */
    /* height: 1920px;
    width: 1080px; */
}

.media-canvas {
    display: inline-block;
    text-align: center;
    margin-left: -20vh;
    z-index: 1;
    /* height: 720px; */
    /* width: 720px; */
}

.card-body {
    padding: 1vh 1vh 1vh 1vh;
    font-size: 3vh;
}

.card-image {
    /* max-height: 25vh; */
    width: 50vw;
    overflow: hidden;
}

.recognized-names {
    display: inline-block;
    text-align: center;
    background-color: aliceblue;
    color:black;
    height: 5vh; 
    /* width: 100vw; */
    font-size: 3vh;
}
</style>
