<template>
  <div class="dashboard-container">
    <div class="dashboard-text">nameManager: {{ name }}</div>
    <div class="dashboard-text">roles: <span v-for="role in roles" :key="role">{{ role }}</span></div>
  </div>
</template>

<script>
export default {
  name: 'OneDrive'
}
</script>

<style scoped>

</style>
