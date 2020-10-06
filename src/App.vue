<template>

    <div class="background">
        <v-header :button-view="LoginState"></v-header>

        <div>
            <router-view></router-view>
        </div>        

    </div>

</template>

<script>

import mixins from '@/mixins'

import { bus } from '@/main';
import Header from '@/ui/Header.vue'

export default {
    name: 'App',
    mixins: [
        mixins
    ],
    components: {
        'v-header': Header
    },
    // created() {
    //     document.title = "Absensi Dashboard"
    // },
    computed: {
        LoginState() {
            return this.$store.getters.getCurrentLoginState
        }
    },
    mounted() {
        this.$store.dispatch("setCurrentLoginState", null)
    }

}
</script>

<style>

.apps {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}
.background {
    background-color: rgb(30,30,30);
    height: 100%;
    /* width: 500vh; */
}

</style>
