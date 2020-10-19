<template>

    <div class="background">
        <div class="row">
            <b-button variant="primary" v-b-toggle.sidebar-1 style="font-size:2em;" class="col-sm-1">☰ Menu</b-button>
            <h3 class="col-sm-10" style="margin: 0.5em 0em 0em 0em; text-align: right;">by Riset.ai</h3>
        </div>
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
        document.title = "riset.ai Dashboard"
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

@font-face {
    font-family: "Helvetica Neue Bold";
    src: local("HelveticaNeueBd"),
        url("./fonts/HelveticaNeueBd.ttf") format("truetype");
}

@font-face {
    font-family: "Helvetica Neue Regular";
    src: local("Helvetica Neue Regular"),
        url("./fonts/HelveticaNeue Light.ttf") format("truetype");
}

h1 {
    font-family: Helvetica Neue Bold;
    font-weight: bold;
    text-align: left;
    color: white;
}

h2 {
    font-family: Helvetica Neue Bold;
    font-weight: bold;
    text-align: left;
    color: white;
}

h3 {
    font-family: Helvetica Neue Bold;
    font-weight: bold;
    text-align: left;
    color: white;
}

p {
    font-family: Helvetica Neue Regular;
    font-weight: normal;
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
