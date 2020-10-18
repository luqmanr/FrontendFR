<template>
  <div class="app">
    <div class="row app-cards">
      <h1 class="col-sm-12">Liveness Verification Page</h1>
      <div class="col-sm-12 app-card">
        <h2>Isi Data Anda </h2>
        <p>Capture foto wajah</p>
        <image-capture @userPhoto="$_ImageCapture_ReceiveImage"></image-capture>
      </div>
      <div class="col-sm-12 app-card">
        <h2>Isi Data Anda </h2>
        <p>Capture video wajah</p>
        <face-pattern @facePattern="$_FacePattern_ReceiveFacePattern"></face-pattern>
        <video-recorder @videoRecorded="$_VideoRecorder_ReceiveVideo"></video-recorder>
      </div>
      <div class="col-sm-12 app-card">
        <h2>Cek Liveness & Verifikasi Wajah</h2>
        <liveness-results :userImage="userImage" :userVideo="userVideo" :facePattern="facePattern"></liveness-results>
      </div>
    </div>
  </div>
</template>

<script>
// component imports
import ImageCapture from '@/pages/LivenessDemoFrames/ImageCapture.vue'
import VideoRecorder from '@/pages/LivenessDemoFrames/VideoRecorder.vue'
import FacePattern from '@/pages/LivenessDemoFrames/FacePattern.vue'
import LivenessResults from '@/pages/LivenessDemoFrames/LivenessResults.vue'

export default {
  components: {
    'image-capture': ImageCapture,
    'video-recorder': VideoRecorder,
    'face-pattern': FacePattern,
    'liveness-results': LivenessResults
  },
  data() {
    return {
      userImage: undefined,
      userVideo: undefined,
      facePattern: undefined
    }
  },
  methods: {
    $_ImageCapture_ReceiveImage(image) {
      console.log("image received")
      this.userImage = image.split(',')[1]
    },
    $_VideoRecorder_ReceiveVideo(video) {
      console.log("video received")
      this.userVideo = video
    },
    $_FacePattern_ReceiveFacePattern(pattern) {
      console.log(pattern)
      this.facePattern = pattern
    }
  }
}
</script>

<style scoped>
.app {
  padding: 2em;
}
.app-card {
  background: #242E4E;
  border-radius: 3em;

  padding: 3vh 5vw;
  margin: 1em 0em 1em 0em;

  max-width: 100vw;
}
</style>