<template>

    <div>

        <b-overlay no-fade :show="webcamActiveToggle" opacity="0.0" id="webcam-capture" >

            <!-- Preview and Processing functions are inside this component -->
            <div id="photo-processing">
                <photo-processing-card        
                :processing-buttons="'show-buttons'"
                :image-to-process="userPhoto"
                setImageWidth="1024"
                setImageHeight="1024"
                @imageProcessed="GetCapturedImageFromProcessing"></photo-processing-card>
            </div>
            
            <!-- Webcam Capture functions, and captured frame is accessed through this component -->
            <template v-slot:overlay>
                <webcam-capture-card
                    @capturedImage="GetCapturedImageFromWebcam"
                    :captureFrameToggle="captureFrameToggle"
                    :changeCameraToggle="changeCameraToggle"></webcam-capture-card>
            </template>
            
        </b-overlay>

        <div class="buttons row">
            <div class="file-select col-sm-12" v-if="!webcamActiveToggle">
                <label for="file_in">AMBIL FOTO</label>
                <input type="file" @change="InputImageFile" id="file_in">
            </div>
            <button class="col-sm-12" @click="webcamActiveToggle=!webcamActiveToggle" v-if="!webcamActiveToggle">BUKA WEBCAM</button>
            <button class="col-sm-12" @click="webcamActiveToggle=!webcamActiveToggle" v-if="webcamActiveToggle">TUTUP WEBCAM</button>
            <button class="col-sm-12" v-if="webcamActiveToggle" @click="captureFrameToggle+=1">AMBIL FOTO WEBCAM</button>
            <button class="col-sm-12" v-if="webcamActiveToggle" @click="ChangeCameraToggler()">UBAH MODE KAMERA</button>
        </div>

    </div>

</template>

<script>
import Vue from 'vue'

import PhotoProcessingCard from '@/cards/FaceAttendanceCards/PhotoProcessingCard.vue'
import WebcamCaptureCard from '@/cards/FaceAttendanceCards/WebcamCaptureCard.vue'

// import assets
import LogoImage from '@/assets/avatar_default.png'

export default {
    components: {
        'photo-processing-card': PhotoProcessingCard,
        'webcam-capture-card': WebcamCaptureCard
    },
    props: {
        userPhoto: {
            default: LogoImage
        }
    },
    data() {
        return {
            processedPhoto: undefined,
            webcamActiveToggle: false,
            captureFrameToggle: 0,
            changeCameraToggle: 'user'
        }
    },
    methods: {
        GetCapturedImageFromProcessing(image) {
            this.processedPhoto = image
            this.$emit("userPhoto", image)
        },
        GetCapturedImageFromWebcam(image) {
            this.userPhoto = image
            this.processedPhoto = image
            this.webcamActiveToggle = !this.webcamActiveToggle
            this.$emit("userPhoto", image)
        },
        InputImageFile(e) {            
            const files = e.target.files
            const file = files[0]    

            if (!file.type.match('image.*')) {
                alert("Please insert an image file")
                return
            }
    
            const reader = new FileReader();
            reader.onload = (e) => {
                this.userPhoto = e.target.result
            }
            reader.readAsDataURL(file);
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
    }

}

</script>

<style scoped>

#webcam-capture {
    height: 512px;
    width: 512px;
    overflow: hidden;
}

.file-select {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}   
    .file-select label {
        padding: 1vw;
        width: 100%;
        height: 100%;
        background: white;
        color: rgb(0, 0, 0);
        text-align: center;
    }
    .file-select input {
        visibility: hidden;
        z-index: -2;
        position: absolute;
    }

button {
    padding: 1vw;
}

</style>