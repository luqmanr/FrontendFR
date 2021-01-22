<template>

    <div>   
        <div class="input-area">
            <button v-if="userImage != undefined && userVideo != undefined" @click="LivenessCheck" class="col-sm-12" style="text-align: center;">VERIFIKASI</button>
            <button v-if="userImage == undefined || userVideo == undefined"
                    @click="LivenessCheck" 
                    class="col-sm-12 disabled" 
                    style="text-align: center;" 
                    title="Fill out all the Data above!"
                    disabled>VERIFIKASI</button>
        </div>

        <div class="response-area row">
            <div class="col-md-10 row"
                 style="padding: 0vh 3vw 0vh 3vw;
                        margin: auto;">

                <div class="column col-md-3" style="padding: 1em;">
                    <h4>Transaction ID: </h4>
                    <div class="results h-75">{{ $_TransactionID_transactionID }}</div>
                </div>

                <div class="column col-md-3" style="padding: 1em;">
                    <h4>Status Verifikasi: </h4>
                    <div class="results h-75">{{ responseData.verification }}</div>
                </div>

                <div class="column col-md-3" style="padding: 1em;">
                    <h4>Confidence Level: </h4>
                    <div class="results h-75">{{ responseData.confidenceLevel }}</div>
                </div>

                <div class="column col-md-3" style="padding: 1em;">
                    <h4>Status Liveness: </h4>
                    <div class="results h-75">{{ responseData.liveness }}</div>
                </div>

                <div class="column col-md-3" style="padding: 1em;">
                    <h4>Pattern Wajah: </h4>
                    <div class="results h-75">{{ responseData.pattern }}</div>
                </div>

                <div class="column col-md-3" style="padding: 1em;">
                    <h4>Deteksi Blink: </h4>
                    <div class="results h-75">{{ responseData.eye_blink }}</div>
                </div>

                <div class="column col-md-3" style="padding: 1em;">
                    <h4>Roundtrip Frontend: </h4>
                    <div class="results h-75">{{ responseData.timeDataFrontend }} seconds</div>
                </div>

                <div v-for="data in Object.keys(responseData.timeDataBackend)" class="column col-md-3" style="padding: 1em;">
                    <h4>{{data}}</h4>
                    <div class="results h-75">{{ responseData.timeDataBackend[data] }} seconds</div>
                </div>

            </div>
        </div>
    </div>

</template>

<script>
// mixins imports
import TransactionID    from '@/mixins/services/state/TransactionID'
import Timestamp        from '@/mixins/services/state/Timestamp'
import WebcamCapture    from '@/components/Camera/WebcamInput.vue'
import GeoLocation      from '@/GeneralComponents/GeoLocation.vue'
// import components
import Vue      from 'vue'
import VideoRecorder from '@/components/LivenessDemo/VideoRecorder.vue'
import ImageCapture from '@/cards/FaceAttendanceCards/AttendanceCard.vue'
// 3rd party library imports
import axios    from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
// import assets
import DefaultAvatar from '@/assets/avatar_default.png'

export default {
    mixins: [
        TransactionID,
        Timestamp
    ],
    components: {
        'video-recorder': VideoRecorder,
        'image-capture': ImageCapture
    },
    props: {
        userImage: {
            default: undefined
        },
        userVideo: {
            default: undefined
        },
        facePattern: {
            default: undefined
        },
        clientID: {
            default: "-"
        },
        clientToken: {
            default: "-"
        },
        livenessAPI: {
            default: "https://api.riset.ai/api_fr/demo/liveness-verification"
        }
    },
    data() {
        return {
            avatarImage: DefaultAvatar,
            responseData: {
                verification: "-",
                confidenceLevel: "-",
                liveness: "-",
                pattern: [],
                eye_blink: "-",
                timeDataFrontend: {},
                timeDataBackend: {},
                responseTrxID: undefined,
            },
            timeDataFrontend: {},
            timeDataBackend: {}
        }
    },
    methods: {
        $_ImageCapture_ReceiveImage(image) {
            this.userImage = image.split(',')[1]
        },
        $_VideoRecorder_ReceiveVideo(video) {
            this.userVideo = video
        },
        LivenessCheck() {
            this.ResetResponses()
            this.$_TransactionID_GenerateTransactionID()

            const payload = {
                "user_image": this.userImage,
                "user_video": this.userVideo,
                "pattern": this.facePattern,
                "trx_id": this.$_TransactionID_transactionID,
                "client_id":    this.clientID,
                "client_token": this.clientToken
            }
            console.log(payload)

            axios.interceptors.request.use( x => {
                // to avoid overwriting if another interceptor
                // already defined the same object (meta)
                x.meta = x.meta || {}
                x.meta.requestStartedAt = new Date().getTime();
                return x;
            })

            axios.interceptors.response.use( x => {
                    // console.log(`Execution time for: ${x.config.url} - ${new Date().getTime() - x.config.meta.requestStartedAt} ms`)
                    return x
                },
                // Handle 4xx & 5xx responses
                x => {
                    // console.error(`Execution time for: ${x.config.url} - ${new Date().getTime() - x.config.meta.requestStartedAt} ms`)
                    throw x
                }
            )

            axios.interceptors.response.use( x => {
                x.responseTime = new Date().getTime() - x.config.meta.beginTimer;
                return x
            })

            console.log(this.livenessAPI)
            axios.post(this.livenessAPI,
              JSON.stringify(payload),
              {headers :{'Content-Type': 'application/json'}}
            //   {timeout: 20000}
              )
                .then(alert("UPLOADING TO API") + this.livenessAPI)
                .then(response => {
                    console.log(response)
                    
                    this.responseData.timeDataFrontend = (new Date().getTime() - response.config.meta.requestStartedAt) / 1000
                    this.responseData.verification = response.data.verification.status
                    this.responseData.confidenceLevel = response.data.verification.confidence_level
                    this.responseData.liveness = response.data.liveness.status
                    this.responseData.pattern = response.data.liveness.pattern
                    this.responseData.eye_blink = response.data.liveness.eye_blink
                    this.responseData.timeDataBackend = response.data.time

                    if (response.data.error_message != "None") {
                        this.responseData.verification = response.data.error_message
                        this.responseData.confidenceLevel = "-"
                        this.responseData.liveness = "-"
                        this.responseData.pattern = []
                        this.responseData.eye_blink = response.data.liveness.eye_blink
                        this.responseData.timeDataBackend = response.data.time
                    }
                })
                .catch(error => {
                    console.log(error)
                    this.responseData.timeDataFrontend = (new Date().getTime() - error.config.meta.requestStartedAt) / 1000
                    this.responseData.verification = "Status 404 - API Not Available"
                })
                .then(e => {
                    this.responseData.responseTrxID = this.$_TransactionID_transactionID
                    this.EmitResponse()
                })
        },
        EmitResponse() {
            this.$emit("LivenessResponse", this.responseData)
        },
        ResetResponses() {
            this.responseData.verification = "-"
            this.responseData.confidenceLevel = "-"
            this.responseData.liveness = "-"
            this.responseData.pattern = []
            this.responseData.eye_blink = "-"
            this.responseData.timeDataFrontend = {}
            this.responseData.timeDataBackend = {}
        }
    },
    watch: {

    },
    created() { 

    },
    mounted() {
        this.$_TransactionID_transactionID = "-"
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
