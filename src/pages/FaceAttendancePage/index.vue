<template>
    <div class="app">
      <div class="row app-cards">
        <h1 class="col-sm-12">Absensi Page</h1>
  
        <!-- START instructions -->
        <p class="col-md-12 row" style="margin: auto">INSTRUKSI:</p>
        <p class="instruction-part col-sm-12">
          <span class="instruction-text"
            >1. Ambil foto muka Anda dengan menekan tombol CAPTURE FOTO</span
          >
        </p>
        <p class="instruction-part col-sm-12">
          <span class="instruction-text">2. Tekan tombol UPLOAD</span>
        </p>
        <p class="instruction-part col-sm-12">
          <span class="instruction-text"
            >3. Lihat hasil Pengenalan Wajah Anda!</span
          >
        </p>
        <!-- END instructions -->
  
        <div class="col-sm-12 app-card">
          <h2>Isi Data Anda</h2>
          <p>Capture foto wajah</p>
          <image-capture @userPhoto="$_ImageCapture_ReceiveImage"></image-capture>
        </div>
  
        <!-- Upload Option Card -->
        <div class="col-sm-12 app-card">
          <h2>Upload</h2>
          <div style="margin-top: 30px">
            <span class="col-md-6" style="color: white; margin: 5vh 0vw 0vh 0vw"
              >Kelas/Region/Cluster:
            </span>
            <select
              v-model.lazy="payloadData.cluster"
              class="col-md-6"
              style="margin: 0vh 0vw 5vh 0vw"
            >
              <option v-for="regions in regionList" :key="regions">
                {{ regions }}
              </option>
            </select>
          </div>
          <geolocation
            @getGeoLocation="updateGeoLocation($event)"
            style="color: red"
          ></geolocation>
          <button
            v-if="payloadData.image_base64 == null"
            title="Pilih instansi terlebih dahulu"
            disabled>
            UPLOAD
          </button>
          <button v-if="payloadData.image_base64 != null" @click="uploadImgInference(); CheckLiveness();">UPLOAD</button>
        </div>
  
        <AbsensiResponseCard
          :userName="responseData.user_name"
          :userID="responseData.user_id"
          :confidenceLevel="responseData.confidence_level"
          :timestamp="responseData.timestamp"
          :maskerStatus="responseData.masker_status"
          :responseError="responseData.response_error"
          :latitude="userLocation.latitude"
          :longitude="userLocation.longitude"
        ></AbsensiResponseCard>

        <LivenessResponseCard
          :livenessResponses="livenessResponses"
          :timeData="timeData"
        ></LivenessResponseCard>
  
        <!-- Feedback Card -->
        <div class="col-sm-12 app-card">
          <h2>Feedback</h2>
  
          <div class="col-md-6 row" style="margin-top: 30px">
            <span class="col-md-12" style="color: white"
              >Apakah hasil Pengenalan Wajah Anda benar?
            </span>
            <select
              v-model.lazy="feedbackData.recognition_status"
              class="col-md-12"
            >
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
  
          <div class="col-md-6 row" style="margin-top: 30px">
            <span class="col-sm-12" style="color: white"
              >Additional Feedback
            </span>
            <input
              type="text"
              v-model="feedbackData.additional_comments"
              class="col-sm-12"
            />
          </div>
  
          <button @click="logFeedback()" style="margin-top: 30px">
            SUBMIT FEEDBACK
          </button>
        </div>
      </div>
  
    </div>
  </template>
  
  <script>
  // IMPORT COMPONENTS
  import Vue from "vue";
  import { bus } from "@/main";
  
  import ImageCapture from "@/components/LivenessDemo/ImageCapture.vue";
  import AbsensiResponseCard from "@/components/AbsensiResponseCard.vue";
  import LivenessResponseCard from "@/components/LivenessResponseCard.vue";
  
  // mixins imports
  import TransactionID from "@/mixins/services/state/TransactionID";
  import Timestamp from "@/mixins/services/state/Timestamp";
  import GeoLocation from "@/GeneralComponents/GeoLocation.vue";
  
  // regionList.json isinya region2 / database tempat registrasi
  // import regionJSON from '../../public/clusters.json'
  import recognizeRouteJSON from "@/GeneralComponents/recognizeRouteList.json";
  
  import AttendanceCard from "@/cards/FaceAttendanceCards/AttendanceCard.vue";
  
  // 3rd party library imports
  import axios from "axios";
  import VueAxios from "vue-axios";
  Vue.use(VueAxios, axios);
  
  // IMAGE ASSETS
  import placeholder_img from "@/assets/avatar_default.png";
  
  export default {
    mixins: [TransactionID, Timestamp],
    components: {
      geolocation: GeoLocation,
      "attendance-card": AttendanceCard,
      "image-capture": ImageCapture,
      AbsensiResponseCard,
      LivenessResponseCard
    },
    data() {
      return {
        clustersJSON: "",
        apiInferencing: "https://riset.luqmanr.xyz/api_fr/v3/recognizemask",
        livenessAPI: "https://riset.luqmanr.xyz/riset_ai/liveness-verification/v1.3",
        apiAbsensiLog: [
          "https://absensi.indocisc.com/AbsensiLog.php?",
          "https://portal.luqmanr.xyz/absensi-log/AbsensiLog.php?",
        ],
        apiLogApache: "https://absensi.indocisc.com/done.html?",
        apiFeedbackLog: "https://absensi.indocisc.com/FeedbackLog.php?",
        apiLocalSaveImg: "", // kalau mau save image locally, juga bisa dibikin api local
        displayObjects: {
          preview_image: [],
          input_image: [],
          image_height: undefined,
          image_width: undefined,
          placeholder_img: placeholder_img,
        },
        rotatedObjects: {
          image_height: undefined,
          image_width: undefined,
        },
        payloadData: {
          image_base64: null,
          cluster: "",
          client_id: "",
        },
        responseData: {
          user_name: "Please Insert Your Photo", // nama yang akan dibalikkan oleh backend recognition. format = "return"."user_name":"String"
          confidence_level: "0.0%", // confidence level nama yang direturn oleh backend. format = "return"."confidence_level":"String (Float)"
          user_id: "", // random hash 16 digit. format = "return"."user_id":"nnnn-nnnn-nnnn-nnnn"
          status: "Please Insert Your Photo", // kalau berhasil recognition, format = "status": 0
          response_error: "None", // kalau no face found, format = "error_message":"CORE ERROR - Face not found"
          masker_status: "None", // if there is mask detected = "true"
          timestamp: "",
          raw_data: "",
        },
        livenessResponses: {
          status: "-",
          angle: {
            pitch: "-",
            yaw: "-"
          }
        },
        timeData: {},
        feedbackData: {
          recogniton_status: "True",
          additional_comments: "",
        },
        conditionals: {
          webcam_in: false,
          resizedImageStatus: false,
        },
        side_select: undefined,
        selected: undefined,
        userLocation: {
          latitude: "",
          longitude: "",
        },
        regionList: [],
      };
    },
    methods: {
      $_ImageCapture_ReceiveImage(image) {
        console.log("$_ImageCapture_ReceiveImage", "image received");
        this.payloadData.image_base64 = image.split(",")[1];
      },
      $_AttendanceCard_ReceiveImage(image) {
        this.displayObjects.preview_image = image;
        this.displayObjects.input_image = image;
        this.payloadData.image_base64 = image.split(",")[1];
      },
      checkPayloadData() {
        const photoPayload = {
          trx_id: this.$_TransactionID_transactionID,
          user_image: this.payloadData.image_base64,
          client_id: this.payloadData.client_id,
          cluster_id: this.payloadData.cluster,
          timestamp: this.$_Timestamp_timestamp,
        };
        // console.log(photoPayload)
        var jsontest = JSON.parse(JSON.stringify(this.timestamp)); // method 1
        // var jsontest = Object.assign({}, this.timestamp)         // method 2
        console.log(jsontest);
      },
      // KUMPULAN METHOD UNTUK UPLOAD IMAGE DARI KOMPUTER
      inputImageFile(e) {
        const files = e.target.files;
        const file = files[0];
  
        if (!file.type.match("image.*")) {
          alert("Please insert an image file");
          return;
        }
  
        const reader = new FileReader();
        reader.onload = (e) => {
          var image = e.target.result;
          this.displayObjects.input_image = image;
        };
        reader.readAsDataURL(file);
      },
      resizeCanvas() {
        return new Promise((resolve, reject) => {
          var imageObj = new Image();
          imageObj.onload = (e) => {
            // process resized canvas
            if (imageObj.height > 1280) {
              this.displayObjects.image_height = 1280;
              this.displayObjects.image_width = (
                (1280 / imageObj.height) *
                imageObj.width
              ).toFixed(0); // float to int
            } else if (imageObj.width > 720) {
              this.displayObjects.image_width = 720;
              this.displayObjects.image_height = (
                (720 / imageObj.width) *
                imageObj.height
              ).toFixed(0); // float to int
            } else {
              this.displayObjects.image_width = imageObj.width;
              this.displayObjects.image_height = imageObj.height;
            }
  
            // process rotated canvas
            if (
              this.displayObjects.image_width > this.displayObjects.image_height
            ) {
              this.rotatedObjects.image_width = this.displayObjects.image_width;
              this.rotatedObjects.image_height = this.displayObjects.image_width;
            } else {
              this.rotatedObjects.image_width = this.displayObjects.image_height;
              this.rotatedObjects.image_height = this.displayObjects.image_height;
            }
          };
          imageObj.src = this.displayObjects.input_image;
          resolve("success");
        });
      },
      resizeImage() {
        const canvas = this.$refs.resized_image;
        var context = canvas.getContext("2d");
  
        var imageObj = new Image();
        imageObj.onload = (e) => {
          context.drawImage(
            imageObj,
            0,
            0,
            this.displayObjects.image_width,
            this.displayObjects.image_height
          );
          var resized_image = canvas.toDataURL();
          this.displayObjects.preview_image = resized_image;
          this.payloadData.image_base64 = resized_image.split(",")[1];
        };
        imageObj.src = this.displayObjects.input_image;
      },
      rotateImage() {
        const canvas = this.$refs.rotated_image;
        var context = canvas.getContext("2d");
  
        var canvas_width = this.rotatedObjects.image_width;
        var canvas_height = this.rotatedObjects.image_height;
  
        var imageObj = new Image();
        imageObj.onload = (e) => {
          // imageObj.style.transform = 'rotate(90deg)'
          context.translate(canvas_width * 0.5, canvas_height * 0.5);
          context.rotate((90 * Math.PI) / 180);
          context.translate(canvas_width * -0.5, canvas_height * -0.5);
          context.clearRect(0, 0, canvas_width, canvas_height);
          context.drawImage(
            imageObj,
            0,
            0,
            this.displayObjects.image_width,
            this.displayObjects.image_height
          );
  
          var rotated_image = canvas.toDataURL();
          this.displayObjects.preview_image = rotated_image;
          this.payloadData.image_base64 = rotated_image.split(",")[1];
        };
        imageObj.src = this.displayObjects.input_image;
      },
      uploadImgInference() {
        if (!this.payloadData.image_base64) {
          alert("Please Insert Images");
          return;
        }
  
        const photoPayload = {
          trx_id:     this.$_TransactionID_transactionID,
          user_image: this.payloadData.image_base64,
          client_id:  this.payloadData.client_id,
          cluster_id: this.payloadData.cluster,
          timestamp:  this.$_Timestamp_timestamp,
        };
        console.log(photoPayload);
  
        // var apiEndPoint = 'dummy'
        var apiEndPoint = this.apiInferencing;
  
        axios.post(
            apiEndPoint,
            JSON.stringify(photoPayload),
            { headers: { "Content-Type": "application/json" } },
            { timeout: 5000 }
          )
          .then((response) => {
            console.log("SUCCESSFUL DATA MESSAGE");
            console.log(response);
            try {
              console.log("updating UI");
              this.responseData.user_name = response.data.return[0].user_name;
              this.responseData.confidence_level =
                (
                  parseFloat(response.data.return[0].confidence_level) * 100.0
                ).toFixed(2) + "%";
              this.responseData.user_id = response.data.return[0].user_id;
              this.responseData.status = response.status;
              this.responseData.masker_status = response.data.return[0].masker;
              this.responseData.response_error = "";
              this.responseData.timestamp = this.$_Timestamp_timestamp;
            } catch {
              console.log("updating error message");
              this.responseData.user_name = "";
              this.responseData.confidence_level = "";
              this.responseData.user_id = "";
              this.responseData.status = "";
              this.responseData.masker_status = "";
              this.responseData.response_error = response.data.error_message;
            }
  
            this.logAbsensiLog();
          })
          .catch((error) => {
            try {
              console.log("ERROR MESSAGE");
              console.log(error.response.data);
              this.responseData.user_name = "";
              this.responseData.confidence_level = "";
              this.responseData.user_id = "";
              this.responseData.status = "";
              this.responseData.masker_status = "";
              this.responseData.response_error =
                error.response.data.error_message;
            } catch {
              this.responseData.response_error = "ERROR, CHECK BROWSER CONSOLE";
            }
  
            this.logAbsensiLog();
          });
  
        alert(
          "images uploading... " +
          " please wait for your recognition status"
        );
      },
      CheckLiveness() {
        const payload = {
          user_image:   this.payloadData.image_base64,
          pattern:      "spoof",
          trx_id:       this.$_TransactionID_transactionID,
          client_id:    this.payloadData.client_id,
          client_token: ""
        }
        console.log(payload)

        this.axios.interceptors.request.use( x => {
          x.meta = x.meta || {}
          x.meta.requestStartedAt = new Date().getTime();
          return x
        })

        this.axios.interceptors.response.use( x => {
          x.responseTime = new Date().getTime() - x.config.meta.beginTimer;
          return x
        })

        this.axios.post(
          this.livenessAPI,
          JSON.stringify(payload),
          { headers : { 'Content-Type': 'application/json' } }
        )
        .then((response) => {
          console.log(response)
          this.livenessResponses = response.data.liveness
          this.timeData.api = response.data.time.liveness
          this.timeData.frontEnd = (new Date().getTime() - response.config.meta.requestStartedAt) / 1000
          if (response.data.error_message != "None") {
            this.livenessResponses.status = response.data.error_message
            this.livenessResponses.angle = "-"
          }
        })
        .catch((error) => {
          console.log(error)
          this.livenessResponses = {}
          this.livenessResponses.status = "Status 404 - API Not Available"
          this.timeData.api = response.data.time.liveness
          this.timeData.frontEnd = (new Date().getTime() - response.config.meta.requestStartedAt) / 1000
        })
      },
      logAbsensiLog() {
        var apiEndPoints = this.apiAbsensiLog;
  
        var client_id = "client_id=" + encodeURI(this.payloadData.cluster);
        // var client_id = "client_id=indocisc"
        var user_name = "user_name=" + encodeURI(this.responseData.user_name);
        var user_id = "user_id=" + encodeURI(this.responseData.user_id);
        var confidence_level =
          "confidence_level=" + encodeURI(this.responseData.confidence_level);
        var trx_id = "trx_id=" + encodeURI(this.$_TransactionID_transactionID);
        var timestamp = "timestamp=" + encodeURI(this.$_Timestamp_timestamp);
        var query =
          client_id +
          "&" +
          user_name +
          "&" +
          user_id +
          "&" +
          confidence_level +
          "&" +
          trx_id +
          "&" +
          timestamp;
  
        var i;
        for (i = 0; i < apiEndPoints.length; i++) {
          console.log(apiEndPoints[i] + query);
          axios.get(apiEndPoints[i] + query).then((response) => {
            console.log(response);
          });
        }
      },
      logFeedback() {
        var apiEndPoint = this.apiFeedbackLog;
  
        var client_id = "client_id=" + encodeURI(this.payloadData.cluster);
        var user_id = "user_id=" + encodeURI(this.responseData.user_id);
        var recognition_status =
          "recognition_status=" + encodeURI(this.feedbackData.recognition_status);
        var additional_comments =
          "additional_comments=" +
          encodeURI(this.feedbackData.additional_comments);
        var trx_id = "trx_id=" + encodeURI(this.$_TransactionID_transactionID);
        var timestamp = "timestamp=" + encodeURI(this.$_Timestamp_timestamp);
  
        var feedbackData =
          apiEndPoint +
          client_id +
          "&" +
          user_id +
          "&" +
          recognition_status +
          "&" +
          additional_comments +
          "&" +
          trx_id +
          "&" +
          timestamp;
  
        axios.get(feedbackData).then((response) => {
          console.log(response);
        });
        alert("Thank You for your feedback!");
      },
      receiveSnapshotFromBus() {
        bus.$on("getSnapshot", (image) => {
          // ini fungsi yang menerima snapshot dari webcam
          this.displayObjects.input_image = image;
          this.payloadData.image_base64 = image.split(",")[1];
          // console.log("image received= ",image)
        });
      },
      receiveDestroyCommand() {
        bus.$on("getDestroyCommand", (status) => {
          console.log(status);
          this.$refs.test_button.click();
        });
      },
      setWebcamStatusToBus() {
        this.conditionals.webcam_in = !this.conditionals.webcam_in;
        bus.$emit("setWebcamStatus", this.conditionals.webcam_in);
      },
      updateGeoLocation(e) {
        this.userLocation = e;
        console.log(e);
      },
      fetchURL() {
        var url = window.location.origin + "/absensi/clusters.json";
  
        this.clustersJSON = url;
      },
      fetchClusters() {
        // this.fetchURL()
        axios.get("./clusters.json").then((regionJSON) => {
          this.regionList = regionJSON.data.cluster;
          this.payloadData.cluster = this.regionList[0];
          this.payloadData.client_id = this.regionList[0];
        });
      },
    },
    computed: {
      recognizeRouteList() {
        return recognizeRouteJSON.routes.map((routes) => {
          return routes;
        });
      },
      responseDataComputed() {},
      inputImage() {
        return this.displayObjects.input_image;
      },
      payloadCluster() {
        return this.payloadData.cluster;
      },
      resizedImageStatus() {
        return this.conditionals.resizedImageStatus;
      },
      LoginState() {
        return this.$store.getters.getCurrentLoginState;
      },
    },
    watch: {
      // inputImage: function(e) {
      //     if (e) {
      //         this.resizeCanvas()
      //           .then(this.resizeImage())
      //     }
      // },
      payloadCluster(e) {
        if (e) {
          this.payloadData.client_id = this.payloadData.cluster;
        }
      },
    },
    beforeDestroy() {},
    created() {
      this.fetchClusters();
      this.receiveSnapshotFromBus();
      this.receiveDestroyCommand();
      this.$_TransactionID_GenerateTransactionID();
      this.$_Timestamp_GenerateTimestamp();
    },
    mounted() {},
    updated() {},
  };
  </script>
  
  <style scoped>
  p {
    margin: 0vh 0vw 0.2vh 0vw;
  }
  
  .title {
    font-size: 5vh;
    color: white;
  }
  
  .photo-compare {
    color: white;
    /* background-color: dodgerblue; */
    border-radius: 20px;
    padding: 2vh 2vw 0vh 2vw;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .webcam-toggle {
    color: white;
    /* background-color: dodgerblue; */
    border-radius: 20px;
    padding: 2vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .photo-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .webcam-area {
    /* padding-left: 5vw; */
    text-align: center;
    display: inline-block;
  }
  
  .photo {
    width: 200px;
    height: 200px;
    overflow: hidden;
    border-radius: 10px;
    margin: auto;
    display: flex;
    align-content: center;
    align-items: center;
    align-self: center;
    box-shadow: 2px 5px 25px black;
  }
  .photo img {
    /* max-height: 200px; */
    max-width: 200px;
  }
  
  .file-select {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 1vh;
  }
  .file-select label {
    border-radius: 4px;
    background: white;
    color: indianred;
    width: 15vh;
    position: relative;
    align-items: center;
    cursor: pointer;
    justify-content: center;
    align-content: center;
  }
  .file-select input {
    opacity: 0;
    z-index: -2;
  }
  
  .upload-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /* padding: 2vh; */
  }
  
  .response-area {
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /* padding: 2vh; */
  }
  
  .highlighted {
    background-color: white;
  }
  
  /* Styles copied from LivenessDemoPage */
  .app {
    padding: 2em;
  }
  .app-card {
    background: #242e4e;
    border-radius: 3em;
  
    padding: 3vh 5vw;
    margin: 1em 0em 1em 0em;
  
    max-width: 100vw;
  }
  
  p {
    font-family: Helvetica Neue Regular;
  }
  </style>
  