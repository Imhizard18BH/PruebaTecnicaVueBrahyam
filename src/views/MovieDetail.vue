<template>
  <!-- Main container for the movie detail page -->
  <q-page class="flex flex-center">
    <!-- Animated container for the movie card -->
    <motion.div
      ref="movieCard"
      class="movie-detail-container"
      :initial="{ opacity: 0, y: 50 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.6, ease: 'easeOut' }"
    >
      <!-- Movie card displaying movie details -->
      <q-card class="movie-card">
        <!-- Movie image with a loading spinner -->
        <q-img :src="imageUrl" class="movie-img">
          <template v-slot:loading>
            <q-spinner color="white" size="lg" />
          </template>
        </q-img>

        <!-- Section for movie title and rating -->
        <q-card-section>
          <div class="text-h4 text-bold">{{ movie.title }}</div>
          <div class="text-subtitle2">
            ⭐ {{ movie.vote_average }} | 🗓 {{ movie.release_date }}
          </div>
        </q-card-section>

        <!-- Section for movie overview -->
        <q-card-section>
          <p class="movie-overview">{{ movie.overview || 'Sin descripción disponible.' }}</p>
        </q-card-section>

        <q-separator />

        <!-- Button to navigate back to the main page -->
        <q-card-actions align="right">
          <q-btn color="primary" label="Volver" @click="$router.push('/')" />
        </q-card-actions>
      </q-card>
    </motion.div>
  </q-page>
</template>

<script setup>
/**
 * Import necessary functions and modules from Vue and other libraries.
 */
import { ref, onMounted, computed } from 'vue'
import { useMotion } from '@vueuse/motion'
import { useRoute } from 'vue-router'
import api from 'src/services/api.js'

/**
 * Reactive references to store movie details, loading state, and error state.
 */
const movie = ref({})
const movieCard = ref(null)
const loading = ref(true)
const error = ref(false)

/**
 * Computed property to generate the image URL for the movie poster.
 * If the poster path is not available, a placeholder image is used.
 */
const imageUrl = computed(() => {
  return movie.value.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.value.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image'
})

/**
 * Fetch movie details when the component is mounted.
 * The movie ID is retrieved from the route parameters.
 * Handles loading and error states.
 */
onMounted(async () => {
  try {
    const movieId = useRoute().params.id
    const response = await api.getMovieDetails(movieId)
    movie.value = response.data
  } catch (err) {
    error.value = true
    console.error('Error al obtener detalles:', err)
  } finally {
    loading.value = false
  }
})

/**
 * Apply motion effects to the movie card using the useMotion hook.
 */
useMotion(movieCard, {
  initial: { opacity: 0, y: 50 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.6 } },
})
</script>

<style scoped>
/* Styles for the movie detail container */
.movie-detail-container {
  width: 100%;
  max-width: 600px;
}

/* Styles for the movie card */
.movie-card {
  width: 100%;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
  background: #1e1e1e;
  color: white;
}

/* Styles for the movie image */
.movie-img {
  width: 100%;
  border-radius: 12px;
}

/* Styles for the movie overview text */
.movie-overview {
  font-size: 1.1rem;
  line-height: 1.5;
}
</style>
