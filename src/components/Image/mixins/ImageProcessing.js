export default {
    data() {
        return {
            $_ImageData_imageObject: undefined,
            $_ImageData_CanvasDOM: undefined,
            $_ImageData_CanvasContext: undefined
        }
    },
    methods: {
        rotateImage() {
            const canvas = this.$refs.rotated_image
            var context = canvas.getContext('2d')

            var canvas_width = this.rotatedObjects.image_width
            var canvas_height = this.rotatedObjects.image_height

            var imageObj = new Image();
            imageObj.onload = (e) => {
                // imageObj.style.transform = 'rotate(90deg)'
                context.translate(canvas_width * 0.5, canvas_height * 0.5)
                context.rotate(90 * Math.PI / 180)
                context.translate(canvas_width * -0.5, canvas_height * -0.5)
                context.clearRect(0, 0, canvas_width, canvas_height)
                context.drawImage(imageObj,0,0,this.displayObjects.image_width,this.displayObjects.image_height)

                var rotated_image = canvas.toDataURL()
                this.displayObjects.preview_image = rotated_image
                this.payloadData.image_base64 = rotated_image.split(',')[1]
            };
            imageObj.src = this.displayObjects.input_image
        },
        $_ImageData_EmitImageObject() {
            this.$_ImageData_imageObject = this.$_ImageData_CanvasDOM.toDataURL()
            this.$emit("CapturedImageObject", this.$_ImageData_imageObject)
        }
    },
    mounted() {
        this.$_ImageData_CanvasDOM = this.$refs.canvas
        this.$_ImageData_CanvasContext = this.$_ImageData_CanvasDOM.getContext('2d')
    }
}