<template>
  <div class="filter-buttons">
    <button id="filter-btn" @click="$emit('clear-filters')">Clear Filters</button>
    <input type="text" v-model="searchTitle" @input="$emit('search-task', searchTitle)" placeholder="Search after a Task...">
    <select v-model="selectedPriority" @change="$emit('filter-priority', parseInt($event.target.value))">
  <option disabled selected>Level Of Importance</option>
  <option value="1">Low</option>
  <option value="2">Medium</option>
  <option value="3">High</option>
</select>
    <button id="filter-btn" @click="$emit('filter-completed',true)">Filter Completed</button>
    <button id="filter-btn" @click="$emit('filter-not-completed',false)">Filter Not Completed</button>
  </div>
</template>

<script>
export default {
  name: 'FilterComponent',
  data() {
    return {
      selectedPriority: 'Level Of Importance',
      searchTitle: '',
    }
  },
   methods: {
    reset() {
      this.selectedPriority = 'Level Of Importance'
      this.searchTitle = ''
    }
  }
};
</script>

<style>
.filter-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.filter-buttons button,
.filter-buttons select,
.filter-buttons input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  cursor: pointer;
}
#color-btn{
  background-color: #007bff;
}
#filter-btn {
    background-color: #f0f0f050; 
    color: #333;             
}

#filter-btn:hover {
    background-color: #07050550;
    border-color: #999;
}

/* .filter-buttons button:hover {
  background-color: #e0e0e0;
} */
</style>
