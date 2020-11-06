<template>
  <div class="app">
    <div class="row app-cards">
      <h1 class="col-sm-12">Registration</h1>
      <div class="col-sm-12 app-card">
        <h2>Isi Data Anda</h2>
        <p>Capture foto wajah</p>
        <image-capture @userPhoto="$_ImageCapture_ReceiveImage"></image-capture>
      </div>
      <RegistrationRequestCard
        :payloadUsername="payloadData.username"
        :payloadCluster="payloadData.cluster"
        :payloadClientId="payloadData.client_id"
        :payloadUserId="payloadData.user_id"
        :fnGenerateUserId="makeUser_id"
        :paramApi="apiInferencing"
      ></RegistrationRequestCard>
      <RegistrationResponseCard></RegistrationResponseCard>

      <div class="upload-section">
        <button
          v-if="payloadData.cluster == 0 || payloadData.username == 0"
          title="ISI SEMUA INFORMASI terlebih dahulu"
          disabled
        >
          UPLOAD
        </button>
        <button
          v-if="payloadData.cluster != 0 && payloadData.username != 0"
          v-on:click="uploadImgInference"
        >
          UPLOAD
        </button>
      </div>
    </div>
    <div class="photo-compare row">
      <div class="col-md-6 row">
        <span class="col-sm-12">Nama: </span>
        <input type="text" v-model="payloadData.username" class="col-sm-11" />
      </div>

      <div class="col-md-6 row">
        <span class="col-sm-12">cluster_id: </span>
        <input type="text" v-model="payloadData.cluster" class="col-sm-11" />
      </div>

      <div class="col-md-6 row">
        <span class="col-sm-12">client_id: </span>
        <input type="text" v-model="payloadData.client_id" class="col-sm-11" />
      </div>

      <div class="col-md-6 row">
        <span class="col-sm-12">user_id: </span>
        <input
          type="text"
          v-model.lazy="payloadData.user_id"
          class="col-sm-7"
        />
        <b-button @click="makeUser_id" class="col-sm-5"
          >Generate User_ID</b-button
        >
      </div>

      <!-- Di sini bisa diganti dengan apa pun cluster yang disediakan oleh api_fr -->
      <div class="col-md-6 row" style="margin: auto">
        <!-- <span class="col-md-12">cluster_id: </span>
                <select v-model.lazy="payloadData.cluster" class="col-md-12">
                    <option v-for="regions in regionList" :key="regions">{{regions}}</option>
                </select> -->

        <b-button
          v-b-toggle.collapse-2
          variant="primary"
          class="col-sm-12"
          ref="client_idButton"
        >
          Input a custom client_id
        </b-button>

        <b-collapse id="collapse-2" class="col-sm-12">
          <span class="col-md-12">custom client_id: </span>
          <input
            type="text"
            v-model.lazy="payloadData.client_id"
            class="col-sm-12"
          />
        </b-collapse>
      </div>

      <div class="col-md-6 row" style="margin: auto">
        <!-- <span class="col-md-12">API List: </span>
                <select v-model.lazy="apiInferencing" class="col-md-12">
                    <option v-for="routes in recognizeRouteList" :key="routes">{{routes}}</option>
                </select> -->

        <b-button
          v-b-toggle.collapse-3
          variant="primary"
          class="col-sm-12"
          ref="client_idButton"
        >
          Input a custom API
        </b-button>

        <b-collapse id="collapse-3" class="col-sm-12">
          <span class="col-md-12">Custom API: </span>
          <input type="text" v-model.lazy="apiInferencing" class="col-sm-12" />
        </b-collapse>
      </div>

      <!-- INI ISINYA PREVIEW IMG dari object "displayObjects.images_in",
            DAN JUGA BUTTON UNTUK ORANG MASUKKIN FILE ke "image_base64"-->
      <div class="photo-card col-md-6">
        <div class="photo-section">
          <div class="photo">
            <img
              v-bind:src="displayObjects.placeholder_img"
              v-show="!displayObjects.images_in.length"
            />
            <img
              v-bind:src="displayObjects.images_in"
              v-show="displayObjects.images_in.length"
            />
          </div>
        </div>

        <div class="file-select">
          <label for="file_in">add photo</label>
          <input type="file" v-on:change="inputImageFile" id="file_in" />
        </div>
      </div>
    </div>

    <!-- INI ISINYA RESPONSE JSON DARI SERVER
        YAITU "response" & "conf_level" -->
    <div class="response-area">
      <div class="column">
        <p>Raw Response: {{ responseData.raw_data }}</p>
      </div>
    </div>

    <div class="upload-section">
      <button
        v-if="payloadData.cluster == 0 || payloadData.username == 0"
        title="ISI SEMUA INFORMASI terlebih dahulu"
        disabled
      >
        UPLOAD
      </button>
      <button
        v-if="payloadData.cluster != 0 && payloadData.username != 0"
        v-on:click="uploadImgInference"
      >
        UPLOAD
      </button>
    </div>

    <div class="webcam-toggle row">
      <!-- Toggle Webcam -->
      <b-button
        v-b-toggle.collapse-1
        variant="primary"
        v-on:click="setWebcamStatusToBus"
        class="col-sm-12"
        ref="test_button"
      >
        Toggle Webcam
      </b-button>

      <b-collapse id="collapse-1" class="mt-2 row">
        <webcam-capture
          class="webcam-area col-sm-12"
          v-if="conditionals.webcam_in"
        ></webcam-capture>
      </b-collapse>
    </div>
  </div>
</template>

<script>
// IMPORT COMPONENTS
import Vue from "vue";
import { bus } from "@/main";

