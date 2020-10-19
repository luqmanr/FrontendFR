<template>
    <div class="app">

        <div class="registration-app row">

            <div class="col-md-12 video-app">
                <div class="video-container">

                    <video class="media-video"
                           v-show="toggles.visibility"
                           ref="videoDOM"
                           autoplay></video>

                    <video controls
                           class="replay-video"
                           v-show="!toggles.visibility"
                           id="VideoReplay"></video>

                    <div id="myBar"
                         class="w3-container w3-green"
                         ref="progressBar"
                         style="height:24px;
                                width:1%;
                                background-color:dodgerblue"></div>
                </div>
            </div>

            <div class="col-md-12 row">
                <button 
                  @click="startVideo"
                  class="col-sm-4">Record VIDEO</button>
                
                <div class="file-select col-sm-4">
                    <label for="video_input">Input Video File</label>
                    <input type="file" @change="inputVideoFile" id="video_input">
                </div>

                <button v-if="toggles.recordingStatus" 
                  @click="stopVideo"
                  class="col-sm-4">Stop VIDEO</button>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            videoRecorded: null,
            videoConstraints: {
                audio: false, // false karena tidak perlu merekam suara
                video: {
                    width: {
                      min: 320, ideal: 1920, max: 1920 // setting resolusi rekaman video
                    },
                    height: {
                      min: 240, ideal: 1080, max: 1920 // setting resolusi rekaman video
                    },
                    frameRate: {
                      min: 25, ideal: 60, max: 60 // setting fps rekaman video
                    },
                }
            },
            videoReplayEl: undefined,
            videoPreviewEl: undefined, //  ini  akan jadi reference ke videoDOM, untuk diisi dengan video
            canvasEl: undefined, // ini akan jadi reference ke canvasDOM, kalau mau crop atau menampilkan bounding box harus di-render di sini
            recorderEl: undefined, // ini adalah element yang akan mereka mediaStream (video) untuk ditembak ke api
            toggles: {
                timeInterval: 0, // lupa untuk apa, akan diganti kalau sudah ketemu fungsinya
                recordingStatus: false, // flag / status true ketika video mulai di-stream, dan status false ketika video stop di-stream
                visibility: true,
                sendVideo: 0
            },            
        }
    },
    methods: {
        // MULAI AMBIL MEDIASTREAM, YAITU VIDEO
        async startVideo() {
            this.videoRecorded = null
            this.toggles.visibility = true
            this.toggles.recordingStatus = true

            await navigator.mediaDevices
              .getUserMedia(this.videoConstraints)
                .then(this.getMediaStreamSuccess)
                .catch(this.getMediaStreamError)
        },
        getMediaStreamSuccess(stream) {
            // alert(stream.getVideoTracks()[0].getSettings().frameRate)
            window.stream = stream // make stream available to browser console
            this.videoPreviewEl.srcObject = stream // ini object yang akan kita rekam di recorder, dan ditampilkan kembali ke videoDOM

            try {
                var recorder = new MediaRecorder(stream, {mimeType : "video/webm"})
                this.recorderEl = recorder
            } catch (error) {
                console.error("Exception While creating MediaRecorder: " + error )
                return
            }

            // ketika mediaStream & recorder muncul, akan memanggil fungsi ini
            recorder.ondataavailable = (event) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.videoReplayEl.src = "data:video/webm;base64," + (event.target.result.split(',')[1])
                    this.videoRecorded = event.target.result.split(',')[1] // di split dulu info wrappernya, jadi hanya string base64 yang diambil
                    console.log(this.videoReplayEl)
                }
                reader.readAsDataURL(event.data)
            }
            // ketika mediaStream & recorder berhenti, akan memanggil fungsi ini
            recorder.onstop = (event) => {
                this.toggles.visibility = false
                this.toggles.recordingStatus = false
                var blobs = new Blob(this.videoRecorded)
                stream.getTracks().forEach(track => track.stop())
            }

            recorder.start() // memanggil recorder untuk memulai recording video ketika mediaStream didapatkan
            this.progressBar() // update progress bar untuk mengindikasikan sisa durasi perekaman

            setTimeout(this.stopVideo, 10000) // ketika 10000 counts, maka video akan memanggil stopVideo() untuk menghentikan video
        },
        getMediaStreamError(error) { // kalau webcam tidak bisa dibuka, akan muncul error ini
            alert('Gagal buka webcam ' + error)
        },
        stopVideo() {
            this.recorderEl.stop()
            this.toggles.recordingStatus = false

            var barEl = this.$refs.progressBar
            barEl.style.width = 100 + '%'

            clearInterval(this.toggles.timeInterval)

            // mengosongkan mediaStream, supaya tidak infinite loop
            if (typeof window.stream === "object") {
                this.videoPreviewEl.srcObject = null
                window.stream.getTracks().forEach(track => track.stop())
            }

            return true
        },
        inputVideoFile(e) {  
            this.videoRecorded = null
            this.toggles.visibility = true
            this.toggles.recordingStatus = true

            const files = e.target.files
            const file = files[0]    

            if (!file.type.match('video.*')) {
                alert("Please insert a video file")
                return
            }
    
            const reader = new FileReader()
            reader.onload = (event) => {
                this.videoReplayEl.src = "data:video/webm;base64," + (event.target.result.split(',')[1])
                this.videoRecorded = event.target.result.split(',')[1]
                this.toggles.visibility = false
                this.toggles.recordingStatus = false
            }
            reader.readAsDataURL(file)
        },
        progressBar() {
            var barEl = this.$refs.progressBar
            var id = setInterval(frame, 100)
            var width = 1
            function frame() {
                if (width >= 100) {
                    clearInterval(id)
                } 
                else {
                    width++;
                    barEl.style.width = width + '%'
                }
            }
        },
        newRegister() { // kalau mau registrasi lagi, reload window supaya semua data dikosongkan
            location.reload()
        }
    },
    computed: {
        
    },
    watch: {
        videoRecorded(video) {
            this.$emit("videoRecorded", video)
        }
    },
    beforeDestroy() {
        this.stopVideo()
    },
    created() {

    },
    mounted() {
        this.videoPreviewEl = this.$refs.videoDOM
        this.canvasEl = this.$refs.canvasDOM
        this.videoReplayEl = document.getElementById("VideoReplay") 
    }
}
</script>

<style scoped>
button {
    padding: 1vw;
}
h5 {
    padding: 0vh 0vh 0vh 0vh;
    margin: 0vh 0vh 0vh 0vh;
}
.app {
    padding: 1% 2% 2% 2%;
    /* background-color: white; */
}
.form-input {
    padding: 1% 1% 1% 1%;
    font-size: 90%;
}
.media {
    position: relative;
}
.video-app {
    margin-left: 4vh;
}
.video-container {
    width: 720px;
    height: 380px;
    overflow: hidden;
    background-color: black;
    display:block
}
.media-video {
    justify-self: center;
    width: 720px;
    height: 360px;
    background-color: #242424;
    -webkit-transform: scaleX(-0.5);
    transform: scaleX(-1);
}
.replay-video {
    justify-self: center;
    width: 720px;
    height: 360px;
    background-color: #242424;
}
.media-canvas {
    justify-self: center;
    position: absolute;
    top: 0;
    overflow: hidden;
}

.file-select {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}   
    .file-select label {
        padding: 1vw;
        width: 100%;
        height: 100%;
        background: white;
        color: rgb(0, 0, 0);
        text-align: center;
    }
    .file-select input {
        visibility: hidden;
        z-index: -2;
        position: absolute;
    }

.hidden {
    visibility: hidden;
}


</style>
