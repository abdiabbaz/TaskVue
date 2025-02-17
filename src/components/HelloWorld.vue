<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      Organize your tasks easily and efficiently.
    </p>
    <button @click="goToTasks">Make your Tasks</button>  
</div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  methods:{
    goToTasks(){
      this.$router.push('/todo')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
button{
  background-color: #42b983;
  font-style:bold;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  margin-top: 20px;
}
button:hover{
  transform:scale(1.1);
  transition: all 0.3s ease 0s;
}

</style>
