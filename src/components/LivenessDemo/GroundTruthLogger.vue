<template>
  <div>
    <div class="response-area row">

      <div class="col-md-10 row" style="padding: 0vh 3vw 0vh 3vw; margin: auto;">
        <div class="column col-md-4" style="padding: 1em;">
          <h4>GroundTruth Face Pattern / Liveness <br>(eg. <b>``up, down, right, left``</b>)</h4>
          <input type=text v-model="groundTruthData.facePattern" class="results col-sm-10 h-75">      
        </div>
        <div class="column col-md-4" style="padding: 1em;">
          <h4>GroundTruth Verification <br>(eg. <b>``same person``</b>)</h4>
          <input type=text v-model="groundTruthData.verification" class="results col-sm-10 h-75">      
        </div>
        <div class="column col-md-4" style="padding: 1em;">
          <h4>Other Notes <br>(eg. <b>``Status 404, Core Error, etc``</b>)</h4>
          <input type=text v-model="groundTruthData.errorMessage" class="results col-sm-10 h-75">      
        </div>
      </div>

    </div>

    <div class="input-area">
      <button v-if="livenessResponse != undefined" @click="LogGroundTruth" class="col-sm-12" style="text-align: center;">Log Ground Truth</button>
      <button v-if="livenessResponse == undefined"
              @click="LogGroundTruth" 
              class="col-sm-12 disabled" 
              style="text-align: center;" 
              title="Fill out all the Data above!"
              disabled>Log Ground Truth</button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    livenessResponse: {
      default: undefined
    },
    loggerAPI: {
      default: "https://riset.luqmanr.xyz/api_fr/demo/liveness-verification/logger"
    }
  },
  data() {
    return {
      groundTruthData: {
        facePattern: undefined,
        verification: undefined,
        errorMessage: undefined
      }
    }
  },
  methods: {
    LogGroundTruth() {
      const payload = {
        "confidence_level":   this.livenessResponse.confidenceLevel,
        "liveness":           this.livenessResponse.liveness,
        "verification":       this.livenessResponse.verification,
        "pattern":            this.livenessResponse.pattern,
        "eye_blink":          this.livenessResponse.eye_blink,
        "roundtrip_time":     this.livenessResponse.timeDataFrontend,
        "trx_id":             this.livenessResponse.responseTrxID,
        "gt_liveness":        this.groundTruthData.facePattern,
        "gt_verification":    this.groundTruthData.verification,
        "gt_other_notes":     this.groundTruthData.errorMessage
      }
      console.log(payload)
      
      this.axios.post(this.loggerAPI,
          JSON.stringify(payload))
        .then(response => {
          console.log(response)
        }).catch(error => {
          console.log(error)
        })
    }
  },
  watch: {
    livenessResponse(e) {
      console.log(e)
    }
  }
}
</script>
<style scoped>
.input-area {
    color: white;
    padding: 2em;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}
.response-area {
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /* padding: 2vh; */
}

.results {
    padding: 1em;
    background-color: #374369;
    border-radius: 0.5em;
    color: white;
}

div {
    font-family: Helvetica Neue Regular;
    font-weight: bold;
    text-align: left;
    color: white;
}

h4 {
    padding: 0 0.2em;
    font-size: 1em;
}

button {
    /* font */
    font-family: Helvetica Neue Bold;
    font-weight: bold;
    font-size: large;
    color: white;
    text-shadow: 2px 2px 4px #000000;
    text-align: center;

    background-color: #3D64FF;
    border: none;
    border-radius: 2em;
    padding: 2em;
    max-width: 20em;
} button:hover {
    background-color: #5a9bfd;
} button:focus {
    outline: 0 !important;
} .disabled {
    color: rgb(161, 161, 161);
    background-color: #6d6d6d;
} .disabled:hover {
    background-color: #6d6d6d;
}
</style>