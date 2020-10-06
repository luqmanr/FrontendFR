<template>
    <div>  

        <video
          class="media-video" ref="videoDOM"
          autoplay muted>
        </video>

        <canvas class="media-canvas" ref="canvasDOM"></canvas>

        <button v-on:click="downloadVideo">DOWNLOAD VIDEO</button>

    </div>
</template>

<script>

import { bus } from '../main';

import * as faceapi from "face-api.js";

export default {
    name: 'VideoMediaCanvasStream',
    data() {
        return {
            videoEl: {},
            canvasEl: {},
            theStream: undefined,
            recorderEl: undefined,
            recordedChunks: [],
            facingMode: false,
            videoConstraints: {
                audio: false,
                video: {
                    width: {
                      min: 320,
                      ideal: 1280,
                      max: 1920
                    },
                    height: {
                      min: 240,
                      ideal: 720,
                      max: 1080
                    },
                    frameRate: {
                      min: 15,
                      ideal: 30,
                      max: 30
                    },
                }
            },
            timeInterval: 0,
            failCount: 0
        }
    },
    methods: {
        // MULAI AMBIL MEDIASTREAM, YAITU VIDEO
        async startVideo() {
            await faceapi.loadTinyFaceDetectorModel("/models");
            this.videoEl = this.$refs.videoDOM;
            this.canvasEl = this.$refs.canvasDOM;

            await navigator.mediaDevices
              .getUserMedia(this.videoConstraints)
                .then(this.getMediaStreamSuccess)
                .catch(this.getMediaStreamError);
            
            await this.onPlay();
        },
        async onPlay() {
            const timestamp = Date.now();

            // CHECK IF VIDEO PAUSED OR ENDED
            if (this.videoEl.paused || this.videoEl.ended) {
                this.timeInterval = setInterval(() => this.onPlay());
                return;
            }

            const runTime = {
                time: Math.round(Date.now() - timestamp),
                fps: faceapi.round(1000 / (Date.now() - timestamp))
            };
        },
        getMediaStreamSuccess(stream) {
            window.stream = stream; // make stream available to browser console
            // console.log(stream)
            this.videoEl.srcObject = stream;
            this.theStream = stream;

            try {
                var recorder = new MediaRecorder(stream, {mimeType : "video/webm"});
            } catch (e) {
                console.error("Exception While creating MediaRecorder: " + e);
                return;
            }

            this.recorderEl = recorder;
            recorder.ondataavailable =
                (event) => { this.recordedChunks.push(event.data);};
            recorder.start(100);

            recorder.stop()

            // console.log(this.recordedChunks)
        },
        getMediaStreamError(error) {
            alert('Error, webcam not opened' + error);
        },
        downloadVideo() {
            // this.recordedChunks.stop();
            console.log(this.theStream.getTracks())
            this.theStream.getTracks().forEach((track) => {
                // console.log(track)
            });
            // this.theStream.getTracks().forEach(track => {
            //     track.stop();
            // });

            // var blob = new Blob(this.recordedChunks, {type: "video/webm"});
            // var url = URL.createObjectURL(blob);
            // var a = document.createElement("a");
            // document.
        }
    },
    beforeDestroy() {

    },
    created() {
        this.startVideo();
    }
}
</script>

<style scoped>
.media {
  position: relative;
}

.media-video {
    justify-self: center;
    /* max-height: 860px; */
    /* width: 200vh; */
    /* left: -25vh; */
    display: block;
    background-color: #242424;
    /* margin-left: -25vh; */
    overflow: hidden;
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
