<template>
  <div class="col-sm-12 app-card">
    <h2>Request Fields</h2>
    <p>request params</p>
    <div class="response-area row">
      <div class="column col-md-4" style="padding: 1em">
        <h4>Nama</h4>
        <input type="text" v-model="value" class="results col-sm-10 h-75" />
      </div>
      <div class="column col-md-4" style="padding: 1em">
        <h4>cluster_id</h4>
        <input type="text" v-model="value" class="results col-sm-10 h-75" />
      </div>
      <div class="column col-md-4" style="padding: 1em">
        <h4>client_id</h4>
        <input type="text" v-model="value" class="results col-sm-10 h-75" />
      </div>
      <div class="column col-md-4" style="padding: 1em">
        <h4>user_id</h4>
        <input type="text" v-model="value" class="results col-sm-10 h-75" />
      </div>

      <!-- <InputField label="Nama" v-model="payloadUsername"></InputField>
      <InputField label="cluster_id" v-model="payloadCluster"></InputField>
      <InputField label="client_id" v-model="payloadClientId"></InputField>
      <InputField label="user_id" v-model="payloadUserId"></InputField> -->
      <b-button @click="fnGenerateUserId" class="col-sm-5"
        >Generate User_ID</b-button
      >
      <div class="column col-md-4" style="padding: 1em">
        <h4>custom API</h4>
        <input type="text" v-model="value" class="results col-sm-10 h-75" />
      </div>

      <!-- <InputField label="custom API" v-model="paramApi"></InputField> -->
    </div>
  </div>
</template>

<script>
import InputField from "@/components/CardInputField";

// NOTE (lee):
// I'm directly expanding InputField here. I can't seem to figure out how
// emit works. I'll probably copy-paste this to the View as well.
// The payload state is changed there.
export default {
  props: [
    "payloadUsername",
    "payloadCluster",
    "payloadClientId",
    "payloadUserId",

    "fnGenerateUserId",

    "paramApi",
  ],
  components: { InputField },
};
</script>

<style scoped>
.app-card {
  background: #242e4e;
  border-radius: 3em;

  padding: 3vh 5vw;
  margin: 1em 0em 1em 0em;

  max-width: 100vw;
}

p {
  font-family: Helvetica Neue Regular;
}

.response-area {
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* padding: 2vh; */
}

/* Copied from CardInputField */
.results {
  padding: 1em;
  background-color: #374369;
  border-radius: 0.5em;
  color: white;
}

div {
  font-family: Helvetica Neue Regular;
  font-weight: bold;
  text-align: left;
  color: white;
}

h4 {
  padding: 0 0.2em;
  font-size: 1em;
}
</style>