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
            return this.maxDescriptionLength - this.TodoObject.description.length;
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
            axios.post(BASE_URL, this.TodoObject)
                .then(response => {
                    console.log('Response:', response.data);
                    console.log('Todo added successfully!');
                    this.TodoList = [...this.TodoList, response.data];
                    this.TodoObject = {
                        title: "",
                        description: "",
                        priority: 1,
                        isCompleted: false,
                        createdAt: this.formatDateToInput(new Date()),
                        dueDate: null,
                    };
                })
                .catch(error => {
                    console.error('Error adding todo:', error);
                });
        },        
        formatPriority(priority){
            switch(priority){
                case 1:
                    return 'Low';
                case 2:
                    return 'Medium';
                case 3:
                    return 'High';
                default:
                    return 'Unknown';
            }
        },
        toggleCompletion(item) {
            if (!item.todoId) { 
                console.error("Item ID is undefined:", item);
                return;
            }
            axios.patch(`${BASE_URL}/${item.todoId}/toggleCompleted`)
                .then(response => {
                    this.TodoList = this.TodoList.map(todo => 
                        todo.todoId === item.todoId ? { ...todo, isCompleted: response.data.isCompleted } : todo
                    );
                })
                .catch(error => {
                    console.error("Failed to toggle completion", error);
                });
        },
          getCompletionClass(isCompleted) {
            return isCompleted ? 'table-success' : 'table-danger';
        },
    }
})

app.mount("#app")