<template>

    <div id="photo-processing-card" class="row">

        <div id="processing-buttons" :class="processingButtons" class="col-sm-12 h-25">            
            <button @click="toggles.rotateImage += 1" class="col-sm-12">ROTATE IMAGE</button>
            <!-- <button @click="toggles.resizeImage += 1">RESIZE IMAGE</button> -->
        </div>
        
        <div id="preview-section" class="col-sm-12 h-75">
            <img :src="processedImage" id="preview-image">
        </div>

        <div id="image-processing">
            <image-processing
              :rotateImageToggle="toggles.rotateImage"
              :resizeImageToggle="toggles.resizeImage"
              :resizeImageHeight="resizedImageHeight"
              :resizeImageWidth="resizedImageWidth"
              :imageToProcess="imageToProcess"
              @imageProcessed="receiveProcessedImage"></image-processing>            

        </div>

    </div>

</template>

<script>

// import Functional Components
import ImageProcessing from '@/components/Image/ImageProcessing.vue'

// import assets
import DefaultAvatar from '@/assets/avatar_2.png'

export default {
    components: {
        'image-processing': ImageProcessing
    },
    props: {
        imageToProcess: {
            default: DefaultAvatar
        },
        setImageWidth: {
            default: undefined
        },
        setImageHeight: {
            default: undefined
        },
        processingButtons: {
            default: "hide-buttons"
        }
    },
    data() {
        return {
            processedImage: undefined,
            toggles: {
                captureVideo: 0,
                rotateImage: 0,
                resizeImage: 0
            },
            resizedImageWidth: undefined,
            resizedImageHeight: undefined
        }
    },
    computed: {

    },
    methods: {
        receiveProcessedImage(image) {
            this.processedImage = image
        },
        setNewImageWidth(width) {
            if (typeof(this.setImageWidth) == "string" || typeof(this.setImageWidth) == "number") {
                this.resizedImageWidth = this.setImageWidth
            } else {
                this.resizedImageWidth = width
            }
        },
        setNewImageHeight(height) {
            if (typeof(this.setImageHeight) == "string" || typeof(this.setImageHeight) == "number") {
                this.resizedImageHeight = this.setImageHeight
            } else {
                this.resizedImageHeight = height
            }
        }
    },
    watch: {
        processedImage(image) {
            this.$emit("imageProcessed", image)
        }
    },
    mounted() {
        console.log(window.location.origin)
    }
}
</script>

<style scoped>

#photo-processing-card {
    width: 100%;
    height: 100%;
}

#preview-section {
    max-height: 100%;
    overflow: hidden;

    /* borders */
    box-shadow: 0 3px 6px rgb(182, 0, 136), 0 1px 6px rgb(255, 0, 0);

    margin: 0 auto;
    position: relative;
}

#preview-image {
    padding: 1vh;
    max-width: 100%;
    margin: 0 auto;
    position: relative;
    z-index: 0;
}

button {
    width: 50%;
    margin: 0 auto;
    position: relative;
}

.show-buttons {
    visibility: visible;
}
.hide-buttons {
    visibility: hidden;
}

</style>
