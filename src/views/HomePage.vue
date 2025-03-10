<template>
  <q-page class="cinema-background">
    <!-- Topbar mejorado -->
    <div class="top-bar">
      <div class="logo-container">
        <q-icon name="movie" size="2rem" color="amber-5" />
        <h2 class="text-amber-5 q-ml-md">CineFlix</h2>
      </div>
      <search-bar @search="buscarPeliculas" class="search-component" />
      <div class="user-actions">
        <q-btn flat round icon="bookmark" color="amber-5" class="q-mr-sm">
          <q-tooltip>Mis Favoritos</q-tooltip>
        </q-btn>
        <q-btn flat round icon="notifications" color="amber-5" class="q-mr-sm">
          <q-tooltip>Notificaciones</q-tooltip>
        </q-btn>
        <q-btn flat round icon="person" color="amber-5">
          <q-tooltip>Mi Perfil</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Contenido principal con sidebar -->
    <div class="main-content">
      <!-- Sidebar mejorado -->
      <div class="sidebar">
        <q-list bordered padding class="rounded-borders text-white">
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="home" color="amber-5" />
            </q-item-section>
            <q-item-section>Inicio</q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="trending_up" color="amber-5" />
            </q-item-section>
            <q-item-section>Tendencias</q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="star" color="amber-5" />
            </q-item-section>
            <q-item-section>Mejor Valoradas</q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="new_releases" color="amber-5" />
            </q-item-section>
            <q-item-section>Estrenos</q-item-section>
          </q-item>

          <q-separator dark class="q-my-md" />

          <q-item-label header class="text-amber-5">Géneros</q-item-label>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="videogame_asset" color="amber-5" />
            </q-item-section>
            <q-item-section>Acción</q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="sentiment_satisfied_alt" color="amber-5" />
            </q-item-section>
            <q-item-section>Comedia</q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="mood_bad" color="amber-5" />
            </q-item-section>
            <q-item-section>Drama</q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="whatshot" color="amber-5" />
            </q-item-section>
            <q-item-section>Sci-Fi</q-item-section>
          </q-item>
        </q-list>
      </div>

      <!-- Área principal de películas -->
      <div class="movies-container">
        <loading-spinner v-if="loading" />

        <div v-else>
          <!-- Categoría destacada -->
          <div class="section-heading">
            <h2 class="text-amber-5"><q-icon name="star" class="q-mr-sm" />Películas destacadas</h2>
            <q-btn flat color="amber-5" label="Ver todas" icon-right="arrow_forward" />
          </div>

          <!-- Grid de películas mejorado -->
          <div class="movies-grid">
            <movie-card
              v-for="movie in movies"
              :key="movie.id"
              :movie="movie"
              @viewDetails="verDetalles"
            />
          </div>
        </div>

        <!-- Mensaje de error -->
        <div v-if="error" class="error-message">
          <q-icon name="error" size="2rem" color="negative" />
          <p>{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Popup de detalles mejorado -->
    <q-dialog v-model="showPopup" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card class="movie-detail-popup">
        <q-card-section class="popup-header">
          <div class="popup-title">
            <h2 class="text-h4">{{ selectedMovie.title }}</h2>
            <q-btn flat round icon="close" color="white" v-close-popup />
          </div>
        </q-card-section>

        <q-card-section class="popup-content">
          <div class="popup-poster">
            <img :src="getMoviePosterUrl(selectedMovie)" alt="Movie poster" class="popup-img" />
            <div class="movie-actions">
              <q-btn flat round color="amber-5" icon="bookmark">
                <q-tooltip>Añadir a favoritos</q-tooltip>
              </q-btn>
              <q-btn flat round color="amber-5" icon="share">
                <q-tooltip>Compartir</q-tooltip>
              </q-btn>
              <q-btn flat round color="amber-5" icon="star">
                <q-tooltip>Calificar</q-tooltip>
              </q-btn>
            </div>
          </div>

          <div class="popup-info">
            <div class="movie-meta">
              <span class="rating"
                ><q-icon name="star" color="amber-5" /> {{ selectedMovie.vote_average }}/10</span
              >
              <span class="year"
                ><q-icon name="event" color="amber-5" />
                {{ formatDate(selectedMovie.release_date) }}</span
              >
              <span class="votes"
                ><q-icon name="how_to_vote" color="amber-5" />
                {{ selectedMovie.vote_count }} votos</span
              >
            </div>

            <div class="movie-overview">
              <h3>Sinopsis</h3>
              <p>{{ selectedMovie.overview || 'Sin descripción disponible.' }}</p>
            </div>

            <div class="additional-info">
              <div class="info-column">
                <h3>Detalles</h3>
                <p><strong>Idioma original:</strong> {{ selectedMovie.original_language }}</p>
                <p><strong>Título original:</strong> {{ selectedMovie.original_title }}</p>
                <p><strong>Popularidad:</strong> {{ selectedMovie.popularity }}</p>
              </div>

              <div class="info-column">
                <h3>Recomendados</h3>
                <div class="recommended-list">
                  <p>Las recomendaciones aparecerán aquí</p>
                </div>
              </div>
            </div>

            <div class="trailer-section">
              <h3>Tráiler</h3>
              <div class="trailer-placeholder">
                <q-icon name="movie" size="4rem" color="grey-7" />
                <p>Tráiler no disponible</p>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="popup-actions">
          <q-btn color="amber-5" label="Ver más detalles" icon="launch" />
          <q-btn flat color="white" label="Cerrar" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import api from 'src/services/api'
import MovieCard from 'src/components/MovieCard.vue'
import SearchBar from 'src/components/SearchBar.vue'
import LoadingSpinner from 'src/components/LoadingSpinner.vue'

const movies = ref([])
const loading = ref(false)
const error = ref(null)
const showPopup = ref(false)
const selectedMovie = ref({})

const cargarPeliculas = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await api.getTopRatedMovies()
    movies.value = response.data.results || []
  } catch (err) {
    console.error('Error al obtener películas:', err)
    error.value = 'No se pudieron cargar las películas.'
  } finally {
    loading.value = false
  }
}

