<template>

    <div class="row">

        <b-overlay class="col-sm-5" no-fade :show="webcamActiveToggle" opacity="0.0" id="webcam-capture" >

            <!-- Preview and Processing functions are inside this component -->
            <div id="photo-processing">
                <photo-processing-card        
                  :processing-buttons="'show-buttons'"
                  :image-to-process="userPhoto"
                  setImageWidth="1024"
                  setImageHeight="1024"
                  @imageProcessed="GetCapturedImageFromProcessing">
                </photo-processing-card>
            </div>
            
            <!-- Webcam Capture functions, and captured frame is accessed through this component -->
            <template v-slot:overlay>
                <webcam-capture-card
                    @capturedImage="GetCapturedImageFromWebcam"
                    :captureFrameToggle="captureFrameToggle"
                    :changeCameraToggle="changeCameraToggle"></webcam-capture-card>
            </template>
            
        </b-overlay>

        <div class="row col-sm-7" style="padding: 1em 0;">
            <div style="height: 1em;" class="col-sm-12"></div>
            <div class="file-select col-sm-12 row" v-if="!webcamActiveToggle">
                <label class="col-sm-6" for="file_in"><p><i class="material-icons">image</i> | Input Photo / Camera App</p></label>
                <input type="file" @change="InputImageFile" id="file_in">
            </div>
            <div class="col-sm-12 row">
                <button class="col-sm-6" @click="webcamActiveToggle=!webcamActiveToggle" v-if="!webcamActiveToggle">📷 | Open Browser Camera</button>
            </div>
            <div class="col-sm-12 row" v-if="webcamActiveToggle">
                <button @click="webcamActiveToggle=!webcamActiveToggle" style="background-color: #E02F65;">Tutup Webcam</button>
            </div>
            <div class="col-sm-12 row" v-if="webcamActiveToggle" >
                <button @click="captureFrameToggle+=1" style="background-color: #2FD08C;">Capture Foto</button>
            </div>
            <div class="col-sm-12 row" v-if="webcamActiveToggle">            
                <button @click="ChangeCameraToggler()">UBAH MODE KAMERA</button>
            </div>

        </div>

    </div>

</template>

<script>
import Vue from 'vue'

import PhotoProcessingCard from '@/cards/FaceAttendanceCards/PhotoProcessingCard.vue'
import WebcamCaptureCard from '@/cards/FaceAttendanceCards/WebcamCaptureCard.vue'

// import assets
import LogoImage from '@/assets/inputPhotoIcon.png'

export default {
    components: {
        'photo-processing-card': PhotoProcessingCard,
        'webcam-capture-card': WebcamCaptureCard
    },
    props: {
        userPhoto: {
            default: LogoImage
        },
        openWebcamToggle: {
            default: 0
        },
        captureWebcamToggle: {
            default: 0
        },
        changeCameraModeToggle: {
            default: 0
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
    },
    watch: {
        changeCameraModeToggle(e) {
            this.ChangeCameraToggler()
        }
    }

}

</script>

<style scoped>

#webcam-capture {
    max-width: 25em;
    overflow: hidden;
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
    font-family: Helvetica Neue;
    font-weight: bold;
    font-size: large;
    color: white;
    text-shadow: 2px 2px 4px #000000;

    text-align: center;
    justify-content: center;
}

button {
    /* font */
    font-family: Helvetica Neue;
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
    width: 25em;
    max-width: 40vw;
}

</style>