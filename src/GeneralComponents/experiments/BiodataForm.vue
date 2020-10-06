<template>

    <div>

        <form v-if="!submitted">
            <label>Nama</label>
            <input type="text" v-model.lazy="biodata.name" required />
            <label>e-mail</label>
            <input type="text" v-model.lazy="biodata.testing_data" required />
            <label>Nomer HP</label>
            <input type="number" v-model.lazy="biodata.phone_number" required />
        </form>
        
        <div v-if="submitted">
            <h3>Thank you for posting</h3>
        </div>
        
        <div>
            <select v-model="biodata.testing_data">
                <option v-for="region in regions">{{ region }}</option>
            </select>
            <button v-on:click.prevent="post">Add Datas</button>
        </div>

        <div id="preview">
            <div>
                <b-button v-b-toggle.collapse-1 variant="primary">Toggle Collapse</b-button>
                <b-collapse id="collapse-1" class="mt-2">
                    <b-card>
                        <p class="card-text">{{biodata.testing_data}}</p>
                    </b-card>
                </b-collapse>
            </div>
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
                name: "hasbi",
                email: "bebek",
                phone_number: null,
                categories: ["ikuykyukyujyujuyj","asdawadad","112323"],
                testing_data: "yowyow"
            },
            regions: ['Kelas Pak Budi', 'Riset AI', 'Eksekutif Johnson'],
            submitted: false,
            blogs: [
          
            ]
        }
    },
    methods: {
        post: function() {
            this.$http.post('https://dashboard-face.firebaseio.com/posts.json', this.biodata).then(function(data){
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

</style>
