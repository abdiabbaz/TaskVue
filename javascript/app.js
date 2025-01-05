const BASE_URL = "https://localhost:7298/api/Todos"

const app = Vue.createApp({
    data(){
        return{ 
            TodoList: [],
            TodoObject: {title: "", description: "", priority:1,isCompleted:false, createdAt: null, dueDate: null},
            maxDescriptionLength: 50,
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
            }));
        },
        remainingCharacters() {
            return this.maxDescriptionLength - this.TodoObject.description.length
        }
    },
    methods:{
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
            };
            this.TodoObject.createdAt = this.formatDateToISOString(new Date());
            axios.post(BASE_URL, payload)
                .then(response => {
                    console.log('Response:', response.data);
                    console.log('Todo added successfully!');
                    this.TodoList.push(response.data);
                    this.TodoObject = {
                        title: "",
                        description: "",
                        priority: 1,
                        isCompleted: false,
                        createdAt: null,
                        dueDate: null,
                    };
                    const modalElement = document.getElementById('exampleModal');
                    const modal = bootstrap.Modal.getInstance(modalElement);
                    modal.hide();
                })
                .catch(error => {
                    console.error('Error adding todo:', error);
                });
                this.loadList()
        },
        deleteTodo(id) {
            if (window.confirm("Are you sure you want to delete this task?")) {
              axios.delete(`${BASE_URL}/${id}`)
                .then(() => {
                  this.TodoList = this.TodoList.filter(item => item.todoId !== id);
                  console.log("Task is deleted");
                })
                .catch(error => {
                  console.error("Something went wrong during deletion", error);
                });
            }
          },        
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
        toggleCompletion(item) {
            if (!item.todoId) { 
                console.error("Item ID is undefined:", item)
                return
            }
            axios.patch(`${BASE_URL}/${item.todoId}/toggleCompleted`)
                .then(response => {
                    this.TodoList = this.TodoList.map(todo => 
                        todo.todoId === item.todoId ? { ...todo, isCompleted: response.data.isCompleted } : todo
                    );
                })
                .catch(error => {
                    console.error("Failed to toggle completion", error)
                })
        },
          getCompletionClass(isCompleted) {
            return isCompleted ? 'table-success' : 'table-danger'
        },
        formatDateToISOString(date) {
            const d = new Date(date);
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:00`;
        },
        
    }
})
app.mount("#app")