<template>

    <div>   
        <div class="input-area">
            <image-capture @userPhoto="$_ImageCapture_ReceiveImage" style="background-color: darkblue;"></image-capture>

            <div class="pattern-selection row" style="background-color: rgb(117, 0, 108);">
                <div v-for="selection,index in facePattern" class="col-sm-3">
                    <div>
                        <span style="color: white; margin: 5vh 0vw 0vh 0vw;">Pattern {{index+1}}: </span>
                        <select v-model.lazy="facePattern[index]" style="margin: 0vh 0vw 5vh 0vw;">
                            <option v-for="pattern,index in patternSelection" :key="index">{{pattern}}</option>
                        </select>
                    </div>
                </div>
                <button class="col-sm-12" @click="RandomizePattern()">RANDOMIZE FACE PATTERN</button>
            </div>
            
            <video-recorder @videoRecorded="$_VideoRecorder_ReceiveVideo" style="background-color: rgb(0, 78, 68);"></video-recorder>
            
            <button @click="LivenessCheck" class="col-sm-12 button">VERIFIKASI</button>
        </div>
        
        <div class="response-area row">
            <div class="col-md-10 row"
                 style="padding: 0vh 3vw 0vh 3vw;
                        margin: auto;">

                <div class="column col-md-4"
                     style="margin: 1vh 0vw 1vh 0vw;
                     border-color: grey;
                     border-style: solid;">
                    <div>Status Verifikasi: </div>
                    <div style='font-weight: bolder;
                            list-style-type: none;
                            font-size: larger;'>{{ responseData.verification }}</div>
                </div>

                <div class="column col-md-4"
                     style="margin: 1vh 0vw 1vh 0vw;
                     border-color: grey;
                     border-style: solid;">
                    <div>Confidence Level: </div>
                    <div style='font-weight: bolder;
                            list-style-type: none;
                            font-size: larger;'>{{ responseData.confidenceLevel }}</div>
                </div>

                <div class="column col-md-4"
                     style="margin: 1vh 0vw 1vh 0vw;
                     border-color: grey;
                     border-style: solid;">
                    <div>Status Liveness: </div>
                    <div style='font-weight: bolder;
                            list-style-type: none;
                            font-size: larger;'>{{ responseData.liveness }}</div>
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
    data() {
        return {
            livenessAPI: "https://riset.luqmanr.xyz/api_fr/demo/liveness-verification",
            avatarImage: DefaultAvatar,
            userImage: undefined,
            userVideo: undefined,
            facePattern: [],
            patternSelection: ['up','right','down','left','blink'],
            responseData: {
                verification: "-",
                confidenceLevel: "-",
                liveness: "-"
            }
        }
    },
    methods: {
        $_ImageCapture_ReceiveImage(image) {
            this.userImage = image.split(',')[1]
        },
        $_VideoRecorder_ReceiveVideo(video) {
            this.userVideo = video
        },
        RandomizePattern() {
            this.facePattern = ['-','-','-','-']
            var numbers = []
            var i
            for (i = 0; i < this.patternSelection.length; i++) {
                numbers.push(i)
            }  
            function shuffle(a) {
                var j, x, i;
                for (i = a.length - 1; i > 0; i--) {
                    j = Math.floor(Math.random() * (i + 1));
                    x = a[i];
                    a[i] = a[j];
                    a[j] = x;
                }
                return a;
            }
            var pattern = shuffle(numbers)
            for (i = 0; i < this.facePattern.length; i++) {
                this.facePattern[i] = this.patternSelection[pattern[i]]
            }
        },
        LivenessCheck() {
            this.ResetResponses()
            const payload = {
                "user_image": this.userImage,
                "user_video": this.userVideo,
                "pattern": this.facePattern,
                "trx_id": this.$_TransactionID_transactionID
            }
            console.log(payload)

            axios.post(this.livenessAPI,
              JSON.stringify(payload),
              {headers :{'Content-Type': 'application/json'}},
            //   {timeout: 10000}
              )
                .then(alert("UPLOADING TO API") + this.livenessAPI)
                .then(response => {
                    console.log(response)
                    this.responseData.verification = response.data.verification.status
                    this.responseData.confidenceLevel = response.data.verification.confidence_level
                    this.responseData.liveness = response.data.liveness.status

                    if (response.data.error_message != "None") {
                        this.responseData.verification = response.data.error_message
                        this.responseData.confidenceLevel = "-"
                        this.responseData.liveness = "-"
                    }
                })
                .catch(error => {
                    console.log(error)
                    this.responseData.verification = error.data.verification.status
                    this.responseData.confidenceLevel = error.data.verification.confidence_level
                    this.responseData.liveness = error.data.liveness.status
                })
        },
        ResetResponses() {
            this.responseData.verification = "-"
            this.responseData.confidenceLevel = "-"
            this.responseData.liveness = "-"
        }
    },
    watch: {
        facePattern(e) {
            console.log(e)
        }
    },
    created() { 
        this.RandomizePattern()
    },
    mounted() {

    }
}
</script>

<style scoped>
.button {
    padding: 2vw; 
    background-color: rgb(8, 107, 255);
    font-weight: bolder;
    color: white;
}
.input-area {
    color: white;
    /* background-color: aliceblue; */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.response-area {
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /* padding: 2vh; */
}
</style>
