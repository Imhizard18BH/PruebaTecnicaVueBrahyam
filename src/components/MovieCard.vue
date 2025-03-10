<template>
  <div ref="cardRef" class="movie-card-wrapper">
    <q-card class="movie-card">
      <!-- Poster de la película con overlay de información al hover -->
      <div class="poster-container">
        <q-img :src="imageUrl" :ratio="3 / 3" spinner-color="amber-5" class="movie-poster" />

        <!-- Overlay informativo -->
        <div class="movie-overlay">
          <div class="movie-actions">
            <q-btn round flat size="sm" icon="bookmark_add" color="amber-5">
              <q-tooltip>Guardar en favoritos</q-tooltip>
            </q-btn>
            <q-btn round flat size="sm" icon="star" color="amber-5">
              <q-tooltip>Calificar</q-tooltip>
            </q-btn>
          </div>

          <div class="movie-brief">
            <p class="release-date">
              <q-icon name="event" size="xs" class="q-mr-xs" />
              {{ formatDate(movie.release_date) }}
            </p>
            <p class="movie-genres" v-if="movie.genre_ids">
              {{ getGenreNames(movie.genre_ids) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Información básica de la película -->
      <q-card-section class="movie-info">
        <div class="movie-rating">
          <q-icon name="star" color="amber-5" size="sm" />
          <span>{{ movie.vote_average }}</span>
        </div>

        <h3 class="movie-title ellipsis-2-lines">{{ movie.title }}</h3>

        <p class="movie-overview ellipsis-3-lines">
          {{ movie.overview || 'Sin descripción disponible.' }}
        </p>
      </q-card-section>

      <!-- Botón de acción -->
      <q-card-actions align="right" class="card-actions">
        <q-btn
          color="amber-5"
          text-color="black"
          label="Más detalles"
          icon="info"
          @click="$emit('viewDetails', movie)"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Lista de géneros (idealmente debería venir de una API)
const genres = {
  28: 'Acción',
  12: 'Aventura',
  16: 'Animación',
  35: 'Comedia',
  80: 'Crimen',
  99: 'Documental',
  18: 'Drama',
  10751: 'Familiar',
  14: 'Fantasía',
  36: 'Historia',
  27: 'Terror',
  10402: 'Música',
  9648: 'Misterio',
  10749: 'Romance',
  878: 'Ciencia ficción',
  10770: 'Película de TV',
  53: 'Thriller',
  10752: 'Guerra',
  37: 'Western',
}

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
})

const cardRef = ref(null)

const imageUrl = computed(() => {
  return props.movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${props.movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image'
})

const formatDate = (dateString) => {
  if (!dateString) return 'Fecha desconocida'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { year: 'numeric' })
}

const getGenreNames = (genreIds) => {
  if (!genreIds || !genreIds.length) return 'Sin géneros'
  return genreIds
    .slice(0, 2)
    .map((id) => genres[id] || '')
    .filter(Boolean)
    .join(', ')
}

onMounted(() => {
  // Animación de entrada para las tarjetas
  const card = cardRef.value
  if (card) {
    card.style.opacity = '0'
    card.style.transform = 'translateY(20px)'

    setTimeout(
      () => {
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease'
        card.style.opacity = '1'
        card.style.transform = 'translateY(0)'
      },
      100 * Math.random() * 5,
    ) // Efecto escalonado
  }
})
</script>

<style scoped>
.movie-card-wrapper {
  height: 100%;
  perspective: 1000px;
  max-width: 400px;
  margin: 0 auto;
}

.movie-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(30, 30, 30, 0.9);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.movie-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
}

.poster-container {
  position: relative;
  overflow: hidden;
  max-height: 650px;
}

.movie-poster {
  transition: transform 0.5s ease;
}

.movie-card:hover .movie-poster {
  transform: scale(1.05);
}

.movie-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    rgba(0, 0, 0, 0.8) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
}

.movie-card:hover .movie-overlay {
  opacity: 1;
}

.movie-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.movie-brief {
  color: white;
  font-size: 0.85rem;
}

.release-date,
.movie-genres {
  margin: 5px 0;
}

.movie-info {
  flex: 1;
  padding: 15px;
  position: relative;
}

.movie-rating {
  display: flex;
  align-items: center;
  gap: 5px;
  position: absolute;
  top: -18px;
  right: 15px;
  background: rgba(0, 0, 0, 0.8);
  padding: 5px 10px;
  border-radius: 15px;
  color: white;
  font-weight: bold;
  border: 1px solid rgba(255, 193, 7, 0.5);
}

.movie-title {
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
}

.movie-overview {
  font-size: 0.9rem;
  color: #aaaaaa;
  margin-bottom: 0;
}

.card-actions {
  padding: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

/* Utilidades para texto con elipsis */
.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ellipsis-3-lines {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
