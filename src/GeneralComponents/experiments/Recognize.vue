
<template>

    <div>
        TESTING FACE RECOGNIZE
    </div>

</template>

<script>

import { bus } from '../main';
import pico from '../assets/js/picojs/pico.min.js'

export default {
    methods: {
        loadCascade() {
            var cascadeurl = '../assets/js/facefinder';
            console.log('load1');
            fetch(cascadeurl).then(function (response) {
                console.log('load2');
                response.arrayBuffer().then(function (buffer) {
                    console.log('load3');
                    var bytes = new Int8Array(buffer);
                    console.log('load4');
                    console.log(pico)
                    facefinder_classify_region = pico.unpack_cascade(bytes);
                    console.log('* cascade loaded');
                })
            })
        }
    },
    mounted() {
        const plugin = document.createElement("script");
        plugin.setAttribute(
            "src",
            "../assets/js/picojs/pico.min.js"
        );
        plugin.async = true;
        document.head.appendChild(plugin);
    }
}

</script>

<style>

</style>