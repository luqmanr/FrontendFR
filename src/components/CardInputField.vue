<template>
  <div class="column col-md-4" style="padding: 1em">
    <h4>{{ label }}</h4>
    <h4 v-if="example">
      (eg. <b>``{{ example }}``</b>)
    </h4>
    <input type="text" v-model="value" class="results col-sm-10 h-75" />
  </div>
</template>

<script>
export default {
  props: ["label", "example", "value"],
};
</script>

<style scoped>
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