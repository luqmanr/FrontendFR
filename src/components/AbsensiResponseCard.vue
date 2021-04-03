<template>
  <div class="col-sm-12 app-card">
    <h2>Attendance Status</h2>
    <p>Your data</p>
    <div class="response-area row">
      <div class="col-md-10 row" style="padding: 0vh 3vw 0vh 3vw; margin: auto">
        <CardTextField
          title="Recognized Name"
          :value="userName"
        ></CardTextField>
        <CardTextField
          title="Recognized User ID"
          :value="userID"
        ></CardTextField>
        <CardTextField
          title="Confidence Level"
          :value="confidenceLevel"
        ></CardTextField>
        <CardTextField
          title="Melakukan Absensi Jam"
          :value="timestamp"
        ></CardTextField>
        <CardTextField
          title="Masker Statis"
          :value="maskerStatus"
        ></CardTextField>
        <CardTextField
          title="Response Error"
          :value="responseError"
        ></CardTextField>
        <CardTextField
          title="Latitude, Longitude"
          :value="`${latitude} , ${longitude}`"
        ></CardTextField>
      </div>
    </div>
  </div>
</template>

<script>
import CardTextField from "@/components/CardTextField";

export default {
  props: [
    "userName",
    "userID",
    "confidenceLevel",
    "timestamp",
    "maskerStatus",
    "responseError",
    "latitude",
    "longitude"
  ],
  components: { CardTextField },
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