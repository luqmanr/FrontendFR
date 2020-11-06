<template>
  <div class="column col-md-3" style="padding: 1em">
    <h4>{{ title }}:</h4>
    <div class="results h-75">{{ value }}</div>
  </div>
</template>

<script>
export default {
  props: ["title", "value"],
};
</script>

<style scoped>
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

h4 {
  padding: 0 0.2em;
  font-size: 1em;
}
</style>