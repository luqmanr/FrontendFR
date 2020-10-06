export default {
    data() {
        return {
            $_VideoToImage_VideoWidth: undefined,
            $_VideoToImage_VideoHeight: undefined,

            $_VideoToImage_ImageString: undefined,

            $_VideoToImage_VideoDOM: undefined,
            $_VideoToImage_CanvasDOM: undefined,
            $_VideoToImage_CanvasContext: undefined
        }
    },
    methods: {
        $_VideoToImage_GetVideoMetadata() {
            this.$_VideoToImage_VideoWidth = this.$_VideoToImage_VideoDOM.clientWidth
            this.$_VideoToImage_VideoHeight = this.$_VideoToImage_VideoDOM.clientHeight
        },
        $_VideoToImage_VideoFrameToCanvas() {
            this.$_VideoToImage_CanvasContext.drawImage(
                this.$_VideoToImage_VideoDOM,0,0, 
                this.$_VideoToImage_VideoWidth,
                this.$_VideoToImage_VideoHeight
            )
            this.$_VideoToImage_ImageString = this.$_VideoToImage_CanvasDOM.toDataURL()
        },
        $_VideoToImage_EmitImageObject() {
            this.$emit("CaptureImage", this.$_VideoToImage_ImageString)
        },
        async $_VideoToImage_CaptureVideoFrame() {
            await this.$_VideoToImage_GetVideoMetadata()
            this.$_VideoToImage_VideoFrameToCanvas()
        },
        
    },
    mounted() {
        this.$_VideoToImage_VideoDOM = document.querySelector('video')
        this.$_VideoToImage_CanvasDOM = this.$refs.canvas
        this.$_VideoToImage_CanvasContext = this.$_VideoToImage_CanvasDOM.getContext('2d')

    }
}