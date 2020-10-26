<template>
  <div class="app">
    <div class="row app-cards">
      <h1 class="col-sm-12">Liveness Verification Page</h1>
      <div class="col-sm-12 app-card">
        <h2>Isi Data Anda </h2>
        <p>Capture foto wajah</p>
        <div class="row">
          <div class="col-sm-6" style="color: white;">{{ livenessResponse }}</div>
          <liveness-verification @livenessResponse="$_ImageCapture_ReceiveLivenessResponse" class="col-sm-12"></liveness-verification>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// component imports
import LivenessVerificationStreaming from '@/components/LivenessDemo/LivenessVerificiationStreaming.vue'

export default {
  components: {
    'liveness-verification': LivenessVerificationStreaming,
  },
  data() {
    return {
      livenessAPI: "https://riset.luqmanr.xyz/api_fr/demo/liveness-verification/v1.0",
      livenessResponse: ["{result: this is a placeholder, result will show up here}"],
    }
  },
  methods: {
    $_ImageCapture_ReceiveImage(image) {
      console.log("image received")
      this.userImage = image.split(',')[1]
    },
    $_ImageCapture_ReceiveLivenessResponse(response) {
      this.livenessResponse = response
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

p {
  font-family: Helvetica Neue Regular;
}
</style>