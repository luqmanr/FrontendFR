<template>

    <div class="image-processing-component">

        <canvas 
          ref="originalCanvas"
          :width="originalCanvas.width"
          :height="originalCanvas.height"
          class="original-canvas"></canvas>
        <canvas 
          ref="processedCanvas"
          :width="processedCanvas.width"
          :height="processedCanvas.height"
          class="processed-canvas"></canvas>

    </div>

</template>

<script>
// import placeholder image
import DefaultAvatar from '@/assets/avatar_2.png'

export default {
    mixins: [

    ],
    props: {
        imageToProcess: {
            default: DefaultAvatar
        },
        resizeImageWidth: {
            default: undefined
        },
        resizeImageHeight: {
            default: undefined
        },
        emitImageToggle: {
            default: 0
        },
        rotateImageToggle: {
            default: 0
        },
        resizeImageToggle: {
            default: 0
        }
    },
    data() {
        return {
            originalCanvas: {
                DOM: undefined,
                Context: undefined,
                width: 1280,
                height: 1280
            },
            processedCanvas: {
                DOM: undefined,
                Context: undefined,
                width: 1280,
                height: 1280
            },
            compressionQuality: 0.5,
            processedImage: undefined
        }
    },
    methods: {
        async InitializeComponent() {
            this.originalCanvas.DOM = this.$refs.originalCanvas
            this.originalCanvas.Context = this.originalCanvas.DOM.getContext('2d')
            this.processedCanvas.DOM = this.$refs.processedCanvas
            this.processedCanvas.Context = this.processedCanvas.DOM.getContext('2d')

            if (this.imageToProcess != undefined) {
                await this.InitializeComponent_ResizeCanvas()
                this.InitializeComponent_DrawCanvas()
            }
        },
        InitializeComponent_ResizeCanvas() {
            var imageObj = new Image()
            imageObj.onload = (e) => { 
                var height, width
                if (imageObj.width > imageObj.height) {
                    width = imageObj.width
                    height = imageObj.width
                } else if (imageObj.width < imageObj.height) {
                    width = imageObj.height
                    height = imageObj.height
                } else {
                    width = imageObj.width
                    height = imageObj.height
                }
                this.originalCanvas.width = width
                this.originalCanvas.height = height
                this.processedCanvas.width = width
                this.processedCanvas.height = height
            }
            imageObj.src = this.imageToProcess
        },
        InitializeComponent_DrawCanvas() {
            var imageObj = new Image()
            imageObj.onload = (e) => {
                this.originalCanvas.Context.drawImage(imageObj,0,0)
                this.processedCanvas.Context.fillRect(0,0,1920,1920)
                this.processedCanvas.Context.drawImage(imageObj,0,0)
                this.processedImage = this.processedCanvas.DOM.toDataURL()
            }
            imageObj.src = this.imageToProcess
        },
        RotateImage() {
            var imageObj = new Image()
            imageObj.onload = (e) => {
                this.processedCanvas.Context.translate(this.processedCanvas.width * 0.5, this.processedCanvas.height * 0.5)
                this.processedCanvas.Context.rotate(90 * Math.PI / 180)
                this.processedCanvas.Context.translate(this.processedCanvas.width * -0.5, this.processedCanvas.height * -0.5)
                this.processedCanvas.Context.clearRect(0, 0, this.processedCanvas.width, this.processedCanvas.height)
                this.processedCanvas.Context.drawImage(imageObj,0,0, this.processedCanvas.width, this.processedCanvas.height)
                this.processedImage = this.processedCanvas.DOM.toDataURL()
            }
            imageObj.src = this.imageToProcess
        },
        ResizeImage() {
            var imageObj = new Image()
            imageObj.onload = (e) => {
                this.processedCanvas.Context.drawImage(imageObj,0,0)
                this.processedImage = this.processedCanvas.DOM.toDataURL()
            }
            imageObj.src = this.imageToProcess
        },
        EmitImageObject() {
            // this.processedImage = this.processedCanvas.DOM.toDataURL('image/jpeg', this.compressionQuality)
            this.processedImage = this.processedCanvas.DOM.toDataURL()
            this.$emit("imageProcessed", this.processedImage)
        }

    },
    watch: {
        imageToProcess(e) {
            this.InitializeComponent(e)
        },
        rotateImageToggle(e) {
            this.RotateImage()
        },
        resizeImageToggle(e) {
            this.ResizeImage()
        },
        emitImageToggle(e) {
            this.EmitImageObject()
        },
        processedImage(e) {
            this.EmitImageObject()
        }
    },
    mounted() {
        this.InitializeComponent()
        this.InitializeComponent()
    }
}

</script>

<style scoped>

.original-canvas {
    z-index: -505;
    position: absolute;
    visibility: hidden;
}

.processed-canvas {
    z-index: -500;
    position: absolute;
    visibility: hidden;
}
</style>