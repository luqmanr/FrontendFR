<template>

    <div>   
        <attendance-card></attendance-card>
        <!-- <photo-processing-card></photo-processing-card> -->
        <!-- <webcam-capture-card></webcam-capture-card> -->
        <!-- <image-processing
          :emitImageToggle="emitImageToggle"
          :rotateImageToggle="rotateImageToggle"
          :resizeImageToggle="resizeImageToggle"
          :resizeImageWidth="960"
          :resizeImageHeight="540"
          :imageToProcess="avatarImage"></image-processing>
        <button @click="rotateImageToggle += 1">ROTATE IMAGE</button>
        <button @click="resizeImageToggle += 1">RESIZE IMAGE</button>
        <button @click="emitImageToggle += 1">Receive Image</button> -->

    </div>

</template>

<script>

import { bus } from '@/main'
import WebcamQRScanner from '@/components/Camera/WebcamQrScannerInput.vue'
import WebcamInput from '@/components/Camera/WebcamInput(2).vue'

// import cards components
import WebcamCaptureCard from '@/cards/FaceAttendanceCards/WebcamCaptureCard.vue'
import PhotoProcessingCard from '@/cards/FaceAttendanceCards/PhotoProcessingCard.vue'

import AttendanceCard from '@/cards/FaceAttendanceCards/AttendanceCard.vue'


import ImageProcessing from '@/components/Image/ImageProcessing.vue'

// import assets
import DefaultAvatar from '@/assets/avatar_default.png'

export default {
    components: {
        'webcam-qr-scanner': WebcamQRScanner,
        'webcam-input': WebcamInput,
        'webcam-capture-card': WebcamCaptureCard,
        'photo-processing-card': PhotoProcessingCard,
        'attendance-card': AttendanceCard,
        'image-processing': ImageProcessing
    },
    data() {
        return {
            videoToggle: 0,
            rotateImageToggle: 0,
            resizeImageToggle: 0,
            emitImageToggle: 0,
            avatarImage: DefaultAvatar
        }
    },
    methods: {
        VideoToggler() {
            this.videoToggle += 1
        }
    },
    mounted() {
        console.log(window.location.origin)
    }
}
</script>

<style scoped>

</style>
