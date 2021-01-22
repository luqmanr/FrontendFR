<template>
  <div class="row col-md-12">
    <div class="response-area col-md-12 row">
        <div class="col-md-12 row"
             style="padding: 0vh 3vw 0vh 3vw;
                    margin: auto;">

            <div class="column col-md-6" style="padding: 1em;">
                <h4>Client ID: </h4>
                <input type=text v-model="clientID" class="results h-75 col-md-10">           
            </div>

            <div class="column col-md-6" style="padding: 1em;">
                <h4>Access Token: </h4>
                <input type=text v-model="clientToken" class="results h-75 col-md-10">           
            </div>

        </div>
    </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            clientID: "",
            clientToken: ""
        }
    },
    methods: {
        GetClientData() {
            this.$emit("clientID", this.clientID)
            this.$emit("clientToken", this.clientToken)
        },
    },
    watch: {
        clientID(e) {
            this.GetClientData()
        },
        clientToken(e) {
            this.GetClientData()
        }
    }
}
</script>

<style scoped>
.response-area {
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /* padding: 2vh; */
}

.results {
    padding: 1em;
    background-color: #374369;
    border-radius: 0.5em;
}

div {
    font-family: Helvetica Neue Regular;
    font-weight: bold;
    text-align: left;
    color: white;
}

input {
    font-family: Helvetica Neue Regular;
    font-weight: bold;
    text-align: left;
    color: white;
}

h4 {
    padding: 0 0.2em;
    font-size: 1em;
}

button {
    /* font */
    font-family: Helvetica Neue Bold;
    font-weight: bold;
    font-size: large;
    color: white;
    text-shadow: 2px 2px 4px #000000;
    text-align: center;

    background-color: #3D64FF;
    border: none;
    border-radius: 2em;
    padding: 2em;
    max-width: 20em;
} button:hover {
    background-color: #5a9bfd;
} button:focus {
    outline: 0 !important;
} .disabled {
    color: rgb(161, 161, 161);
    background-color: #6d6d6d;
} .disabled:hover {
    background-color: #6d6d6d;
}
</style>