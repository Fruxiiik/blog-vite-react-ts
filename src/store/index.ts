import { configureStore } from '@reduxjs/toolkit'

import { authReducer } from './slices/authSlice'
import { articlesReducer } from './slices/articlesSlice'
import { articleReducer } from './slices/articleSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    articles: articlesReducer,
    article: articleReducer,
  },
})

// Определение типа RootState из состояния reducer'ов
export type RootState = ReturnType<typeof store.getState>
export const selectIsAuth = (state: RootState) => Boolean(state.auth.isAuthenticated)

export default store
export type AppDispatch = typeof store.dispatch
