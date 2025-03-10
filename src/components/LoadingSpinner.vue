<template>
  <div class="loading-container">
    <q-spinner-puff color="primary" size="3em" />
    <p class="loading-text">Cargando...</p>
  </div>
</template>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  padding: 20px;
}
.loading-text {
  margin-top: 10px;
  font-size: 1.1rem;
  color: #888;
}
</style>
