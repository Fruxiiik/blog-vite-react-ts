import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: {},
})

// Определение типа RootState из состояния reducer'ов
export type RootState = ReturnType<typeof store.getState>

export default store
export type AppDispatch = typeof store.dispatch
