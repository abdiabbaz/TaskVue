<template>
  <div class="add-task-container ">
    <button class="back-btn" @click="this.$router.go(-1)">Go Back</button>
    <h1>Add New Task</h1>
    <form @submit.prevent="addTask">
      <label>Title:</label>
      <input type="text" v-model="task.title" required placeholder="Title is required" />

      <label>Description:</label>
      <textarea v-model="task.description" required placeholder="Description cannot be empty"></textarea>

      <label>Priority:</label>
      <select v-model="task.priority" required>
        <option disabled selected :value="0">Please select a priority</option>
        <option :value="1">Low</option>
        <option :value="2">Medium</option>
        <option :value="3">High</option>
      </select>

      <button class="add-task-btn" type="submit">Save Task</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
const BASE_URL = 'https://taskweb-epfbddgwdqbjdkb7.northeurope-01.azurewebsites.net/api/todos'
export default {
  name: 'AddTask',
  data() {
    return {
      task: {
        title: '',
        description: '',
        priority: 0,
        isCompleted: false,
      }
    };
  },
  methods: {
    addTask() {
        axios.post(BASE_URL, this.task).then(() => {
          this.$router.push('/todo')
        }).catch(error =>{
        console.error('Error adding todo:', error)
        })
    }
  },
};
</script>

<style scoped>
.add-task-container {
  max-width: 500px;
  margin: 40px auto;
  padding: 30px;
  background: #f9f9f9; 
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  text-align: left;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

.add-task-container:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2); 
}

h1 {
  text-align: center;
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px; 
}

label {
  font-weight: bold;
  color: #444;
  font-size: 14px;
}

input,
textarea,
select {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  background-color: #fff;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

select{
  cursor: pointer;
}

input:focus,
textarea:focus,
select:focus {
  border-color: #42b983;
  box-shadow: 0 0 5px rgba(66, 185, 131, 0.5);
  outline: none;
}

.add-task-btn {
  background-color: #42b983;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.back-btn {
  background-color: #d3d3d3; 
  color: #333;
  padding: 8px;
  cursor: pointer;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  transition: background-color 0.3s;
}

.back-btn:hover {
  background-color: #b0b0b0; 
  transform: scale(1.03);
}


.add-task-btn:hover {
  background-color: #369870;
  transform: scale(1.03); 
}

.add-task-btn:active {
  transform: scale(0.98); 
}

/* .success {
  color: #2ecc71;
  font-weight: bold;
  text-align: center;
  margin-top: 15px;
}

.error {
  color: #e74c3c;
  font-weight: bold;
  text-align: center;
  margin-top: 15px;
} */

</style>
