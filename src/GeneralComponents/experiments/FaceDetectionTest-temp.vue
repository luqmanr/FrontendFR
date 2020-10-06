<template>
    <div> 

        <button v-on:click="startVideo">Record VIDEO</button>
        <button v-if="this.vidStatus" v-on:click="stopVideo">Stop VIDEO</button>
        <button v-on:click="capture">Capture video</button>

        <video
          class="media-video" ref="videoDOM"
          autoplay muted>
        </video>

        <canvas 
          class="media-canvas" ref="canvasDOM">
        </canvas>

    </div>
</template>

<script>

import { bus } from '../main';

import * as faceapi from "face-api.js";

export default {
    name: 'VideoMediaCanvasStream',
    data() {
        return {
            captures: [],
            videoEl: {},
            canvasEl: {},
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
                      min: 5,
                      ideal: 5,
                      max: 15
                    },
                }
            },
            timeInterval: 0,
            failCount: 0,
            vidStatus: false,
        }
    },
    methods: {
        // MULAI AMBIL MEDIASTREAM, YAITU VIDEO
        async startVideo() {
            // console.log('startVideo()')
            await faceapi.loadTinyFaceDetectorModel("/models");
            // console.log('TinyFaceDetector loaded')
            this.videoEl = this.$refs.videoDOM;
            this.canvasEl = this.$refs.canvasDOM;
            console.log(this.canvasEl)

            // this.captures.push(this.canvasEl.toDataURL("image/png"));

            this.vidStatus = true;

            await navigator.mediaDevices
              .getUserMedia(this.videoConstraints)
                .then(this.getMediaStreamSuccess)
                .catch(this.getMediaStreamError);
            
            await this.onPlay();
        },
        async onPlay() {
            // console.log('onPlay()')
            const timestamp = Date.now();

            // CHECK IF VIDEO PAUSED OR ENDED
            if (this.videoEl.paused || this.videoEl.ended) {
                this.timeInterval = setInterval(() => this.onPlay());
                return;
            }

            var context = this.canvasEl.getContext("2d").drawImage(this.videoEl, 0, 0, this.canvasEl.width, this.canvasEl.height);
            // console.log(context)
            // console.log(this.canvasEl)
            // break
            // console.log('face detection loading')
            // let detections = await faceapi.detectAllFaces(
            //     this.canvasEl,
            //     new faceapi.TinyFaceDetectorOptions({
            //         inputSize: 512,
            //         scoreThreshold: 0.5
            //     })
            // )

            const detections = this.getFaceDetections(this.videoEl)
            console.log(detections)
            // let detections = true

            // this.drawDetections(this.videoEl, this.canvasEL, detections);

            // detections = false

            if (detections.length) {
                console.log('detected')
                // this.failCount = 0;
                // 画布绘制人脸框
                // this.drawDetections(this.videoEl, this.canvasEL, [getFaceDetections]);
            // } 
            // else {
            //     this.failCount += 1;
            //     if (this.failCount > 20) {
            //         this.canvasEL.width = this.videoEl.videoWidth;
            //         this.canvasEL.height = this.videoEl.videoHeight;
            //         // 画布绘制
            //         const ctx = this.canvasEL.getContext("2d");
            //         const linearGradient = ctx.createLinearGradient(0, 0, 300, 0);
            //         linearGradient.addColorStop("0", "#40E0D0");
            //         linearGradient.addColorStop("0.5", "#FF8C00");
            //         linearGradient.addColorStop("1.0", "#FF0080");
            //         // 绘制信息
            //         ctx.font = "35px FZShuTi";
            //         ctx.fillStyle = linearGradient;
            //         ctx.fillText("请将进入检测区", 20, 50);
            //     }
            //     console.log(this.failCount, "检测失败");
            // }

            // console.log('GAGALNYA SEGINI= ' + this.failCount)

                const runTime = {
                    time: Math.round(Date.now() - timestamp),
                    fps: faceapi.round(1000 / (Date.now() - timestamp))
                };
            }
        },
        async getFaceDetections (canvas) {
            // console.log('getFaceDetections')
            const detections = await faceapi
            .detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions({
                scoreThreshold: 0.5,
                inputSize: 512
            }))

            // detections = await detections
            console.log(detections)
            return detections
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
        },
        getMediaStreamError(error) {
            alert('Error, webcam not opened' + error);
        },
        stopMediaStreamTrack() {
            clearInterval(this.timeInterval);
            if (typeof window.stream === "object") {
                this.videoEl.srcObject = null;
                window.stream.getTracks().forEach(track => track.stop());
            }
        },
        stopVideo() {
            this.videoEl.stop();
            this.vidStatus = false;

            clearInterval(this.timeInterval);

            // console.log(typeof window.stream)
            if (typeof window.stream === "object") {
                this.videoEl.srcObject = null;
                window.stream.getTracks().forEach(track => track.stop());
            }

            return true
        },
        capture() {
            this.canvasEl = this.$refs.canvasDOM;
            var context = this.canvasEl.getContext("2d").drawImage(this.videoEl, 0, 0, this.canvasEl.width, this.canvasEl.height);
            this.captures.push(this.canvasEl.toDataURL("image/png"));
        }
    },
    beforeDestroy() {
        this.stopMediaStreamTrack();
    },
    created() {
        // this.startVideo();
    }
}
</script>

<style scoped>
.media {
  position: relative;
}

.media-video {
    justify-self: center;
    height: 480px;
    width: 720px;
    /* position: absolute; */
    /* display: block; */
    /* background-color: #242424; */
    /* overflow: hidden; */
}

.media-canvas {
    justify-self: center;
    /* position: absolute; */
    /* display: block; */
    /* background-color: #242424; */
    /* overflow: hidden; */
    height: 480px;
    width: 720px;
}
</style>
