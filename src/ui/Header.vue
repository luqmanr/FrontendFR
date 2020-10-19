<template>
  <div>
    <img src='../assets/candy_stripe1.png' class='stripe'>
    <h1 class='title row'>
      <span class='col-sm-12' style='text-align: right'>by Riset.ai</span>
    </h1>
    <img src='../assets/candy_stripe1.png' class='stripe'>

    <nav>
      <ul class="row">
          <!-- All have access to these pages -->
          <router-link class='col-md-12' :to="{ path:'/absensi' }" tag="button" exact>Absensi</router-link>
          <router-link class='col-md-12' to="/checkattendance" tag="button" exact>Check Attendance</router-link>
          <router-link class='col-md-12' to="/login" tag="button" exact>Admin</router-link>
          <router-link class='col-md-12' to="/livenessdemo" tag="button" exact>Liveness Demo</router-link>
          <router-link class='col-md-12' to="/livenessdemo-v1.1" tag="button" exact>Liveness Demo v1.1</router-link>

          <!-- Only admins have access to these pages -->
          <router-link v-if="buttonView" class='col-md-12' to="/testpage" tag="button" exact>Testpage</router-link>
          <router-link v-if="buttonView" class='col-md-12' to="/registrationimage" tag="button" exact>Registration</router-link>
          <router-link v-if="buttonView" class='col-md-12' to="/listuser" tag="button" exact>List User</router-link>
          <router-link v-if="buttonView" class='col-md-12' to="/deleteuser" tag="button" exact>Delete User</router-link>
        </ul>
    </nav>
  </div>

</template>

<script>

import { bus } from '../main';
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default {
  components: {
 
  },
  props: {
      buttonView: {
          default: false
      }
  },
  data() {
    return {
      title: 'Face Demo'
    }
  },
  methods: {

  },
  created() {
      
  },
  mounted() {
    // this.$router.push("/imagecapture_absensi")
  }
}
</script>

<style scoped>

.title {
  width: 100%;
  font-size: 2vh;
  padding-left: 1%;
  background: rgb(10,10,10);
  color: white;
  margin: 0px 0px 0px 0px;
}

.stripe {
  height: 1vh;
  width: 100%;
  margin: 0px 0px 0px 0px;
}

nav {
  margin: 0px 0px 0px 0px;
  padding: 0px 0px 0px 0px;
}

li {
  font-size: 2vh;
}

button {
  font-size: 2vh;
  background-color: white;
  padding: 0vh 0vh 0vh 0vh;
}

</style>
