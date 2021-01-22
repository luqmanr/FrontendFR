<template>
    <div class="row">

        <div class="col-sm-12 app-card">
            <face-pattern @facePattern="$_FacePattern_ReceiveFacePattern"></face-pattern>
        </div>

        <b-overlay class="col-sm-5" no-fade :show="webcamActiveToggle" opacity="0.0" id="webcam-capture">
            <div id="photo-processing"
                style="min-height:20em;"></div>
            <template v-slot:overlay>
                <webcam-capture-card
                    @capturedImage="GetCapturedImageFromWebcam"
                    :captureFrameToggle="captureFrameToggle"
                    :changeCameraToggle="changeCameraToggle">
                </webcam-capture-card>
            </template>
        </b-overlay>
        <div class="row col-sm-7" style="padding: 1em 0; height: 50vh;">
            <div style="height: 1em;" class="col-sm-12"></div>
            <div class="col-sm-12 row">
                <button class="col-sm-6" @click="checkLivenessToggle=!checkLivenessToggle" v-if="!checkLivenessToggle">📷 | Start Checking Liveness</button>
            </div>
            <div class="col-sm-12 row" v-if="checkLivenessToggle">
                <button class="col-sm-6" @click="checkLivenessToggle=!checkLivenessToggle" style="background-color: #E02F65;">🛑 | Stop Checking Liveness</button>
            </div>
            <div class="col-sm-12 row" v-if="!checkLivenessToggle">            
                <button class="col-sm-6" @click="ChangeCameraToggler()">🗘 | Switch Kamera</button>
            </div>
            <!-- <div class="col-sm-12" style="color: white;">Result: {{ livenessResponses }}</div>
            <div class="col-sm-12" style="color: white;">Roundtrip Time: {{ timeDataFrontend }}</div> -->
        </div>

        <div class="response-area col-md-12 row">
            <div class="col-md-12 row"
                 style="padding: 0vh 3vw 0vh 3vw;
                        margin: auto;">

                <div v-for="data in Object.keys(livenessResponses)" class="column col-md-3" style="padding: 1em;">
                    <h4>{{data}} </h4>
                    <div class="results h-75">{{ livenessResponses[data] }}</div>
                </div>

                <div class="column col-md-3" style="padding: 1em;">
                    <h4>If 5 `yes`, Liveness is achieved</h4>
                    <div class="results h-75">{{ livenessThreshold }}</div>
                </div>

                <div class="column col-md-3" style="padding: 1em;">
                    <h4>Liveness Decision</h4>
                    <div class="results h-75">{{ livenessDecision }}</div>
                </div>

                <div class="column col-md-3" style="padding: 1em;">
                    <h4>Roundtrip Time</h4>
                    <div class="results h-75">{{ timeDataFrontend }} seconds</div>
                </div>

            </div>
        </div>

    </div>
</template>

<script>
import WebcamCaptureCard  from '@/cards/FaceAttendanceCards/WebcamCaptureCard.vue'
import ImageCapture from '@/components/LivenessDemo/ImageCapture.vue'
import FacePattern from '@/components/LivenessDemo/FacePattern-v1.1.vue'

// mixins import
import TransactionID    from '@/mixins/services/state/TransactionID'
import Timestamp        from '@/mixins/services/state/Timestamp'

