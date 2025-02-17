<template>
<p v-if="error" style="color: red;">{{error}}</p>
  <table>
    <thead>
      <tr>
        <th>Title</th>
        <th>Description</th>
        <th>Priority</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
<tr v-for="item in formattedTodoList" :key="item.todoId" :class="{'task-completed': item.isCompleted}">
        <td>{{item.title}}</td>
        <td>{{item.description}}</td>
        <td>{{item.priority}}</td>
        <td class="status">
          <button
            :id="'status-btn-' + item.todoId" :class="{'completed': item.isCompleted, 'not-completed': !item.isCompleted}" @click="toggleCompletion(item)">
            {{ item.isCompleted ? 'Completed' : 'Mark as Completed' }}
          </button>
          </td>
        <td>
          <button id="delete-btn" @click="deleteTask(item.todoId)" ><i class="fa-solid fa-trash"></i></button>
          <button id="edit-btn" @click="editTask(item.todoId)"><i class="fa-solid fa-pen-to-square"></i></button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import axios from 'axios'
const BASE_URL = 'https://taskweb-epfbddgwdqbjdkb7.northeurope-01.azurewebsites.net/api/todos'
export default {
  name: 'TaskTable',
  data(){
  return{
    todoList: [],
    filteredList: [],
    todoToDelete: {todoId: 0,title: '',description: '',priority: 1,isCompleted: false},
    error: "",
    searchTitle: ""
  }
},
  created(){
    this.loadTodoList()
  },
 computed: {
  formattedTodoList() {
    const list = this.filteredList.length ? this.filteredList : this.todoList
    if (!Array.isArray(list)) {
      console.error("formattedTodoList error: list is not an array", list)
      return []
    }
    return list.map(item => ({
      ...item,
      priority: this.formatPriority(item.priority)
    }))
  }
},

methods:{
loadTodoList(){
  axios.get(BASE_URL).then(response =>{
    console.log(response.data)
    this.todoList = response.data
  }).catch(error =>{
    console.log('Data was not fetched...',error)
    this.error = 'There is currently no tasks to do..'
  })
},
editTask(todoId) {
  this.$router.push(`/edit-task/${todoId}`)
},
deleteTask(todoId){
    axios.delete(`${BASE_URL}/${todoId}`).then(() => {
      this.todoList = this.todoList.filter(item => item.todoId !== todoId)
      this.filteredList = this.filteredList.filter(item => item.todoId !== todoId)
      console.log('Task is deleted successfully')
    }).catch(error =>{
      console.log('There was an error deleting the task', error)
      this.error = 'Something went wrong with deleting the task...'
    })
},
toggleCompletion(item) {
  axios.patch(`${BASE_URL}/${item.todoId}/toggleCompleted`).then(response => {
    this.todoList = this.todoList.map(todo =>
      todo.todoId === item.todoId ? { ...todo, isCompleted: response.data.isCompleted } : todo
    )
    this.filteredList = this.filteredList.map(todo =>
      todo.todoId === item.todoId ? { ...todo, isCompleted: response.data.isCompleted } : todo
    )
  }).catch(error => {
    console.error("Failed to toggle completion", error)
  })
}
,
formatPriority(priority){
  switch(priority){
    case 1:
      return 'Low'
    case 2:
      return 'Medium'
    case 3:
      return 'High'
    default:
      return 'Unknown'
  }
},
clearFilters(){
 this.loadTodoList()
 this.filteredList = []
 },
filterByCompletion() {
  this.filteredList = this.todoList.filter(item => item.isCompleted === true)
},
filterByNotCompletion() {
  this.filteredList = this.todoList.filter(item => item.isCompleted === false)
},
filterByPriority(priority) {
    axios.get(`${BASE_URL}/FilterByPriority/${priority}`)
        .then(response => {
            console.log(response.data)
            this.todoList = response.data
            this.filteredList = [] 
        })
        .catch(error => {
            console.error("Error fetching filtered data", error)
        })
},
searchTask(query = '') {
  const search = (query || '').trim().toLowerCase()

  if (!search) {
    this.filteredList = []
    return
  }

  this.filteredList = this.todoList.filter(item => 
    item.title.toLowerCase().includes(search) || item.description.toLowerCase().includes(search)
  )
}


}
}
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
th, td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: center;
}
th {
  background-color: #f4f4f4;
}
button {
  padding: 5px 10px;
  margin: 2px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}
.task-completed td:nth-child(-n+3) {
  text-decoration: line-through;
  color: gray;
  opacity: 0.6;
}

.completed {
  background-color: green;
  color: white;
}
.not-completed {
  background-color: gray;
  color: white;
}
#delete-btn{
  background-color:red;
}
</style>


