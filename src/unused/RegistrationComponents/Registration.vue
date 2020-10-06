<template>
    <div class="app">

        <!-- jika belum mengisi nama dan region, akan muncul instruksi ini -->
        <h5 
          v-if='this.payloadData.name == "" || this.payloadData.region == ""'
          style="margin-left: 2vh;">
            Isi NAMA dan CLIENT ID</h5>
        <!-- ketika sudah mengisi nama dan region, akan muncul instruksi ini -->
        <h5 
          v-if='this.payloadData.name && this.payloadData.region'
          style="margin-left: 2vh;">
            Tekan tombol "Record VIDEO"</h5>
        <!-- ketika sudah selesai dari awal sampai akhir registrasi, akan muncul tombol ini untuk me-refresh halaman -->
        <button
          v-if="this.uploadStatus"
          v-on:click="newRegister"
          style="align-self: right;">
            New Register</button> 

        <div class="form-input"> <!-- form ini bisa diubah sesuai dengan bentuk data yang perlu ditembak ke api -->
            <!-- Bagian isi nama -->
            <div class="row">
                <span class="col-sm-2">Nama: </span>
                <input type=text v-model.lazy="payloadData.name" class="col-sm-3">           
            </div>
            
            <!-- Di sini bisa diganti dengan apa pun region yang disediakan oleh api_fr -->
            <div class="row">
                <span class="col-sm-2">client_id: </span>
                <select v-model.lazy="payloadData.region" class="col-sm-3">
                    <option v-for="regions in regionList" :key="regions">{{regions}}</option>
                </select>
            </div>

            <div class="row">
                <span class="col-sm-2">user_id: (randomly generated)</span>
                <input type=text v-model.lazy="payloadData.user_id" class="col-sm-3" readonly="readonly">      
            </div>

            <div class='row'>
                <span class="col-sm-2">API List: </span>
                <select v-model.lazy="apiRegistration" class="col-sm-3">
                    <option v-for="routes in registerRouteList" :key="routes">{{routes}}</option>
                </select>
            </div>
        </div>

        <!-- Ini bagian aplikasi untuk merekam video registrasi -->
        <div class="registration-app row">
            <div class="video-app">
                <div class="video-container">
                    <!-- video window untuk feedback -->
                    <video class="media-video"
                           ref="videoDOM"
                           autoplay>
                    </video>
                    <!-- progress bar di bawah video window untuk menyatakan durasi video -->
                    <!-- javascript yang mengatur progress bar adalah fungsi progressBar() -->
                    <div id="myBar"
                         class="w3-container w3-green"
                         ref="progressBar"
                         style="height:24px;
                                width:1%;
                                background-color:dodgerblue"></div>
                </div>

                <!-- button memulai Rekaman Video, akan muncul ketika sudah mengisi payloadData.name dan payloadData.region -->
                <button v-if="!this.vidStatus && this.payloadData.name && this.payloadData.region" 
                        v-on:click="startVideo">Record VIDEO</button>
                <!-- jika payloadData.name dan payloadData.region masih kosong, akan muncul tombol ini, dalam kondisi disabled-->
                <button v-if='this.payloadData.name == "" || this.payloadData.region == ""' 
                        title="Isi NAMA dan MATA KULIAH terlebih dahulu" disabled>Record VIDEO</button>
                <!-- button untuk stop video recording mid-recording -->
                <button v-if="this.vidStatus" 
                        v-on:click="stopVideo">Stop VIDEO</button>
                <!-- jika video belum direkam, maka tombol Upload VIDEO akan di-disabled -->
                <button v-if="this.payloadData.videoBase64.length == 0" 
                        title="Rekam video terlebih dahulu" disabled>Upload VIDEO</button>
                <!-- jika video sudah selesai direkam, akan muncul tombol Upload VIDEO -->
                <button v-if="this.payloadData.videoBase64.length > 0" 
                        v-on:click="uploadVid">Upload VIDEO</button>
            </div>

            <!-- bagian video instruksi -->
            <div class="column"
                 style="padding: 3vh 0vh 0vh 5vh;
                        color: rgb(50,170,240);">
                <h5>Instruksi Registrasi</h5>
                <video src="../assets/registration-intructions/registration-instruction.mp4"
                    style="height: 256px; width: 256px;"
                    autoplay
                    loop></video>
            </div>
        </div>
        <!-- <progress max="100" :value.prop="uploadPercentage"></progress> -->
    </div>
</template>

<script>

import { bus } from '../main';

// regionList.json isinya region2 / database tempat registrasi
import regionJSON from '../GeneralComponents/regionList.json'
import registerRouteJSON from '../GeneralComponents/registerRouteList.json'

// LIBRARY IMPORTS
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

// IMAGE IMPORTS
import RegistrationVid from '../assets/registration-intructions/registration-instruction.mp4'

