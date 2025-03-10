import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3', // No usar "/api"
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
    language: 'es-ES',
  },
})

export default {
  getTopRatedMovies() {
    return api.get('/movie/top_rated')
  },
  searchMovies(query) {
    return api.get('/search/movie', { params: { query } })
  },
  getMovieDetails(id) {
    return api.get(`/movie/${id}`)
  },
}
