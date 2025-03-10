<!-- LoadingSpinner.vue
 This component displays a loading spinner animation while content is loading -->
<template>
  <div class="loading-container">
    <!-- Quasar spinner component with primary color and size of 3em -->
    <q-spinner-puff color="primary" size="3em" />
    <!-- Loading text displayed below the spinner -->
    <p class="loading-text">Cargando...</p>
  </div>
</template>

<style scoped>
/* Container for the loading spinner and text */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  padding: 20px;
}
/* Styling for the loading text */
.loading-text {
  margin-top: 10px;
  font-size: 1.1rem;
  color: #888;
}
</style>