export default {
    name: 'VideoMediaCanvasStream',
    data() {
        return {
            apiRegistration: 'https://api.riset.ai/api_tablet/v1/registerimage', // set apiEndpoint yang ingin dituju
            apiLocalVideoSave: 'http://localhost:1251/capture_video',
            payloadData: { // satu lagi informasi yang diperlukan adalah payloadData.videoBase64, di-instantiate di bawah
                trx_id: "", // random generated string, seperti ini "ck5bec23-51f5-4c6e-aca5-ebd7115a8f40" / "8s-4s-4s-4s-12s"
                user_id: "", // mungkin secara database frontend, ini untuk mengindentifikasi user apa saja yang sudah di-register, format 9 numbers / "nnnnnnnn"
                name: "", // isi nama yang ingin didaftarkan
                region: "Trial", // isi region yang ingin didaftarkan dengan nama
                videoBase64: [], // recorderEl akan diisi oleh hasil recorder dari recorderEl (dalam bentuk base64 setelah di split)
                timestamp:"" // timestamp dengan format seperti ini "2020-05-13 09:43:26+0700" / "yyyy-mm-dd hh:mm:ss+tttt"
            },
            videoEl: {}, //  ini  akan jadi reference ke videoDOM, untuk diisi dengan video
            canvasEl: {}, // ini akan jadi reference ke canvasDOM, kalau mau crop atau menampilkan bounding box harus di-render di sini
            // theStream: undefined,
            recorderEl: undefined, // ini adalah element yang akan mereka mediaStream (video) untuk ditembak ke api
            videoConstraints: {
                audio: false, // false karena tidak perlu merekam suara
                video: {
                    width: {
                      min: 320, ideal: 1280, max: 1280 // setting resolusi rekaman video
                    },
                    height: {
                      min: 240, ideal: 720, max: 720 // setting resolusi rekaman video
                    },
                    frameRate: {
                      min: 5, ideal: 60, max: 60 // setting fps rekaman video
                    },
                }
            },
            timeInterval: 0, // lupa untuk apa, akan diganti kalau sudah ketemu fungsinya
            vidStatus: false, // flag / status true ketika video mulai di-stream, dan status false ketika video stop di-stream        
            uploadStatus: false, // flag, untuk ketika fungsi uploadVid() selesai upload ke api, akan jadi true
            registrationVid: RegistrationVid, // ini video instruksi cara registrasi
            // uploadPercentage: 0 // kalau mau ada feedback upload percentage, belum terpakai
        }
    },
    methods: {
        // MULAI AMBIL MEDIASTREAM, YAITU VIDEO
        async startVideo() {
            this.videoEl = this.$refs.videoDOM;
            this.canvasEl = this.$refs.canvasDOM;
            this.vidStatus = true;

            await navigator.mediaDevices
              .getUserMedia(this.videoConstraints)
                .then(this.getMediaStreamSuccess)
                .catch(this.getMediaStreamError);
        },
        getMediaStreamSuccess(stream) {
            window.stream = stream; // make stream available to browser console
            this.videoEl.srcObject = stream; // ini object yang akan kita rekam di recorder, dan ditampilkan kembali ke videoDOM
            // this.theStream = stream; 

            try {
                var recorder = new MediaRecorder(stream, {mimeType : "video/webm"});
                this.recorderEl = recorder;
            } catch (error) {
                console.error("Exception While creating MediaRecorder: " + error );
                return;
            }

            // ketika mediaStream & recorder muncul, akan memanggil fungsi ini
            recorder.ondataavailable = (event) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    // this.payloadData.videoBase64.push(event.target.result.split(',')[1]) // kalau mau bisa merekam beberapa video menjadi list[], pake .push()
                    this.payloadData.videoBase64 = event.target.result.split(',')[1] // di split dulu info wrappernya, jadi hanya pure base64 yang diambil
                }
                reader.readAsDataURL(event.data)
            };

            // ketika mediaStream & recorder berhenti, akan memanggil fungsi ini
            recorder.onstop = (event) => {
                var blobs = new Blob(this.payloadData.videoBase64)
                stream.getTracks().forEach(track => track.stop())
                this.vidStatus = false;
            };

            recorder.start(); // memanggil recorder untuk memulai recording video ketika mediaStream didapatkan
            this.progressBar() // update progress bar untuk mengindikasikan sisa durasi perekaman

            setTimeout(this.stopVideo, 10000) // ketika 10000 counts, maka video akan memanggil stopVideo() untuk menghentikan video
        },

        getMediaStreamError(error) { // kalau webcam tidak bisa dibuka, akan muncul error ini
            alert('Gagal buka webcam ' + error);
        },

        stopVideo() {
            this.recorderEl.stop();
            this.vidStatus = false;

            var barEl = this.$refs.progressBar;
            barEl.style.width = 100 + '%'

            clearInterval(this.timeInterval);

            // mengosongkan mediaStream, supaya tidak infinite loop
            if (typeof window.stream === "object") {
                this.videoEl.srcObject = null;
                window.stream.getTracks().forEach(track => track.stop());
            }

            return true
        },
        uploadVid() {
            const videoPayload = {
                "trx_id": this.payloadData.trx_id,
                "user_id": this.payloadData.user_id,
                "user_name": this.payloadData.name,
                "client_id": this.payloadData.region,
                "user_video": this.payloadData.videoBase64,
                "timestamp": this.payloadData.timestamp
            };
            console.log(videoPayload)

            // var apiEndPoint = 'dummy';
            var apiEndPoint = this.apiRegistration;
            
            axios.post(apiEndPoint,
              JSON.stringify(videoPayload),
              {
                headers: {
                      'Content-Type': 'application/json'
                },
                onUploadProgress: progressEvent => console.log(progressEvent.loaded)
                // onUploadProgress: function( progressEvent ) {
                //   this.uploadPercentage = parseInt( Math.round( ( progressEvent.loaded / progressEvent.total ) * 100 ))
                // }
              },
              {timeout: 10}
            ).then((data) => {
                    console.log(data)
                    // var dataStatus = data.data.status
                    // var status = data.status
                    // var statusText = data.statusText

                    // if (status == 200) {
                    //     this.uploadStatus == true
                    //     alert("Video upload successful")
                    //     location.reload();
                    // }
                    // else {
                    //     alert("Failed to upload, try again")
                    // }
                })
        },
        progressBar() {
            var barEl = this.$refs.progressBar;
            var id = setInterval(frame, 100);
            var width = 1;
            function frame() {
                if (width >= 100) {
                    clearInterval(id);
                } 
                else {
                    width++;
                    barEl.style.width = width + '%';
                }
            }
        },
        newRegister() { // kalau mau registrasi lagi, reload window supaya semua data dikosongkan
            location.reload();
        },
        download(blob) { // Testing supaya bisa mendownload video yang direkam tanpa harus pakai api python, belum berhasil
            let a = document.createElement('a');
            a.href = URL.createObjectURL(blob);

            a.download = 'recorded.webm';
            document.body.appendChild(a);
            a.click();
        },
        makeUser_id() {
            var characters = '0123456789';
            var charactersLength = characters.length;
            var user_id = '';

            for ( var i = 0; i < 9; i++ ) {
                user_id += characters.charAt(Math.floor(Math.random() * charactersLength));
            }

            this.payloadData.user_id = user_id
            console.log(this.payloadData.user_id)
        },
        makeTrx_id() { // generate random string, seperti ini "ck5bec23-51f5-4c6e-aca5-ebd7115a8f40" / "8s-4s-4s-4s-12s"
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            var eight = '';
            for ( var i = 0; i < 8; i++ ) {
                eight += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            var four_one = '';
            for ( var i = 0; i < 4; i++ ) {
                four_one += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            var four_two = '';
            for ( var i = 0; i < 4; i++ ) {
                four_two += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            var four_three = '';
            for ( var i = 0; i < 4; i++ ) {
                four_three += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            var twelve = '';
            for ( var i = 0; i < 12; i++ ) {
                twelve += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            var trx_id = ''.concat(eight, '-', four_one, '-', four_two, '-', four_three, '-', twelve);

            this.payloadData.trx_id = trx_id;
            console.log(this.payloadData.trx_id)
        },
        makeTimestamp() { // generate timestamp dengan format seperti ini "2020-05-13 09:43:26+0700" / "yyyy-mm-dd hh:mm:ss+tttt"
            var currentDate = new Date();
            var date = ('0' + currentDate.getDate()).slice(-2);
            var month = ('0' + (currentDate.getMonth()+1)).slice(-2); //Be careful! January is 0 not 1
            var year = currentDate.getFullYear();
            var hours = ('0' + currentDate.getHours()).slice(-2);
            var minutes = ('0' + currentDate.getMinutes()).slice(-2);
            var seconds = ('0' + currentDate.getSeconds()).slice(-2);
            var clock = hours + ":" +  minutes + ":" +  seconds;
            var timezone = '+0700'
            var dateString = year + "-" + month + "-" + date + " " + clock + timezone;

            this.payloadData.timestamp = dateString
            console.log(this.payloadData.timestamp)
        }
    },
    computed: {
        regionList() {
            return regionJSON.regions.map((regions) => {
                return regions
            })
        },
        registerRouteList() {
            return registerRouteJSON.routes.map((routes) => {
                return routes
            })
        },
    },
    beforeDestroy() {
        this.stopVideo();
    },
    created() {
        this.makeUser_id();
        this.makeTrx_id();
        this.makeTimestamp();
    },
    mounted() {
 
    }
}
</script>

<style scoped>
h5 {
    padding: 0vh 0vh 0vh 0vh;
    margin: 0vh 0vh 0vh 0vh;
}
.app {
    padding: 1% 2% 2% 2%;
    background-color: white;
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
}
.media-canvas {
    justify-self: center;
    position: absolute;
    top: 0;
    overflow: hidden;
}
</style>
