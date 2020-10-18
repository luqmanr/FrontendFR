<template>

    <div class="background">
        <b-button variant="primary" v-b-toggle.sidebar-1 style="font-size:2em;">☰</b-button>
        <b-sidebar id="sidebar-1" title="Navigations" bg-variant="dark" text-variant="light" shadow>
            <v-header :button-view="LoginState"></v-header>
        </b-sidebar>
        <router-view></router-view>
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
    created() {
        // document.title = "riset.ai Dashboard"
    },
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
    background-color:#182039;
    height: 100%;
}
h1 {
    font-family: Helvetica Neue;
    font-weight: bold;
    text-align: left;
    color: white;
}

h2 {
    font-family: Helvetica Neue;
    font-weight: bold;
    text-align: left;
    color: white;
}

p {
    font-family: Helvetica;
    font-weight: bold;
    text-align: left;
    color: white;
}

/* fallback */
@font-face {
  font-family: 'Material Icons';
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2) format('woff2');
}

.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}

</style>
