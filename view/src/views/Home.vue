<template>
  <div class="home">{{ domain }}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getList, delList, putList, postList } from '../api/test'
export default defineComponent({
  name: 'Home',
  setup() {
    getList()
    delList()
    putList()
    postList()
    return {}
  }
})
</script>
