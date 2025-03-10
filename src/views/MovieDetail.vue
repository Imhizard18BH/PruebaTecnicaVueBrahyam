<template>
  <q-page class="flex flex-center">
    <motion.div
      ref="movieCard"
      class="movie-detail-container"
      :initial="{ opacity: 0, y: 50 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.6, ease: 'easeOut' }"
    >
      <q-card class="movie-card">
        <q-img :src="imageUrl" class="movie-img">
          <template v-slot:loading>
            <q-spinner color="white" size="lg" />
          </template>
        </q-img>

        <q-card-section>
          <div class="text-h4 text-bold">{{ movie.title }}</div>
          <div class="text-subtitle2">
            ⭐ {{ movie.vote_average }} | 🗓 {{ movie.release_date }}
          </div>
        </q-card-section>

        <q-card-section>
          <p class="movie-overview">{{ movie.overview || 'Sin descripción disponible.' }}</p>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn color="primary" label="Volver" @click="$router.push('/')" />
        </q-card-actions>
      </q-card>
    </motion.div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useMotion } from '@vueuse/motion'
import { useRoute } from 'vue-router'
import api from 'src/services/api.js'

const movie = ref({})
const movieCard = ref(null)
const loading = ref(true)
const error = ref(false)

const imageUrl = computed(() => {
  return movie.value.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.value.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image'
})

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

useMotion(movieCard, {
  initial: { opacity: 0, y: 50 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.6 } },
})
</script>

<style scoped>
.movie-detail-container {
  width: 100%;
  max-width: 600px;
}
.movie-card {
  width: 100%;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
  background: #1e1e1e;
  color: white;
}
.movie-img {
  width: 100%;
  border-radius: 12px;
}
.movie-overview {
  font-size: 1.1rem;
  line-height: 1.5;
}
</style>
