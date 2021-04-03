<template>
  <div class="app">
    <div class="row app-cards">
      <h1 class="col-sm-12">Liveness Verification Page</h1>
      <div class="col-sm-12 app-card">
        <h2>Isi Client ID dan Access Token Anda </h2>
        <p></p>
        <div class="row">
          <client-identification 
            @clientID="$_ClientIdentification_ReceiveClientID"
            @clientToken="$_ClientIdentification_ReceiveClientToken"></client-identification>
        </div>
      </div>
      <div class="col-sm-12 app-card">
        <h2>Isi Data Anda </h2>
        <p>Capture foto wajah</p>
        <div class="row">
          <div class="col-sm-6" style="color: white;">{{ livenessResponse }}</div>
          <liveness-verification  class="col-sm-12"
            @livenessResponse="$_LivenessVerification_ReceiveLivenessResponse"
            :livenessAPI="livenessAPI"
            :clientID="clientID"
            :clientToken="clientToken"></liveness-verification>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// component imports
import ClientIdentification from '@/components/LivenessDemo/ClientIdentification.vue'
import LivenessVerificationStreaming from '@/components/LivenessDemo/LivenessVerificiationStreaming.vue'

export default {
  components: {
    'client-identification': ClientIdentification,
    'liveness-verification': LivenessVerificationStreaming,
  },
  data() {
    return {
      clientID: "",
      clientToken: "",
      livenessAPI: "https://riset.luqmanr.xyz/api_liveness/v1/liveness-verification/v1.2",
      livenessResponse: ["{result: this is a placeholder, result will show up here}"],
    }
  },
  methods: {
    $_LivenessVerification_ReceiveLivenessResponse(response) {
      this.livenessResponse = response
    },
    $_ClientIdentification_ReceiveClientID(clientID) {
      this.clientID = clientID
    },
    $_ClientIdentification_ReceiveClientToken(clientToken) {
      this.clientToken = clientToken
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