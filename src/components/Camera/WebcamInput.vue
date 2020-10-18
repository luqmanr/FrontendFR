<template>

    <div class='app'>

        <canvas 
          ref="canvas" 
          :width="VideoWidth" 
          :height="VideoHeight"></canvas>

        <video 
          for="snapout"
          ref="video" 
          playsinline autoplay 
          id="webcam-video"
          :class="ChangeCameraToggle"></video>

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
            default: 1280
        },
        CaptureImageToggle: {
            default: 0
        },
        ChangeCameraToggle: {
            default: 'user'
        },
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
                    width:      { min: 320, ideal: 1280, max: 1920 },   // setting resolusi rekaman video       
                    height:     { min: 240, ideal: 720,  max: 1920  },   // setting resolusi rekaman video
                    frameRate:  { min: 5,   ideal: 30,   max: 60   },   // setting fps rekaman video
                    facingMode: undefined
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
                    this.VideoHeight = mediaStream.getVideoTracks()[0].getSettings().height
                    this.VideoWidth = mediaStream.getVideoTracks()[0].getSettings().width
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
        this.constraints.video.facingMode = this.ChangeCameraToggle
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
        },
        async ChangeCameraToggle(facingMode) {
            if (facingMode) {
                console.log(facingMode)
                this.constraints.video.facingMode = facingMode
            }
        }
    },
}

</script>
  
<style scoped>
.user {
    -webkit-transform: scaleX(-0.5);
    transform: scaleX(-1);
}

video {
    /* -webkit-transform: scaleX(0.2); */
    /* transform: scaleX(0.2); */
    /* max-height: 60vh;
    max-width: 60vw; */
}

canvas {
    position: absolute;
    z-index: -500;
    visibility: hidden;
}

</style>
  