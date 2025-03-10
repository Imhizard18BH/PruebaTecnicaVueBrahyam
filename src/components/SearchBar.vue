<template>
  <div class="search-container">
    <q-input
      v-model="query"
      debounce="300"
      outlined
      dense
      placeholder="Buscar películas, actores, géneros..."
      clearable
      color="amber-5"
      bg-color="rgba(0, 0, 0, 0.5)"
      class="search-input"
      @update:model-value="emitSearch"
      @focus="focusSearch"
      @blur="blurSearch"
    >
      <template v-slot:prepend>
        <q-icon name="search" color="amber-5" />
      </template>

      <template v-slot:append>
        <q-btn v-if="query" round flat icon="clear" color="grey-5" @click="clearSearch" size="sm" />
        <q-btn round flat icon="tune" color="amber-5" size="sm">
          <q-tooltip>Filtros avanzados</q-tooltip>
        </q-btn>
      </template>

      <template v-slot:after>
        <q-btn
          color="amber-5"
          text-color="black"
          label="Buscar"
          @click="emitSearch"
          :disable="!query"
          size="sm"
        />
      </template>
    </q-input>

    <!-- Sugerencias de búsqueda -->
    <q-slide-transition>
      <div v-if="isFocused && suggestions.length > 0" class="search-suggestions">
        <q-list separator>
          <q-item
            v-for="(suggestion, index) in suggestions"
            :key="index"
            clickable
            v-ripple
            @click="selectSuggestion(suggestion)"
          >
            <q-item-section avatar>
              <q-icon :name="getSuggestionIcon(suggestion.type)" color="amber-5" />
            </q-item-section>
            <q-item-section>{{ suggestion.text }}</q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-slide-transition>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  initialValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['search'])

const query = ref(props.initialValue)
const isFocused = ref(false)
const suggestions = ref([])

// Sugerencias de ejemplo (en una aplicación real, vendrían de la API)
const mockSuggestions = [
  { text: 'Películas de acción', type: 'genre' },
  { text: 'Clásicos del cine', type: 'category' },
  { text: 'Películas de 2023', type: 'year' },
  { text: 'Director Christopher Nolan', type: 'person' },
  { text: 'Películas premiadas', type: 'category' },
]

const focusSearch = () => {
  isFocused.value = true
  updateSuggestions()
}

const blurSearch = () => {
  // Retrasamos para permitir clics en sugerencias
  setTimeout(() => {
    isFocused.value = false
  }, 200)
}

const clearSearch = () => {
  query.value = ''
  suggestions.value = []
  emit('search', '')
}

const emitSearch = () => {
  emit('search', query.value)
  isFocused.value = false
}

const selectSuggestion = (suggestion) => {
  query.value = suggestion.text
  emit('search', suggestion.text)
  isFocused.value = false
}

const updateSuggestions = () => {
  if (!query.value) {
    suggestions.value = mockSuggestions.slice(0, 4)
    return
  }

  // Filtrar sugerencias basadas en la consulta
  suggestions.value = mockSuggestions
    .filter((s) => s.text.toLowerCase().includes(query.value.toLowerCase()))
    .slice(0, 5)
}

const getSuggestionIcon = (type) => {
  switch (type) {
    case 'genre':
      return 'local_movies'
    case 'person':
      return 'person'
    case 'year':
      return 'event'
    case 'category':
      return 'category'
    default:
      return 'search'
  }
}

// Actualizar sugerencias cuando cambia la consulta
watch(query, updateSuggestions)
</script>

<style scoped>
.search-container {
  position: relative;
  width: 100%;
}

.search-input {
  border-radius: 8px;
}

.search-input :deep(.q-field__control) {
  border-radius: 8px;
  height: 40px;
}

.search-input :deep(.q-field__marginal) {
  height: 40px;
}

/* Mejorar visibilidad del texto */
.search-input :deep(.q-field__native),
.search-input :deep(.q-field__input) {
  color: white !important;
}

.search-input :deep(.q-field__label) {
  color: rgba(255, 255, 255, 0.7) !important;
}

.search-input :deep(.q-field__control-container) {
  padding-left: 8px;
}

.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  background: #222;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 193, 7, 0.2);
  border-top: none;
  max-height: 300px;
  overflow-y: auto;
}

.search-suggestions :deep(.q-item) {
  color: white;
}

.search-suggestions :deep(.q-item:hover) {
  background: rgba(255, 193, 7, 0.1);
}
</style>
