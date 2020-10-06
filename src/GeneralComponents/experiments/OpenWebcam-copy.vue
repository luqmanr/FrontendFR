<template>

    <div>

        <!-- Stream video from webcam -->
        <div class="video-wrap">
            <div class="testingcuy">
                <!-- videoDOM -->
                <video for="snapout" ref="video" playsinline autoplay class="video-image"></video>
            </div>
            <!-- HASIL WEBCAM SNAPSHOT-->
            <canvas ref="canvas" width="720" height="720"></canvas>
        </div>

        <div class="controller row">

            <!-- button untuk snap picture -->
            <label for="snapout" 
                   ref="snap" 
                   class='col-sm-12'
                   style='max-width: 10vw;'>Capture</label>
            <input v-on:click="captureCanvas(); emitSnapshot();" 
                   id="snapout" 
                   class='col-sm-12'></input>
            <!-- button untuk stop video -->
            <label for ='stopvid'
                   class='col-sm-12'
                   style='max-width: 10vw;'>STOP VIDEO</label>
            <input v-on:click="stopVideo()" 
                   id='stopvid' 
                   class='col-sm-12'></input>

        </div>

    </div>
  
</template>
  
<script>
  
import { bus } from '../main';

'use strict';

export default {
    components: {
    },
    data() {
        return {
            videoObject: undefined,
            constraints : {
                audio: false,
                video: {
                    width: 720,
                    height: 720
                }
            },
            snapshot: [],
            image: [],
            testing_bus: "testing bus",
            // track: undefined
        }
    },
    methods: {
        getVideo() {
            try {
                navigator.mediaDevices.getUserMedia(this.constraints)
                  .then(mediaStream => {
                    //   console.log(mediaStream)
                      const video = document.querySelector('video');
                      video.srcObject = mediaStream;
                      this.videoObject = mediaStream;
                      video.onloadedmetadata = function(e) {
                          video.play();
                      };
                      this.captureVideo(video);

                    // var track = mediaStream.getTracks()[0];

                    // if (state = "true") {
                    //     stopVideo(track);
                    // }

                    //   if (video.srcObject.active) {
                    //       console.log('mediastream online')
                    //   }

                    });
            }
            catch(e) {
                console.error("no video")
            }
        },
        stopVideo() {
            this.videoObject.getTracks().forEach(track => track.stop());
        },
        captureVideo(video) {
            const canvas = this.$refs.canvas;
            const snap = this.$refs.snap;
            var context = canvas.getContext('2d');
            snap.addEventListener("click", function() {
                context.drawImage(video,0,0,720,720);
            });
        },
        captureCanvas() {
            const canvas = this.$refs.canvas;
            this.snapshot = canvas.toDataURL();

            // console.log("this.snapshot= " + this.snapshot);

            this.image = this.snapshot.split(',')[1]

            // console.log("this.image= " + this.image);
            // this.stopVideo()
        },
        emitSnapshot() {
            bus.$emit('getSnapshot', this.snapshot);
            bus.$emit('getImage', this.image);
            // console.log(this.snapshot)
        }
    },
    mounted() {
        this.getVideo()
    },
    computed: {

    }
}

</script>
  
<style scoped>

.testingcuy {
    /* padding: 5vh 4vh 4vh 4vh; */
    height: 300px;
    width: 300px;
    margin: auto;
    align-items: center;
    align-self: center;
    overflow: hidden;
    background-color: black;
    display: flex;
    flex-wrap: wrap;
    align-content: center
}

.video-image {
    /* margin-left: -200px; */
}

.controller input{
    /* margin-left: 150px; */
    z-index: -2;
    opacity: 0;
    /* margin-left: 0px; */
}

.controller label{
    border-radius: 4px;
    background: dodgerblue;
    color: white;
    width: 15vh;
    cursor: pointer;
    margin: auto;
    align-items: center;
    align-self: center;
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
  }
  .video-wrap canvas {
      z-index: -1;
      height: 300px;
      width: 400px;
      margin-left: -50px;
  }

</style>
  