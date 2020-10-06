export default {
    data() {
        return {
            root: 'https://riset.luqmanr.xyz/'
        }
    },
    computed: {
        clusterList() {
            return root + 'absensi_frontend/clusters.json'
        },
        imageInferencing() {
            return root + 'api_fr/v3/recognizemask'
        }
    }
}