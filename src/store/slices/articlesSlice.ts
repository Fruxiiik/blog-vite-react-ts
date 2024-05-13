import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'

import { ArticlesState } from '@/assets/types/articlesTypes'

const initialState: ArticlesState = {
  articles: [],
  paginationCount: 0,
  isLoading: false,
  articleIndex: 0,
}

export const getArticles = createAsyncThunk('articles/fetchArticles', async (articleIndex: number) => {
  try {
    const headers = new Headers()
    const token = localStorage.getItem('token')
    // Если токен существует, добавляем его в заголовки
    if (token) {
      headers.append('Authorization', `Token ${token}`)
    }
    const response = await fetch(
      `https://blog.kata.academy/api/articles?&limit=5&offset=${articleIndex ? articleIndex * 5 : 0}`,
      {
        method: 'GET',
        headers,
      }
    )
    const data = await response.json()
    return data
  } catch (e) {
    console.log(e)
  }
})

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    updateArticleInList: (state, action) => {
      const updatedArticle = action.payload
      const index = state.articles.findIndex((article) => article.slug === updatedArticle.slug)
      if (index !== -1) {
        state.articles[index] = { ...state.articles[index], ...updatedArticle }
      }
    },
    setArticleIndex(state, action: PayloadAction<number>) {
      state.articleIndex = action.payload - 1
      localStorage.setItem('articlesIndex', state.articleIndex.toString())
    },
    autoSetArticleIndex(state) {
      if (!localStorage.getItem('articlesIndex')) {
        localStorage.setItem('articlesIndex', '0')
      }
      state.articleIndex = Number(localStorage.getItem('articlesIndex'))
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getArticles.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getArticles.fulfilled, (state, action) => {
        state.paginationCount = Math.ceil(action.payload.articlesCount / 5)
        state.isLoading = false
        state.articles = action.payload.articles
      })
  },
})

export const { setArticleIndex, autoSetArticleIndex, updateArticleInList } = articlesSlice.actions

export const articlesReducer = articlesSlice.reducer
