const BASE_URL = "https://localhost:7298/api/Todos"

const app = Vue.createApp({
    data(){
        return{ 
            TodoList: [],
            TodoObject: {title: "", description: "", priority:1,isCompleted:false, createdAt: null, dueDate: null},
            maxDescriptionLength: 50,
            todoToDelete: null, 
            priority: 0,

        }
    },
    created(){
        this.loadList()
    },
    computed:{
        formattedTodoList() {
            return this.TodoList.map(item => ({
                ...item,
                priority: this.formatPriority(item.priority),
            }))
        },
        remainingCharacters() {
            return this.maxDescriptionLength - this.TodoObject.description.length
        }
    },
    methods:{
        // Axios CRUD
        loadList(){
            axios.get(BASE_URL).then(response =>{
                this.TodoList = response.data
            }).catch(error =>{
                console.log("Data was not fetched", error)
            })
        },
        addTodo() {
            const payload = {
                ...this.TodoObject,
                priority: parseInt(this.TodoObject.priority),
                createdAt: this.formatDateToISOString(this.TodoObject.createdAt), 
                dueDate: this.TodoObject.dueDate ? this.formatDateToISOString(this.TodoObject.dueDate) : null,
            }
            this.TodoObject.createdAt = this.formatDateToISOString(new Date())
            axios.post(BASE_URL, payload)
                .then(response => {
                    console.log('Response:', response.data)
                    console.log('Todo added successfully!')
                    this.TodoList.push(response.data)
                    this.TodoObject = {
                        title: "",
                        description: "",
                        priority: 1,
                        isCompleted: false,
                        createdAt: null,
                        dueDate: null,
                    }
                    const modalElement = document.getElementById('exampleModal')
                    const modal = bootstrap.Modal.getInstance(modalElement)
                    modal.hide()
                })
                .catch(error => {
                    console.error('Error adding todo:', error)
                })
                this.loadList()
        },
          showDeleteModal(todoId) {
            this.todoToDelete = todoId
            const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'))
            deleteModal.show()
        },
        confirmDelete() {
            axios.delete(`${BASE_URL}/${this.todoToDelete}`)
                .then(() => {
                    this.TodoList = this.TodoList.filter(item => item.todoId !== this.todoToDelete)
                    console.log("Task deleted successfully")
                    this.todoToDelete = null
                })
                .catch(error => {
                    console.error("Error during deletion", error)
                })
    
            const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'))
            deleteModal.hide()
        },
        loadOnlyCompleted(){
            axios.get(`${BASE_URL}/CompletedTrue`).then(response =>{
                this.TodoList = response.data
            }).catch(error => {
                console.log("Something went wrong with fetching data", error)
            })
        },
        loadNotCompleted(){
            axios.get(`${BASE_URL}/CompletedFalse`).then(response =>{
                this.TodoList = response.data
            }).catch(error => {
                console.log("Something went wrong with fetching data", error)
            })
        },
        filterByPriority(priority) {
            axios.get(`${BASE_URL}/FilterByPriority/${priority}`)
                .then(response => {
                    console.log(response.data)
                    this.TodoList = response.data
                })
                .catch(error => {
                    console.error("Error fetching filtered data", error)
                })
        },
        resetFilter(){
            this.loadList()
        },
        // Hjælpe metoder
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
        toggleCompletion(item){
            if (!item.todoId) { 
                console.error("Item ID is undefined:", item)
                return
            }
            axios.patch(`${BASE_URL}/${item.todoId}/toggleCompleted`)
                .then(response => {
                    this.TodoList = this.TodoList.map(todo => 
                        todo.todoId === item.todoId ? { ...todo, isCompleted: response.data.isCompleted } : todo
                    )
                })
                .catch(error => {
                    console.error("Failed to toggle completion", error)
                })
        },
          getCompletionClass(isCompleted) {
            return isCompleted ? 'table-success' : 'table-danger'
        },
        formatDateToISOString(date) {
            const d = new Date(date)
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:00`
        },
        
    }
})
app.mount("#app")