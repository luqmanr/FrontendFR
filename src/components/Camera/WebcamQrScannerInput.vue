<template>

    <div>

        <canvas 
          ref="canvas" 
          :height="QrScannerHeight"
          :width="QrScannerWidth"></canvas>

        <qrcode-stream 
          @decode="QrStringDecode"
          :key="QrScannerToogle"
          for="snapout" 
          ref="video"
          :style="{ height: QrScannerHeight, width: QrScannerWidth }"
          id="qr-scanner"></qrcode-stream>

    </div>
  
</template>
  
<script>

// mixins imports
import VideoToImage from './mixins/VideoToImage'

export default {
    mixins: [
        VideoToImage,
    ],
    components: {

    },
    props: {
        QrScannerWidth: {
            default: 1280
        },
        QrScannerHeight: {
            default: 720
        },
    },
    data() {
        return {
            QrString: String,
            QrScannerToogle: 0 
        }
    },
    methods: {
        QrStringDecode(decodedString) {
            this.QrString = decodedString
            this.$emit('QrStringDecode', decodedString)
            this.QrScannerToggler()
        },
        QrScannerToggler() {
            this.QrScannerToogle += 1 // increment value, to toggle DOM re-render
        },

    },
    mounted() {

    },
    computed: {

    },
    created() {
    },
    watch: {

    }
}

</script>
  
<style scoped>

#qr-scanner, #captured-frame {
    -webkit-transform: scaleX(-1);
    transform: scaleX(-1);
}

</style>
  