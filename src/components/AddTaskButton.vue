<template>
  <button class="add-task-btn" @click="goToAddTask">+ Add Task</button>
</template>

<script>
export default {
  name: 'AddTaskButton',
  methods:{
    goToAddTask(){
      this.$router.push('/add-task')
    }
  }
};
</script>

<style>
.add-task-btn {
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 15px;
}
.add-task-btn:hover {
  background-color: #218838;
}
</style>
