<template>
  <div>
    <input type="file" v-on:change="onFileSelected">
    <button v-on:click="onUpload"></button>
  </div>
  
</template>
  
<script>
  
import { bus } from '../main';

export default {
  components: {
  
  },
  data() {
    return {
        selectedFile: null
    }
  },
  methods: {
    onFileSelected(event) {
        this.selectedFile = event.target.files[0]
    },
    onUpload() {

    }
  },
  created: {
      
  }
}
</script>
  
<style scoped>

</style>
  