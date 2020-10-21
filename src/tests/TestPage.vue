<template>
  <div>
    <div style="color: white;">{{ livenessResponses }}</div>
    <!-- <b-overlay class="col-sm-5" no-fade :show="webcamActiveToggle" id="webcam-capture" >
      <template v-slot:overlay> -->
        <webcam-capture-card
          v-if="webcamActiveToggle"
          @capturedImage="GetCapturedImageFromWebcam"
          :captureFrameToggle="captureFrameToggle">
        </webcam-capture-card>
      <!-- </template>
    </b-overlay> -->
    <button @click="webcamActiveToggle = !webcamActiveToggle">Toggle Webcam</button>
  </div>
</template>

<script>
import WebcamCaptureCard  from '@/cards/FaceAttendanceCards/WebcamCaptureCard.vue'

// mixins import
import TransactionID    from '@/mixins/services/state/TransactionID'
import Timestamp        from '@/mixins/services/state/Timestamp'

export default {
  mixins: [
    TransactionID,
    Timestamp
  ],
  components: {
    'webcam-capture-card': WebcamCaptureCard
  },
  props: {
    livenessAPI: {
      // default: "https://riset.luqmanr.xyz/api_fr/demo/liveness-verification/v1.2"
      default: "localhost:5901"
    }
  },
  data() {
    return {
      userImage: undefined,
      pattern: ["left"],
      livenessResponses: "placeholder",
      captureFrameToggle: 0,
      webcamActiveToggle: false
    }
  },
  methods: {
    helloWorld() {
      console.log("hello world")
    },
    GetCapturedImageFromWebcam(image) {
      console.log("image received")
      this.userImage = image
    },
    CheckLiveness() {
      const payload = {
        "user_image": this.userImage,
        "pattern":    this.pattern,
        "trx_id":     this.$_TransactionID_transactionID
      }
      return this.axios.post(
        this.livenessAPI,
        JSON.stringify(payload),
        {headers :{'Content-Type': 'application/json'}}
      )
    },
    CaptureImageInterval() {  
      this.interval = setInterval(() => {
        this.CheckLiveness()
          .then(result => {
            console.log(result)
            this.livenessResponses = result.data.liveness
            this.CaptureFrameToggler()
          }).catch(error => {
            console.log(error)
            this.livenessResponses = error.data
            this.CaptureFrameToggler()
          })
      }, 1000)
    },
    CaptureFrameToggler() {
      this.captureFrameToggle += 1
    },
  },
  watch: {
    webcamActiveToggle(e) {
      if (e == true) {
        this.$_TransactionID_GenerateTransactionID()
        this.CaptureFrameToggler()
        this.CaptureImageInterval()
      } else {
        clearInterval(this.interval)
      }
    }
  },
  mounted() {
    
  },
  created() {
    
  }
}
</script>

<style scoped>
</style>
