// vue.config.js
module.exports = {
    devServer: {
        https: true,
        // proxy: 'https://luqmanr.xyz:8443/api_fr/v2/recognizemask',
    },
    publicPath: process.env.NODE_ENV === 'production'
    // ? '/kelas-br'
    // ? '/absensi'
    // ? '/'
    ? '/demo'
    : '/'
}