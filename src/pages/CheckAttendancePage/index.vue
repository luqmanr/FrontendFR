<template>

    <div>
        <div class="upload-section">
            <span class="col-md-6" style="color: white; margin: 5vh 0vw 0vh 0vw;">Kelas/Region/Cluster: </span>
            <select v-model.lazy="payloadData.cluster" class="col-md-6" style="margin: 0vh 0vw 5vh 0vw;">
                <option v-for="regions in regionList" :key="regions">{{regions}}</option>
            </select>
            <button @click="QueryAbsensiLog">GET ABSENSI LOG</button>
        </div>

        

        <div class="attendance-log">

            <div style="height:70vh;width:100vw;">
                <ul v-for="attendanceLine,index in attendanceList">
                    <li>{{attendanceLine}}</li>
                </ul>
            </div>
            
        </div>

    </div>

</template>

<script>
    
// IMPORT COMPONENTS
import Vue      from 'vue'

// mixins imports
import TransactionID    from '@/mixins/services/state/TransactionID'
import Timestamp        from '@/mixins/services/state/Timestamp'

// 3rd party library imports
import axios    from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

export default {
    mixins: [
        TransactionID,
        Timestamp
    ],
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
            this.$_TransactionID_GenerateTransactionID()
            this.$_Timestamp_GenerateTimestamp()
            this.attendanceList = []
            axios.get(
                this.absensiLogURL + "?" + this.$_TransactionID_transactionID
                )
              .then(response => {
                  var csvLines = response.data.split(/\r?\n/)
                  var i
                  for (i = 0; i < csvLines.length; i++) {
                    var csvClusterId = csvLines[i].split(',')[0]
                    if (csvClusterId == this.payloadData.cluster) {
                        // console.log(csvLines[i])
                        this.attendanceList.push(csvLines[i])
                        console.log(this.attendanceList)
                    }
                  }

              })
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
    },
    created() {
        this.FetchClusters()
        this.$_TransactionID_GenerateTransactionID()
        this.$_Timestamp_GenerateTimestamp()
    }
}
</script>

<style scoped>
.attendance-log {
    background-color: rgb(0, 4, 255);
    overflow-y: scroll;
    color: white;
}
</style>