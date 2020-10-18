<template>
    <div class="app">

        <div class="registration-app row">

            <div class="col-md-5 video-app">
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

            <div class="col-md-7 row"  style="padding: 1em 0;">
                <div class="col-sm-12 row" style="padding: 1em 0;" v-if="!toggles.recordingStatus">
                    <button @click="startVideo" class="col-sm-6">
                        <span>🎥 | Open Browser Camera</span>
                    </button>
                </div>          
                <div class="file-select col-sm-12 row" v-if="!toggles.recordingStatus">
                    <label for="video_input" class="col-sm-6"><p>🎬 | Input Video / Camera App</p></label>
                    <input type="file" @change="inputVideoFile" id="video_input">
                </div>
                <div class="col-sm-12 row">
                    <button v-if="toggles.recordingStatus" @click="stopVideo"class="col-sm-6">🛑 | Stop Browser Camera</button>
                </div>                
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

            function frame(recordingStatus) {
                if (width < 100) {
                    width++;
                    barEl.style.width = width + '%'
                } else {
                    clearInterval(id)
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

.file-select {
    justify-content: center;
    height: 6em;
}   
    .file-select label {
        cursor: pointer;
        height: 100%;
        display: flex;
        justify-content: center;
        text-align: center;
        background-color: #374369;
        border-radius: 2em;
        text-align: center;
        
    } .file-select label p {
        margin: auto;
        text-align: center;
    }
    .file-select input {
        visibility: hidden;
        z-index: -2;
        position: absolute;
    }

div {
    /* font */
    font-family: Helvetica Neue;
    font-weight: bold;
    font-size: large;
    color: white;
    text-shadow: 2px 2px 4px #000000;

    text-align: center;
    justify-content: center;
}

button {
    /* font */
    font-family: Helvetica Neue;
    font-weight: bold;
    font-size: large;
    color: white;
    text-shadow: 2px 2px 4px #000000;
    text-align: center;

    background-color: #374369;
    border: none;
    border-radius: 2em;
    height: 6em;
    max-height: 10em;
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
    /* margin-left: 4vh; */
    max-width: 80%;
    margin: 0 0 0 0;
    padding: 0 0 0 0;
    overflow: hidden;
    display:block
}
.video-container {
    max-width: 100%;
    max-height: 30em;
    overflow: hidden;
    display:block;
    background-color: black;
}
.media-video {
    justify-self: center;
    max-width: 100%;
    height: 20em;
    background-color: #242424;
    -webkit-transform: scaleX(-0.5);
    transform: scaleX(-1);
}
.replay-video {
    justify-self: center;
    max-width: 100%;
    max-height: 20em;
    /* height: 360px; */
    background-color: #242424;
}
.media-canvas {
    justify-self: center;
    position: absolute;
    top: 0;
    overflow: hidden;
}

.hidden {
    visibility: hidden;
}


</style>
