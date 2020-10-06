<template>

    <div id="webcam-component">

        <button @click="CaptureFrameToggler">Capture Frame!</button>

        <div id="camera-components">
            <webcam-qrscanner-input
              v-if='detectionMode == "qrscanner"'
              :key="captureFrameToggle"></webcam-qrscanner-input>
            <webcam-input
              v-if='detectionMode == null'
              @CaptureImage="ReceiveCaptureImage"
              :capture-image-toggle="captureFrameToggle"></webcam-input>
        </div>

    </div>

</template>

<script>
import { bus } from '@/main'
import WebcamQRScannerInput from '@/components/Camera/WebcamQrScannerInput.vue'
import WebcamInput from '@/components/Camera/WebcamInput(2).vue'

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
        ReceiveCaptureImage(image) {
            this.capturedImage = image
            this.$emit("capturedImage", image)
        }
    },
}

</script>

<style scoped>

</style>