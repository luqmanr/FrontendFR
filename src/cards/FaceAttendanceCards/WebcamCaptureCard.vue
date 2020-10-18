<template>

    <div id="webcam-component">

        <button @click="CaptureFrameToggler" style="visibility: hidden;">Capture Frame!</button>
        <button @click="ChangeCameraToggler" style="visibility: hidden;">Change Camera!</button>

        <div id="camera-components">
            <webcam-qrscanner-input
              v-if='detectionMode == "qrscanner"'
              :key="captureFrameToggle"></webcam-qrscanner-input>
            <webcam-input
              v-if='detectionMode == null'
              @CaptureImage="ReceiveCaptureImage"
              :CaptureImageToggle="captureFrameToggle"
              :ChangeCameraToggle="changeCameraToggle"
              :key="changeCameraToggle"></webcam-input>
        </div>

    </div>

</template>

<script>
import { bus } from '@/main'
import WebcamQRScannerInput from '@/components/Camera/WebcamQrScannerInput.vue'
import WebcamInput from '@/components/Camera/WebcamInput.vue'

export default {
    mixins: [

    ],
    components: {
        'webcam-qrscanner-input': WebcamQRScannerInput,
        'webcam-input': WebcamInput
    },
    props: {
        detectionMode: {
            default: null
        },
        captureFrameToggle: {
            default: 0
        },
        changeCameraToggle: {
            default: 'user'
        }
    },
    data() {
        return {
            capturedImage: undefined
        }
    },
    methods: {
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
        ReceiveCaptureImage(image) {
            this.capturedImage = image
            this.$emit("capturedImage", image)
        }
    },
}

</script>

<style scoped>

</style>