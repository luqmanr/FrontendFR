<template>
  <div class="col-sm-12 app-card">
    <h2>Response</h2>
    <p>raw response</p>
    <div class="response-area row">
      <div class="col-md-10 row" style="padding: 0vh 3vw 0vh 3vw; margin: auto">
        <CardTextField title="Raw Response" value="1234"></CardTextField>
      </div>
    </div>
  </div>
</template>

<script>
import CardTextField from "@/components/CardTextField";

export default {
  props: [],
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