import { configureStore } from '@reduxjs/toolkit'

import { authReducer } from './slices/authSlice'
import { articlesReducer } from './slices/articlesSlice'
import { articleReducer } from './slices/articleSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    articles: articlesReducer,
    article: articleReducer,
  },
})

export default store
export type AppDispatch = typeof store.dispatch
