<template>
  <div>
    <p v-if="error" style="color: red;">{{ error }}</p>
    <p v-if="successMessage" class="success-msg">{{ successMessage }}</p>
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
        <tr v-for="item in formattedTodoList" :key="item.todoId" :class="{ 'task-completed': item.isCompleted }">
          <td>{{ item.title }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.priority }}</td>
          <td class="status">
            <button
              :id="'status-btn-' + item.todoId"
              :class="{ 'completed': item.isCompleted, 'not-completed': !item.isCompleted }"
              @click="toggleCompletion(item)"
            >
              {{ item.isCompleted ? 'Completed' : 'Mark as Completed' }}
            </button>
          </td>
          <td>
            <button id="delete-btn" @click="deleteTask(item.todoId)"><i class="fa-solid fa-trash"></i></button>
            <button id="edit-btn" @click="editTask(item.todoId)"><i class="fa-solid fa-pen-to-square"></i></button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content">
        <p>Are you sure you want to delete the task: <strong>{{ todoToDelete.title }}</strong>?</p>
        <button class="modalConfirm" @click="confirmDelete">Yes, delete</button>
        <button class="modalCancel" @click="cancelDelete">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
const BASE_URL = 'https://taskweb-epfbddgwdqbjdkb7.northeurope-01.azurewebsites.net/api/todos'

export default {
  name: 'TaskTable',
  data() {
    return {
      todoList: [],
      filteredList: [],
      todoToDelete: { todoId: 0, title: '', description: '', priority: 1, isCompleted: false },
      error: '',
      successMessage: '',
      searchTitle: '',
      showDeleteModal: false,
    }
  },
  created() {
    this.loadTodoList()
  },
  computed: {
    formattedTodoList() {
      const list = this.filteredList.length ? this.filteredList : this.todoList
      if (!Array.isArray(list)) {
        console.error('formattedTodoList error: list is not an array', list)
        return []
      }
      return list.map(item => ({
        ...item,
        priority: this.formatPriority(item.priority)
      }))
    }
  },
  methods: {
    loadTodoList() {
      axios.get(BASE_URL).then(response => {
        this.todoList = response.data
      }).catch(error => {
        console.log('Error fetching todo list', error)
        this.error = 'There is currently no tasks to do..'
      })
    },
    editTask(todoId) {
      this.$router.push(`/edit-task/${todoId}`)
    },
    deleteTask(todoId) {
      const todo = this.todoList.find(item => item.todoId === todoId)
      if (todo) {
        this.todoToDelete = { ...todo }
        this.showDeleteModal = true
      }
    },
    confirmDelete() {
      axios.delete(`${BASE_URL}/${this.todoToDelete.todoId}`).then(() => {
        this.todoList = this.todoList.filter(item => item.todoId !== this.todoToDelete.todoId)
        this.filteredList = this.filteredList.filter(item => item.todoId !== this.todoToDelete.todoId)
        this.showDeleteModal = false
        this.successMessage = `The task "${this.todoToDelete.title}" has been deleted.`
        setTimeout(() => {
          this.successMessage = ''
        }, 10000)
      }).catch(error => {
        console.log('Error deleting task', error)
        this.error = 'Something went wrong with deleting the task...'
        this.showDeleteModal = false
      })
    },
    cancelDelete() {
      this.showDeleteModal = false
      this.todoToDelete = { todoId: 0, title: '', description: '', priority: 1, isCompleted: false }
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
        console.error('Failed to toggle completion', error)
      })
    },
    formatPriority(priority) {
      switch (priority) {
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
    clearFilters() {
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
          this.todoList = response.data
          this.filteredList = []
        })
        .catch(error => {
          console.error('Error fetching filtered data', error)
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
#delete-btn {
  background-color: red;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  max-width: 400px;
}
.modal-content button {
  margin: 10px;
}
.modalConfirm {
  background-color: red;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}
.modalCancel {
  background-color: gray;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}
.success-msg {
  color: green;
  background-color: #e0ffe0;
  padding: 10px;
  border: 1px solid green;
  border-radius: 4px;
  margin-bottom: 15px;
}
</style>
