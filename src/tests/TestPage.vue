<template>

    <div>   
        <div class="input-area">
            <image-capture @userPhoto="$_ImageCapture_ReceiveImage"></image-capture>
            <video-recorder @videoRecorded="$_VideoRecorder_ReceiveVideo"></video-recorder>
            <div class="pattern-selection">
                <span class="col-md-6" style="color: white; margin: 5vh 0vw 0vh 0vw;">Kelas/Region/Cluster: </span>
                <select v-model.lazy="payloadData.cluster" class="col-md-6" style="margin: 0vh 0vw 5vh 0vw;">
                    <option v-for="regions in regionList" :key="regions">{{regions}}</option>
                </select>
            </div>
            <button @click="LivenessCheck">VERIFIKASI</button>
        </div>
        
        <div class="response-area">
            <div class="row"
                 style="padding: 0vh 3vw 0vh 3vw;
                        margin: auto;">

                <div class="column col-md-6"
                     style="margin: 1vh 0vw 1vh 0vw;
                     border-color: grey;
                     border-style: solid;">
                    <div>Status Verifikasi: </div>
                    <div style='font-weight: bolder;
                            list-style-type: none;
                            font-size: larger;'>{{ responseData.verified }}</div>
                </div>

                <div class="column col-md-6"
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
import VideoRecorder from '@/components/LivenessDemo'
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
            livenessAPI: "https://riset.luqmanr.xyz/api_fr/v3/livenessverification",
            avatarImage: DefaultAvatar,
            userImage: undefined,
            userVideo: undefined,
            responseData: {
                verified: "-",
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
        LivenessCheck() {
            const payload = {
                "user_image": this.userImage,
                "user_video": this.userVideo
            }
            console.log(payload)

            axios.post(this.livenessAPI,
              JSON.stringify(payload),
              {headers :{'Content-Type': 'application/json'}},
              {timeout: 10000})
                .then(response => {
                    console.log(response.data)
                    this.responseData.verified = response.data.verified
                    this.responseData.liveness = response.data.liveness
                })
        }
    },
    mounted() {

    }
}
</script>

<style scoped>
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
