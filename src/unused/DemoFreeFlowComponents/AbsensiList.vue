<template>

    <div class="main">
        <span style="color: white">List Terdaftar</span>
        
        <div class="row absensi-area">
            <div v-for="(person, index) in registeredJSON.reverse()" class="registered-card">
                <b-card
                    v-bind:img-src="'data:image/png;base64,' + person.image"
                    class="card-image">
                    <img v-bind:src="imageJSON">
                    <span>{{person.name}}</span>
                    <span>{{base64}}</span>
                    <span>{{index}}</span>
                    <b-card-text>
                        Selamat Datang
                    </b-card-text>
                </b-card>
            </div>
        </div>

        <!-- <span>{{base64JSON}}</span>
        <img v-bind:src="this.placeholder_img"> -->
        
    </div>

</template>

<script>

import { bus } from '../main';
import registered from '../apiUNTAR/data.json'

// IMAGE ASSETS
import placeholderImg from '../assets/avatar_default.png'
import placeholderImg2 from '../assets/logo.png'
  
export default {
    components: {

    },
    data() {
        return {
            placeholder_img: placeholderImg,
            placeholder_img2: placeholderImg2,
            base64: this.imageJSON(),
        }
    },
    computed: {
        registeredJSON() {
            return registered.data.map((person) => {
                return person
            })
        },
        imageJSON() {
            return registered.data.map((person) => {
                let base64 = 'data:image/png;base64,' + person.image
                // console.log(typeof person.image)
                // console.log(typeof base64)
                // var image = 'data:image/png;base64,' + person.image
                // console.log(person.image)
                // // return image
                return base64
            })
        },
    },
    methods: {
        readBase64() {

        }
    },
    created() {
        // this.readBase64()
    }
}

</script>

<style scoped>

.main {
    /* background-color: white; */
    padding: 0vh 1vh 1vh 5vh;
}


.absensi-area {
    /* background-color: dodgerblue; */
    /* position: absolute; */
    /* top: 63vh; */
    /* left:8%; */
    width:100%;
    padding: 0vh 0vh 0vh 0vh;
    margin-top: -5vh;
    justify-self: center;
}

.registered-card {
    font-size: 2vh;
    height: 25vh;
    width: 20vh;
    /* transform: scale(0.45); */
    justify-self: center;
    margin: 5% 1% 1% 1%;
    padding: 0vh 0vh 0vh 0vh;
    /* overflow: hidden; */
}

b-card {
    /* font-size: 2vh; */
}

.card-body {
    padding: 1vh 1vh 1vh 1vh;
    font-size: 3vh;
}

.card-image {
    /* height: 25vh; */
    /* width: 25vh; */
    overflow: hidden;
}
</style>
