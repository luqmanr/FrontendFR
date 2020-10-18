<template>

    <div id="photo-processing-card" class="row">

        <div id="processing-buttons" :class="processingButtons" class="col-sm-12">            
            <button @click="toggles.rotateImage += 1" class="col-sm-12">ROTATE IMAGE</button>
            <!-- <button @click="toggles.resizeImage += 1">RESIZE IMAGE</button> -->
        </div>
        
        <div id="preview-section" class="col-sm-12" for="fileIn" @click="ClickInput">
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
        <input type="file" @change="InputImageFile" id="fileIn">
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
        },
        ClickInput() {
            var inputEl = document.getElementById("fileIn")
            inputEl.click()
        },
        InputImageFile(e) {    
            console.log("method called")        
            const files = e.target.files
            const file = files[0]    

            if (!file.type.match('image.*')) {
                alert("Please insert an image file")
                return
            }
    
            const reader = new FileReader()
            reader.onload = (e) => {
                this.imageToProcess = e.target.result
            }
            reader.readAsDataURL(file)
        },
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
    height: 100%;
    max-height: 100%;
    overflow: hidden;

    /* borders */
    border-style: solid;
    border-color: #374369;
    border-radius: 2em;
    /* box-shadow: 0 3px 6px rgb(182, 0, 136), 0 1px 6px rgb(255, 0, 0); */

    margin: 0 auto;
    position: relative;
}

#preview-image {
    padding: 1vh;
    max-width: 100%;
    margin: 0 auto;
    position: relative;
    z-index: 0;
    cursor: pointer;
}

#processing-buttons {
    padding: 1em;
}

button {
    font-family: Helvetica Neue;
    font-weight: bold;
    font-size: large;
    color: white;
    text-shadow: 2px 2px 4px #000000;

    background-color: #374369;
    border: none;
    border-radius: 2em;
    height: 2em;
    max-height: 10em;
    margin: 0 auto;
    position: relative;
}

.show-buttons {
    visibility: visible;
}
.hide-buttons {
    visibility: hidden;
}

input {
    visibility: hidden;
}

</style>
