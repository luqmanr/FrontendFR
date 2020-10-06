<template>

    <div>
        <button @click="QueryAbsensiLog">GET ABSENSI LOG</button>
    </div>

</template>

<script>
    
// IMPORT COMPONENTS
import Vue      from 'vue'
// 3rd party library imports
import axios    from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

export default {
    data() {
        return {
            absensiLogURL: "https://portal.luqmanr.xyz/absensi-log/AbsensiLog.csv",
            attendanceList: [],
            regionList: [],
            payloadData: {
                cluster: undefined,
                clientId: undefined
            }
        }
    },
    methods: {
        QueryAbsensiLog() {
            axios.get(this.absensiLogURL)
            // axios.get(
            // this.absensiLogURL,
            // { headers: { Pragma: 'no-cache'}, 
            //     timeout: 1000 }
            //     )
            // .then(response => {
            //     console.log(response)
            //     var csv_lines = response.data.split(/\r?\n/)
            //     // if (csv_lines.length -1 > this.cheatingLogIndex) {
            //     //     this.cheatingLogIndex = csv_lines.length - 2
            //     // }
            // }).catch(error => {
            //     console.log(error)
            // })
        },
        FetchClusters() {
            axios.get("./clusters.json")
              .then(regionJSON => {
                this.regionList = regionJSON.data.cluster
                this.payloadData.cluster = this.regionList[0]
                this.payloadData.clientId = this.regionList[0]
              })
        }
    }
}
</script>

<style scoped>

</style>