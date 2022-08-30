<template>
  <el-avatar
    src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
    size="default"
    class="d"
  />
  <p class="d">{{ username }}</p>
  <el-button round class="d">Logout</el-button>
</template>

<script setup lang="ts">
defineProps({
  photo: {
    type: String,
    default: "",
  },
  username: {
    type: String,
    default: "小张",
  },
});
</script>

<style>
.d {
  margin: 5px;
}
</style>