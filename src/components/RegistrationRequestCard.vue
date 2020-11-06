<template>
  <div class="col-sm-12 app-card">
    <h2>Request Fields</h2>
    <p>request params</p>
    <div class="response-area row">
      <div class="col-md-10 row" style="padding: 0vh 3vw 0vh 3vw; margin: auto">
        <InputField label="Nama" :value="payloadUsername"></InputField>
      </div>
      <div class="col-md-10 row" style="padding: 0vh 3vw 0vh 3vw; margin: auto">
        <InputField label="cluster_id" :value="payloadCluster"></InputField>
      </div>
      <div class="col-md-10 row" style="padding: 0vh 3vw 0vh 3vw; margin: auto">
        <InputField label="client_id" :value="payloadClientId"></InputField>
      </div>
      <div class="col-md-10 row" style="padding: 0vh 3vw 0vh 3vw; margin: auto">
        <InputField label="user_id" :value="payloadUserId"></InputField>
      </div>
      <b-button @click="fnGenerateUserId" class="col-sm-5"
        >Generate User_ID</b-button
      >
      <div class="col-md-10 row" style="padding: 0vh 3vw 0vh 3vw; margin: auto">
        <InputField label="custom API" :value="paramApi"></InputField>
      </div>
    </div>
  </div>
</template>

<script>
import InputField from "@/components/CardInputField";

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
</style>