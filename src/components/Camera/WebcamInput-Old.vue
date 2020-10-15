<template>

    <div>

        <!-- Stream video from webcam -->
        <div class="video-wrap">
            <div class="testingcuy">
                <!-- videoDOM -->
                <video 
                    for="snapout" 
                    ref="video" 
                    playsinline autoplay class="video-image"></video>
                    
                <!-- <qrcode-stream @decode="onDecode" 
                    for="snapout" 
                    ref="video"
                    class="video-image"></qrcode-stream>  -->
            </div>
            
            <!-- HASIL WEBCAM SNAPSHOT-->
            <canvas ref="canvas" 
                    :width="videoMetaData.width" 
                    :height="videoMetaData.height"></canvas> <!-- set berapa ukuran image yang diinginkan -->
        </div>
        <div class="controller row">

            <!-- button untuk snap picture -->
            <label for="snapout" 
                   ref="snap" 
                   class='col-sm-6'>Capture</label>
            <input v-on:click="captureCanvas(); sendSnapshotToBus();" 
                   id="snapout" 
                   class='col-sm-6'
                   data-disable-touch-keyboard
                   readonly></input>
            <label for="switch-cam" 
                   ref="switch-cam" 
                   class='col-sm-6'>Switch Camera</label>
            <input v-on:click="switchCamera()" 
                   id="switch-cam" 
                   class='col-sm-6'
                   data-disable-touch-keyboard
                   readonly></input>

        </div>

    </div>
  
</template>
  
<script>

import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'
import { bus } from '@/main';

'use strict';

export default {
    components: {
        QrcodeStream
    },
    data() {
        return {
            videoObject: undefined,
            constraints : {
                audio: false,
                video: {
                    width:      { min: 320, ideal: 1280, max: 1280 },   // setting resolusi rekaman video       
                    height:     { min: 240, ideal: 720,  max: 720  },   // setting resolusi rekaman video
                    frameRate:  { min: 5,   ideal: 60,   max: 60   },   // setting fps rekaman video
                    // facingMode: { exact: 'user' }
                }
            },
            videoMetaData: {
                width: undefined,
                height: undefined
            },
            snapshot: [],
            qrString: "",
            qrScannerStatus: false,
            videoStatus: false,
        }
    },
    methods: {
        getVideo() {
            try {
                navigator.mediaDevices.getUserMedia(this.constraints)
                  .then(mediaStream => {
                      const video = document.querySelector('video')
                      video.srcObject = mediaStream
                      this.videoObject = mediaStream
                      this.videoStatus = true
                      
                      video.onloadedmetadata = (e) => {
                          video.play()
                          this.videoMetaData.width = e.srcElement.videoWidth
                          this.videoMetaData.height = e.srcElement.videoHeight
                      }

                      this.captureVideo(video)
                    })
            }
            catch(e) {
                console.error("no video")
            }
        },
        stopVideo() {
            this.videoObject.getTracks().forEach(track => track.stop())
            this.videoStatus = false
        },
        captureVideo(video) {
            const canvas = this.$refs.canvas
            const snap = this.$refs.snap
            var context = canvas.getContext('2d')
            // apply mirroring
            context.translate(canvas.width, 0)
            context.scale(-1, 1)
            // context.filter = "brightness(150%)"; // kalau mau brightness dinaikan
            // snap.addEventListener("click", function() {
            //     context.drawImage(video,0,0,320,240); // harus sesuai dengan ukuran canvasDOM
            //     }
            // )
        },
        captureCanvas() {
            const video = document.querySelector('video')
            console.log(video)
            const canvas = this.$refs.canvas
            console.log(canvas)
            var context = canvas.getContext('2d')
            context.drawImage(video,0,0,this.videoMetaData.width,this.videoMetaData.height); // harus sesuai dengan ukuran canvasDOM

            this.snapshot = canvas.toDataURL()
            // console.log(this.snapshot)
            this.qrScannerStatus = true
            console.log(this.qrScannerStatus)
        },
        onDecode(decodedString) {
            this.qrString = decodedString
            this.qrScannerStatus = true
            // setTimeout(function() {this.qrString = ''}, 1500)
        },
        switchCamera() {
            // console.log(this.constraints.video.facingMode.exact)
            if (this.constraints.video.facingMode.exact == "user") {
                this.constraints.video.facingMode.exact = "environment"
                this.stopVideo()
                this.getVideo()
            } else {
                this.constraints.video.facingMode.exact = "user"
                this.stopVideo()
                this.getVideo()
            }
        },
        sendSnapshotToBus() {
            bus.$emit('getSnapshot', this.snapshot);
        },
        receiveWebcamStatusFromBus() {
            bus.$on('setWebcamStatus', (status) => {
                this.videoStatus = status
                if (status == false) {
                    this.stopVideo()
                }
                console.log(this.videoStatus)
            })
        },
        sendDestroyCommand() {
            bus.$emit('getDestroyCommand', this.qrScannerStatus);
            console.log('sent')
        }
    },
    mounted() {
        this.getVideo()
    },
    computed: {

    },
    created() {
        this.receiveWebcamStatusFromBus()
    },
    watch: {
        qrString: function(e) {
            //do something when the data changes.
            if (e) {
                // this.qrScannerStatus = false
                setTimeout(this.captureCanvas, 2500)
                setTimeout(this.sendSnapshotToBus, 2500)
                // setTimeout(this.stopVideo, 200)
                // setTimeout(this.getVideo, 500)
                // setTimeout(function() {this.qrString = ''}, 500)
                // setTimeout(function() {this.qrScannerStatus = true}, 5000)
            }
        },
        qrScannerStatus: function(e) {
            if (e) {
                setTimeout(this.sendDestroyCommand,3000)
            }
        }
  }
}

</script>
  
<style scoped>

.container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.testingcuy {
    overflow: hidden;
}

.video-image {
    transform: rotateY(180deg);
    -webkit-transform:rotateY(180deg); /* Safari and Chrome */
    -moz-transform:rotateY(180deg); /* Firefox */
}

.controller .button {
    padding: 5px;
}

.controller input{
    /* margin-left: 150px; */
    z-index: -2;
    opacity: 0;
    position: absolute;
    /* margin-left: 0px; */
}

.controller label{
    border-radius: 4px;
    background: dodgerblue;
    color: white;
    max-width: 25vh;
    cursor: pointer;
    /* margin: auto; */
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    min-height: 3vw;
}

.video-wrap {
    height: 300px;
    width: 300px;
    overflow: hidden;
    margin: auto;
    align-items: center;
    align-self: center;
} .video-wrap video {
      z-index: 0;
      height: 300px;
      width: 400px;
      margin-left: -50px;
  } .video-wrap img {
      z-index: 0;
      height: 300px;
      /* max-width: 600px; */
      margin-left: -50px;
  }
  .video-wrap canvas {
      z-index: -1;
      height: 300px;
      width: 400px;
      margin-left: -50px;
  }

</style>
  