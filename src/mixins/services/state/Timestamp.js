export default {
    data() {
        return {
            $_Timestamp_timestamp: undefined
        }
    },
    methods: {
        $_Timestamp_GenerateTimestamp() { // generate timestamp dengan format seperti ini "2020-05-13 09:43:26+0700" / "yyyy-mm-dd hh:mm:ss+tttt"
            var currentDate = new Date()
            var date = ('0' + currentDate.getDate()).slice(-2)
            var month = ('0' + (currentDate.getMonth()+1)).slice(-2) // getMonth()+1, because January is 0 not 1
            var year = currentDate.getFullYear()
            var hours = ('0' + currentDate.getHours()).slice(-2)
            var minutes = ('0' + currentDate.getMinutes()).slice(-2)
            var seconds = ('0' + currentDate.getSeconds()).slice(-2)
            var clock = hours + ":" +  minutes + ":" +  seconds
            var timezone = '+0700' // GMT hardcoded

            // combine all to make timestamp
            this.$_Timestamp_timestamp = year + "-" + month + "-" + date + " " + clock + timezone
        }
    }
}