import ImageCapture from "@/components/LivenessDemo/ImageCapture.vue";
import RegistrationRequestCard from "@/components/RegistrationRequestCard.vue";
import RegistrationResponseCard from "@/components/RegistrationResponseCard.vue";

// mixins imports
import TransactionID from "@/mixins/services/state/TransactionID";
import Timestamp from "@/mixins/services/state/Timestamp";
import WebcamCapture from "@/components/Camera/WebcamInput.vue";

// 3rd party library imports
import axios from "axios";
import VueAxios from "vue-axios";
Vue.use(VueAxios, axios);

// regionList.json isinya region2 / database tempat registrasi
// import regionJSON from '../../public/clusters.json'
import recognizeRouteJSON from "@/GeneralComponents/registerRouteList.json";

// IMAGE ASSETS
import placeholder_img from "@/assets/avatar_default.png";

export default {
  mixins: [TransactionID, Timestamp],
  components: {
    "image-capture": ImageCapture,
    "webcam-capture": WebcamCapture,
    RegistrationRequestCard,
    RegistrationResponseCard,
  },
  data() {
    return {
      clustersJSON: "https://riset.luqmanr.xyz/absensi_frontend/clusters.json",
      apiInferencing: "https://riset.luqmanr.xyz/api_fr/v3/registerimage", // apiEndpoint untuk melakukan inferencing
      apiLocalSaveImg: "", // kalau mau save image locally, juga bisa dibikin api local
      displayObjects: {
        images_in: [],
        placeholder_img: placeholder_img,
      },
      payloadData: {
        user_id: "", // mungkin secara database frontend, ini untuk mengindentifikasi user apa saja yang sudah di-register, format 9 numbers / "nnnnnnnn"
        username: "", // isi nama yang ingin didaftarkan
        image_base64: [],
        cluster: "",
        client_id: "",
      },
      responseData: {
        response_name: "", // nama yang akan dibalikkan oleh backend recognition. format = "return"."user_name":"String"
        response_confidence: "", // confidence level nama yang direturn oleh backend. format = "return"."confidence_level":"String (Float)"
        user_id_rkb: "", // random hash 16 digit. format = "return"."user_id_rkb":"nnnn-nnnn-nnnn-nnnn"
        response_status: "", // kalau berhasil recognition, format = "status": 0
        response_error: "", // kalau no face found, format = "error_message":"CORE ERROR - Face not found"
        masker_status: "", // if there is mask detected = "true"
        raw_data: "",
      },
      conditionals: {
        webcam_in: false,
      },
      response: {
        status: [],
        conf_level: [],
      },
      side_select: undefined,
      selected: undefined,
      regionList: [],
    };
  },
  methods: {
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
        this.displayObjects.images_in = image;
        this.payloadData.image_base64 = image.split(",")[1];
      };
      reader.readAsDataURL(file);
    },
    uploadImgInference() {
      if (!this.displayObjects.images_in.length) {
        alert("Please Insert Two Images");
        return;
      }
      this.response.status = "uploading, please wait";

      const photoPayload = {
        trx_id: this.$_TransactionID_transactionID,
        user_id: this.payloadData.user_id,
        user_name: this.payloadData.username,
        user_image: this.payloadData.image_base64,
        client_id: this.payloadData.client_id,
        cluster_id: this.payloadData.cluster,
        timestamp: this.$_Timestamp_timestamp,
      };
      console.log(photoPayload);

      // var apiEndPoint = 'dummy'
      var apiEndpoint = this.apiInferencing;

      axios
        .post(
          apiEndpoint,
          JSON.stringify(photoPayload),
          { headers: { "Content-Type": "application/json" } },
          { timeout: 10 }
        )
        .then((data) => {
          console.log(data.data);
          this.responseData.raw_data = data.data;
          if (data.data.status == 0) {
            this.responseData.response_status = "SUCCESSFULLY REGISTERED";
          }
        })
        .catch((error) => {
          console.log(error.response.data.error_message);
          this.responseData.raw_data = "NOT REGISTERED, PLEASE RETRY";
        });

      alert("images uploaded");
    },
    makeUser_id() {
      var characters = "0123456789";
      var charactersLength = characters.length;
      var user_id = "";

      for (var i = 0; i < 9; i++) {
        user_id += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }

      this.payloadData.user_id = user_id;
      console.log(this.payloadData.user_id);
    },
    receiveSnapshotFromBus() {
      bus.$on("getSnapshot", (image) => {
        // ini fungsi yang menerima snapshot dari webcam
        this.displayObjects.images_in = image;
        this.payloadData.image_base64 = image.split(",")[1];
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
    fetchURL() {
      var url = window.location.origin + "/absensi/clusters.json";

      this.clustersJSON = url;
    },
    fetchClusters() {
      this.fetchURL();
      axios.get(this.clustersJSON).then((regionJSON) => {
        this.regionList = regionJSON.data.cluster;
        this.payloadData.cluster = this.regionList[0];
        this.payloadData.client_id = this.regionList[0];
        console.log(this.payloadData);
      });
    },
  },
  computed: {
    // regionList() {
    //     return regionJSON.cluster.map((regions) => {
    //         return regions
    //     })
    // },
    recognizeRouteList() {
      return recognizeRouteJSON.routes.map((routes) => {
        return routes;
      });
    },
    payloadCluster() {
      return this.payloadData.cluster;
    },
  },
  beforeDestroy() {},
  created() {
    this.fetchClusters();
    this.receiveSnapshotFromBus();
    this.receiveDestroyCommand();
    this.$_TransactionID_GenerateTransactionID();
    this.$_Timestamp_GenerateTimestamp();
    this.makeUser_id();
  },
  watch: {
    payloadCluster(e) {
      if (e) {
        this.payloadData.client_id = this.payloadData.cluster;
      }
    },
  },
};
</script>

<style scoped>
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