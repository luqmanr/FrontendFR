<template>
    <div>  
        <video id="vid" width="720" height="560" autoplay muted></video>
    </div>
</template>

<!-- <script defer src='./src/html/face-api.min.js'></script> -->

<script>

import { bus } from '../main';

import * as faceapi from "face-api.js";

// var faceapi = require('../html/face-api.min.js')

export default {
    // data() {

    // },
    methods: {
        async startVideoNew() {
            var constraints = {
                audio: false,
                video: {
                    width: 720,
                    height: 560
                }
            }
        
            try {
              navigator.mediaDevices.getUserMedia(constraints)
                .then(mediaStream => {
                    const video = document.querySelector('vid');
                    vid.srcObject = mediaStream;
                    vid.onloadedmetadata = function(e) {
                        vid.play();
                        console.log('video started')
                    };
                    // this.captureVideo(video);
                  });
            }
            catch(e) {
              console.error("no video")
            }
        }
    },
    mounted() {

        console.log(faceapi)

        // const faceapi_plugin = document.createElement('script');
        // faceapi_plugin.setAttribute(
        //     "src",
        //     "../html/face-api.min.js"
        // );
        // console.log( faceapi_plugin)
        // faceapi_plugin.async = true;
        // document.head.appendChild(faceapi_plugin);

        Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('../html/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('../html/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('../html/models'),
          faceapi.nets.faceExpressionNet.loadFromUri('../html/models')
        ]).then(this.startVideoNew);

        // vid.addEventListener('play', () => {
        //   const canvas = faceapi.createCanvasFromMedia(vid)
        //   document.body.append(canvas)
        //   const displaySize = { width: vid.width, height: vid.height }
        //   faceapi.matchDimensions(canvas, displaySize)
        //   setInterval(async () => {
        //     const detections = await faceapi.detectAllFaces(vid, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        //     const resizedDetections = faceapi.resizeResults(detections, displaySize)
        //     canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        //     faceapi.draw.drawDetections(canvas, resizedDetections)
        //     faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        //     faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
        //   }, 100)
        // })
    },
    created() {
        // this.startVideoNew()
    }
}
</script>

<style>

</style>
