export default {
    data() {
        return {
            $_ImageData_imageObject: undefined,
            $_ImageData_CanvasDOM: undefined,
            $_ImageData_CanvasContext: undefined
        }
    },
    methods: {
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