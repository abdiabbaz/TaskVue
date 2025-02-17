import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TodoView from '../views/TodoView.vue'
import AddTaskView from '../views/AddTaskView.vue'
import EditTaskView from '../views/EditTaskView'


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path:'/todo',
    name:'todo',
    component:TodoView
  },
  {
    path: '/add-task',
    name: 'AddTask',
    component: AddTaskView
  },
  {
    path: '/edit-task/:id',
    name:'EditTask',
    component:EditTaskView,
    props: route => ({ id: Number(route.params.id) })}
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
