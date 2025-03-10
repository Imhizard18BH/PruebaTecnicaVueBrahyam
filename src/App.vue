<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <router-view @filter-selected="applyFilter" :activeFilter="activeFilter" />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      activeFilter: null,
    }
  },
  methods: {
    applyFilter(filter) {
      this.activeFilter = filter
    },
  },
}
</script>
