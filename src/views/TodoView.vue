<template>
  <div class="todo-container">
    <HeaderComponentVue />
    <FilterComponent ref="filterComponent" @clear-filters="clearFilters" 
    @filter-completed="filterCompletedTasks"
    @filter-not-completed="filterNotCompletedTasks"
    @filter-priority="filterByPriority"
    @search-task="searchTask"
    />
  <TaskTable ref="taskTable" />
   <AddTaskButton />
  </div>
</template>

<script>
import FilterComponent from '@/components/FilterComponent.vue';
import TaskTable from '@/components/TaskTable.vue';
import AddTaskButton from '@/components/AddTaskButton.vue';
import HeaderComponentVue from '@/components/HeaderComponent.vue'

export default {
  name: 'Todo',
  components: {
    FilterComponent,
    TaskTable,
    AddTaskButton,
    HeaderComponentVue
  },
  methods:{
    clearFilters() {
      this.$refs.taskTable.clearFilters()
      this.$refs.filterComponent.reset()
    },
    filterCompletedTasks(isCompleted) {
      this.$refs.taskTable.filterByCompletion(isCompleted)
    },
    filterNotCompletedTasks(isCompleted) {
      this.$refs.taskTable.filterByNotCompletion(isCompleted)
    },
    filterByPriority(priority) {
      this.$refs.taskTable.filterByPriority(priority)
    },
   searchTask(query) {
  this.$refs.taskTable.searchTask(query)
}
}
};
</script>

<style>
.todo-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
