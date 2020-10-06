<template>
    <div class="container">
        <div class="large-12 medium-12 small-12 cell">
        <label>File
            <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>
        </label>
        <br>
        <progress max="100" :value.prop="uploadPercentage"></progress>
        <br>
        <button v-on:click="submitFile()">Submit</button>
        </div>
    </div>
</template>

<script>

import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import * as faceapi from "face-api.js";

Vue.use(VueAxios, axios)

export default {
    data(){
        return {
          file: '',
          uploadPercentage: 0
        }
    },
}

</script>