export default {
    mixins: [
        TransactionID,
        Timestamp
    ],
    components: {
        'image-capture': ImageCapture,
        'webcam-capture-card': WebcamCaptureCard,
        'face-pattern': FacePattern,
    },
    props: {
        livenessAPI: {
            default: "https://api.riset.ai/api_fr/sandbox-liveness/liveness-verification/v1.2"
            // default: "http://localhost:9999/dummy_response"
        },
        clientID: {
            default: "-"
        },
        clientToken: {
            default: "-"
        }
    },
    data() {
        return {
            userImage: undefined,
            facePattern: ["front"],
            livenessResponses: {
                status: "-",
                angle: {
                    pitch: "-",
                    yaw: "-"
                } 
            },
            livenessAngles: [],
            livenessThreshold: [],
            livenessDecision: "-",
            captureFrameToggle: 0,
            changeCameraToggle: 'user',
            webcamActiveToggle: true,
            checkLivenessToggle: false,
            timeDataFrontend: undefined,
            hits: 0
        }
    },
    computed: {
        angles() {
            return this.livenessResponses.angle
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
        helloWorld() {
            console.log("hello world")
        },
        GetCapturedImageFromWebcam(image) {
            this.userImage = image
        },
        CheckLiveness() {
            const payload = {
                "user_image":   this.userImage,
                "pattern":      this.facePattern[0],
                "trx_id":       this.$_TransactionID_transactionID,
                "client_id":    this.clientID,
                "client_token": this.clientToken
            }
            console.log(payload)

            this.axios.interceptors.request.use( x => {
                x.meta = x.meta || {}
                x.meta.requestStartedAt = new Date().getTime();
                return x
            })

            this.axios.interceptors.response.use( x => {
                x.responseTime = new Date().getTime() - x.config.meta.beginTimer;
                return x
            })

            return this.axios.post(
                this.livenessAPI,
                JSON.stringify(payload),
                { headers : { 'Content-Type': 'application/json' } }
            )
        },
        CaptureImageInterval() {  
            this.interval = setInterval(() => {
                this.CheckLiveness()
                    .then(response => {
                        this.hits ++
                        console.log("hits: ", this.hits)
                        console.log(response)
                        this.livenessResponses = response.data.liveness
                        this.timeDataFrontend = (new Date().getTime() - response.config.meta.requestStartedAt) / 1000
                        if (response.data.error_message != "None") {
                            this.livenessResponses.status = response.data.error_message
                            this.livenessResponses.angle = "-"
                        }
                        this.CaptureFrameToggler()
                    }).catch(error => {
                        this.CaptureFrameToggler()
                        console.log(error)
                        this.livenessResponses.status = "Status 404 - API Not Available"
                        this.timeDataFrontend = (new Date().getTime() - response.config.meta.requestStartedAt) / 1000
                    })
            }, 2000)
        },
        DetermineLiveness() {
            if (this.livenessAngles.length > 0) {
                // liveness Logic
                if (this.facePattern == "left") {
                    var i
                    for (i=0; i < this.livenessAngles.length; i++) {
                        if (this.livenessAngles[i].yaw < (-12)) {
                            this.livenessThreshold.push("yes")
                            this.livenessAngles = []
                        }
                    }
                } else if (this.facePattern == "right") {
                    var i
                    for (i=0; i < this.livenessAngles.length; i++) {
                        if (this.livenessAngles[i].yaw > (12)) {
                            this.livenessThreshold.push("yes")
                            this.livenessAngles = []
                        }
                    }
                } else if (this.facePattern == "down") {
                    var i
                    for (i=0; i < this.livenessAngles.length; i++) {
                        if (this.livenessAngles[i].pitch < (-12)) {
                            this.livenessThreshold.push("yes")
                            this.livenessAngles = []
                        }
                    }
                } else if (this.facePattern == "up") {
                    var i
                    for (i=0; i < this.livenessAngles.length; i++) {
                        if (this.livenessAngles[i].pitch > (12)) {
                            this.livenessThreshold.push("yes")
                            this.livenessAngles = []
                        }
                    }
                }
            }

            if (this.livenessThreshold.length >= 5) {
                console.log("liveness achieved", this.livenessThreshold)
                this.livenessDecision = "Liveness Achieved!"
                this.livenessThreshold = []
            }
        },
        CaptureFrameToggler() {
            this.captureFrameToggle += 1
        },
        ChangeCameraToggler() {
            if (this.changeCameraToggle == 'user') {
                this.changeCameraToggle = 'environment'
            } else if (this.changeCameraToggle == 'environment') {
                this.changeCameraToggle = 'user'
            } else {
                this.changeCameraToggle = 'user'
            }
        },
    },
    watch: {
        checkLivenessToggle(e) {
            if (e == true) {
                this.$_TransactionID_GenerateTransactionID()
                // this.$_TransactionID_transactionID = "luqman_test"
                this.CaptureFrameToggler()
                this.CaptureImageInterval()
            } else {
                clearInterval(this.interval)
            }
        },
        angles(data) {
            this.livenessAngles.push(data)
            this.DetermineLiveness()
        },
        userImage(image) {
            this.$emit("userPhoto", this.userImage)
        },
        livenessResponses(response) {
            this.$emit("livenessResponse", this.livenessResponses)
        },
    },
    mounted() {
    
    },
    created() {
    
    }
}
</script>
    
<style scoped>

#webcam-capture {
    max-width: 25em;
    overflow: hidden;
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
}

.file-select {
    justify-content: center;
    height: 6em;
}   
    .file-select label {
        height: 100%;
        cursor: pointer;
        display: flex;
        justify-content: center;
        text-align: center;
        background-color: #374369;
        border-radius: 2em;
    } .file-select label:hover {
        background-color: #5b6ca3;
    } .file-select label p {
        text-align: center;
        margin: auto;
    }
    .file-select input {
        visibility: hidden;
        z-index: -2;
        position: absolute;
    }

div {
    /* font */
    font-family: Helvetica Neue Bold;
    font-weight: bold;
    font-size: large;
    color: white;
    text-shadow: 2px 2px 4px #000000;

    text-align: center;
    justify-content: center;
} p {
    font-family: Helvetica Neue Bold;
    font-weight: bold;
}

button {
    /* font */
    font-family: Helvetica Neue Bold;
    font-weight: bold;
    font-size: large;
    color: white;
    text-shadow: 2px 2px 4px #000000;
    text-align: center;

    background-color: #374369;
    border: none;
    border-radius: 2em;
    height: 6em;
    max-height: 7em;

    margin: 1em 0;
} button:hover {
    background-color: #5b6ca3;
} button:focus {
    outline: 0 !important;
}

</style>