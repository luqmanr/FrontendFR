<template>

    <div>

        <form v-if="!submitted">
            <label>Nama</label>
            <input type="text" v-model.lazy="biodata.name" required />
            <label>NIS</label>
            <input type="number" v-model.lazy="biodata.nis" required />
        </form>

        <div class="col-md-5">
            <label for="file_in">Pilih File .txt</label>
            <input type="file" v-on:change="addTxtFile" id="file_in" class="file-input">
        </div>
        
        {{txt_fileName}}

        <div v-if="submitted">
            <h3>Thank you for posting</h3>
        </div>
        
        <div>
            <button v-on:click.prevent="post">Unggah</button>
        </div>

    </div>

</template>

<script>

import { bus } from '../main';

export default {
    components: {

    },
    data() {
        return {
            biodata: {
                name: "",
                nis: {
                    type: Number
                }
            },
            txt_file: null,
            txt_fileName: "",
            submitted: false
        }
    },
    methods: {
        addTxtFile(e) {
            const test = e.target.files;
            this.txt_file = test;
            this.txt_fileName = this.txt_file[0].name;
        },
        post() {
            this.biodata.file = "dummy";
            this.$http.post('https://dashboard-face.firebaseio.com/posts.json', this.biodata ).then(function(data){
                console.log(data);
                this.submitted = true;
            });
        },
        postTxt() {
            // this.biodata.file = "dummy";v
            this.$http.post('gs://dashboard-face.appspot.com/', this.txt_file ).then(function(data){
                console.log(data);
                this.submitted = true;
            });
        }
        
    },
    created() {
        this.$http.get('https://jsonplaceholder.typicode.com/posts').then(function(data) {
        // console.log(data);
            this.blogs = data.body.slice(0,10);
        })
    }
}
</script>

<style>

.single-blog {
    padding: 2vh;
}

.file-input {
	width: 0.1px;
	height: 0.1px;
	opacity: 0;
	overflow: hidden;
	position: absolute;
	z-index: -1;
}

label {
    font-size: 1.25em;
    font-weight: 700;
    color: white;
    background-color: indianred;
    display: inline-block;
    border: 1vh solid indianred;
}

.file-input input {
    opacity: 0;
    z-index: -2;
}

input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0; 
}

</style>
