import { createRouter, createWebHistory } from 'vue-router'
import HomePage from 'src/views/HomePage.vue'
import MovieDetail from 'src/views/MovieDetail.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/movie/:id', component: MovieDetail },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