const buscarPeliculas = async (query) => {
  if (!query) return cargarPeliculas()
  loading.value = true
  try {
    const response = await api.searchMovies(query)
    movies.value = response.data.results || []
  } catch (err) {
    console.error('Error en la búsqueda:', err)
    error.value = 'No se encontraron resultados.'
  } finally {
    loading.value = false
  }
}

const verDetalles = (movie) => {
  selectedMovie.value = movie
  showPopup.value = true
}

const getMoviePosterUrl = (movie) => {
  return movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image'
}

const formatDate = (dateString) => {
  if (!dateString) return 'Fecha desconocida'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
}

onMounted(cargarPeliculas)
</script>

<style scoped>
/* Estilos generales */
.cinema-background {
  background: linear-gradient(135deg, #111111 0%, #333333 100%);
  min-height: 100vh;
  color: #f5f5f5;
}

/* Topbar */
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 25px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 193, 7, 0.2);
  position: sticky;
  top: 0;
  z-index: 10;
}

.logo-container {
  display: flex;
  align-items: center;
}

.search-component {
  width: 100%;
  max-width: 400px;
}

.user-actions {
  display: flex;
}

/* Contenido principal */
.main-content {
  display: flex;
  gap: 20px;
  padding: 20px;
}

/* Sidebar */
.sidebar {
  width: 250px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  padding: 10px 0;
  border: 1px solid rgba(255, 193, 7, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  height: fit-content;
  position: sticky;
  top: 85px;
}

/* Contenedor de películas */
.movies-container {
  flex: 1;
  min-height: 500px;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* Grid de películas */
.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

@media (min-width: 768px) {
  .movies-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 767px) {
  .main-content {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    position: static;
  }
}

/* Popup de detalles */
.movie-detail-popup {
  background: linear-gradient(to bottom, #1a1a1a, #2c2c2c);
  color: white;
  border-radius: 12px;
  max-width: 1200px;
  margin: 0 auto;
}

.popup-header {
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
}

.popup-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.popup-content {
  display: flex;
  gap: 30px;
  padding: 30px;
}

.popup-poster {
  flex: 0 0 300px;
  display: flex;
  flex-direction: column;
}

.popup-img {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.movie-actions {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}

.popup-info {
  flex: 1;
}

.movie-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}

.rating,
.year,
.votes {
  display: flex;
  align-items: center;
  gap: 5px;
}

.movie-overview {
  margin-bottom: 30px;
}

.additional-info {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.info-column {
  flex: 1;
}

.trailer-section {
  width: 100%;
}

.trailer-placeholder {
  width: 100%;
  height: 200px;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
}

.popup-actions {
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .popup-content {
    flex-direction: column;
  }

  .popup-poster {
    flex: 0 0 auto;
    margin-bottom: 20px;
  }

  .additional-info {
    flex-direction: column;
  }
}

/* Cargador y mensaje de error */
.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  margin-top: 40px;
}
</style>
