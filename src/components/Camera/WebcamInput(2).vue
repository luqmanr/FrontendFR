<template>

    <div>

        <canvas 
          ref="canvas" 
          :width="VideoWidth" 
          :height="VideoHeight"></canvas>

        <video 
          for="snapout"
          ref="video" 
          playsinline autoplay 
          id="webcam-video"></video>

    </div>
  
</template>
  
<script>

// mixins imports
import VideoToImage from './mixins/VideoToImage'

export default {
    mixins: [
        VideoToImage,
    ],
    props: {
        VideoWidth: {
            default: 1280
        },
        VideoHeight: {
            default: 720
        },
        CaptureImageToggle: {
            default: 0
        }
    },
    components: {
    },
    data() {
        return {
            videoObject: undefined,
            imageObject: undefined,
            constraints : {
                audio: false,
                video: {
                    width:      { min: 320, ideal: 1280, max: 1280 },   // setting resolusi rekaman video       
                    height:     { min: 240, ideal: 720,  max: 720  },   // setting resolusi rekaman video
                    frameRate:  { min: 5,   ideal: 30,   max: 60   },   // setting fps rekaman video
                    // facingMode: 'user'
                }
            },
        }
    },
    computed: {

    },
    methods: {
        StartVideo() {
            try {
                navigator.mediaDevices.getUserMedia(this.constraints)
                  .then(mediaStream => {
                    this.videoObject = document.querySelector('video')
                    this.videoObject.srcObject = mediaStream
                  })
            }
            catch(error) {
                console.error(error)
            }
        },
        StopVideo() {
            this.videoObject.srcObject.getTracks().forEach(track => {
                track.stop()
            })
        },
    },
    created() {

    },
    mounted() {
        this.StartVideo()
    },
    beforeDestroy() {
        this.StopVideo()
    },
    watch: {
        async CaptureImageToggle(e) {
            if (e) {
                await this.$_VideoToImage_CaptureVideoFrame()
                this.$_VideoToImage_EmitImageObject()
            }
        }
    },
}

</script>
  
<style scoped>
#webcam-video, #captured-frame {
    -webkit-transform: scaleX(-1);
    transform: scaleX(-1);
}

canvas {
    position: absolute;
    z-index: -500;
    visibility: hidden;
}

</style>
  