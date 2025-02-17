<template>
  <div class="home">
    <HelloWorld msg="Welcome to your Task application"/>
    <img alt="Vue logo" src="../assets/tasks.png">
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  }
}
</script>

<style scoped>
img {
  margin-top:50px;
  width: 55%;
  height: 55%;
}
</style>