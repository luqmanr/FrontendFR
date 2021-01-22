<template>
  <div class="app">
    <div class="row app-cards">
      <h1 class="col-sm-12">Liveness Verification Page</h1>
      <div class="col-sm-12 app-card">
        <h2>Isi Client ID dan Access Token Anda </h2>
        <p></p>
        <client-identification 
          @clientID="$_ClientIdentification_ReceiveClientID"
          @clientToken="$_ClientIdentification_ReceiveClientToken"></client-identification>
      </div>
      <div class="col-sm-12 app-card">
        <h2>Isi Data Anda </h2>
        <p>Capture foto wajah</p>
        <image-capture @userPhoto="$_ImageCapture_ReceiveImage"></image-capture>
      </div>
      <div class="col-sm-12 app-card">
        <h2>Isi Data Anda </h2>
        <p>Capture video wajah</p>
        <face-pattern @facePattern="$_FacePattern_ReceiveFacePattern"></face-pattern>
        <video-recorder :videoDuration="videoDuration" @videoRecorded="$_VideoRecorder_ReceiveVideo"></video-recorder>
      </div>
      <div class="col-sm-12 app-card">
        <h2>Cek Liveness & Verifikasi Wajah</h2>
        <p>Tekan tombol di bawah untuk memproses data!</p>
        <liveness-results 
          @LivenessResponse="$_LivenessResults_ReceiveLivenessResponse" 
          :userImage="userImage" 
          :userVideo="userVideo" 
          :facePattern="facePattern" 
          :clientID="clientID"
          :clientToken="clientToken"
          :livenessAPI="livenessAPI"></liveness-results>
      </div>
      <!-- <div class="col-sm-12 app-card">
        <h2>Log Data Asli (Ground Truth)</h2>
        <p>for logs and debugging purposes</p>
        <groundtruth-logger :loggerAPI="loggerAPI" :livenessResponse="livenessResponse"></groundtruth-logger>
      </div> -->
    </div>
  </div>
</template>

<script>
// component imports
import ImageCapture from '@/components/LivenessDemo/ImageCapture.vue'
import VideoRecorder from '@/components/LivenessDemo/VideoRecorder.vue'
import FacePattern from '@/components/LivenessDemo/FacePattern.vue'
import ClientIdentification from '@/components/LivenessDemo/ClientIdentification.vue'
import LivenessResults from '@/components/LivenessDemo/LivenessResults.vue'
import GroundTruthLogger from '@/components/LivenessDemo/GroundTruthLogger.vue'

export default {
  components: {
    'image-capture': ImageCapture,
    'video-recorder': VideoRecorder,
    'face-pattern': FacePattern,
    'client-identification': ClientIdentification,
    'liveness-results': LivenessResults,
    'groundtruth-logger': GroundTruthLogger
  },
  data() {
    return {
      userImage: undefined,
      userVideo: undefined,
      facePattern: undefined,
      clientID: "",
      clientToken: "",
      livenessResponse: undefined,
      videoDuration: 10000,
      livenessAPI: "https://api.riset.ai/api_fr/sandbox-liveness/liveness-verification/v1.0",
      loggerAPI: "https://api.riset.ai/api_fr/demo/groundtruth-LV/v1.0"
      // livenessAPI: "http://localhost:9999/dummy_response"
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
    },
    $_ClientIdentification_ReceiveClientID(clientID) {
      this.clientID = clientID
    },
    $_ClientIdentification_ReceiveClientToken(clientToken) {
      this.clientToken = clientToken
    },
    $_LivenessResults_ReceiveLivenessResponse(response) {
      console.log(response)
      this.livenessResponse = response
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

p {
  font-family: Helvetica Neue Regular;
}
</style>