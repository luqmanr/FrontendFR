export default {
    data() {
        return {
            $_TransactionID_transactionID: undefined
        }
    },
    methods: {
        $_TransactionID_GenerateTransactionID() { // generate random string, seperti ini "ck5bec23-51f5-4c6e-aca5-ebd7115a8f40" / "8s-4s-4s-4s-12s"
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            var charactersLength = characters.length
            var eight = ''
            for ( var i = 0; i < 8; i++ ) {
                eight += characters.charAt(Math.floor(Math.random() * charactersLength))
            }
            var four_one = ''
            for ( var i = 0; i < 4; i++ ) {
                four_one += characters.charAt(Math.floor(Math.random() * charactersLength))
            }
            var four_two = ''
            for ( var i = 0; i < 4; i++ ) {
                four_two += characters.charAt(Math.floor(Math.random() * charactersLength))
            }
            var four_three = ''
            for ( var i = 0; i < 4; i++ ) {
                four_three += characters.charAt(Math.floor(Math.random() * charactersLength))
            }
            var twelve = ''
            for ( var i = 0; i < 12; i++ ) {
                twelve += characters.charAt(Math.floor(Math.random() * charactersLength))
            }

            // combine all to make $_TransactionID_transactionID
            this.$_TransactionID_transactionID = ''.concat(eight, '-', four_one, '-', four_two, '-', four_three, '-', twelve)
        }
    },
    created() {
        this.$_TransactionID_GenerateTransactionID()
    }
}