import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { message } from 'antd'

import type { RootState } from '@/assets/types/storeTypes'
import { ArticleState, ArticleData } from '@/assets/types/articleTypes'

const initialState: ArticleState = {
  article: null,
  currentArticle: null,
  isLoading: false,
  isEditing: false,
  isFollowProcess: false,
}

export const getArticle = createAsyncThunk('articles/fetchArticle', async (slug: string) => {
  try {
    const response = await fetch(`https://blog.kata.academy/api/articles/${slug}`, {
      method: 'GET',
      headers: {
        Authorization:
          'Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MjE3ODJhOGM4MjhkMWIwMDM5NjU5OCIsInVzZXJuYW1lIjoidGVzdDEiLCJleHAiOjE3MTk0OTMwODgsImlhdCI6MTcxNDMwOTA4OH0.ucMuQAgoNrSwDtdKwrLBBHRAbcfF2W-ug3o7DBR5UXQ',
      },
    })
    const data = await response.json()
    return data.article
  } catch (e) {
    console.log(e)
  }
})

export const createArticle = createAsyncThunk('articles/createArticle', async (article: ArticleData) => {
  const response = await fetch('https://blog.kata.academy/api/articles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ article: { ...article } }),
  })
  const data = await response.json()
  message.open({
    type: 'success',
    content: 'Your post has been successfully created!',
    duration: 5,
  })
  return data
})

export const updateArticle = createAsyncThunk('articles/updateArticle', async (article1: ArticleData, { getState }) => {
  const { article } = getState() as RootState
  const response = await fetch(`https://blog.kata.academy/api/articles/${article.currentArticle}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ article: { ...article1 } }),
  })
  const data = await response.json()
  return data
})

export const deleteArticle = createAsyncThunk('articles/deleteArticle', async (_, { getState }) => {
  const { article } = getState() as RootState
  const response = await fetch(`https://blog.kata.academy/api/articles/${article.currentArticle}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`,
    },
  })
  const data = await response.json()
  return data
})

export const followArticle = createAsyncThunk('articles/followArticle', async (_, { getState }) => {
  const { article } = getState() as RootState
  const response = await fetch(`https://blog.kata.academy/api/articles/${article.currentArticle}/favorite`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`,
    },
  })
  const data = await response.json()
  return data.article
})

export const unFollowArticle = createAsyncThunk('articles/unFollowArticle', async (_, { getState }) => {
  const { article } = getState() as RootState
  const response = await fetch(`https://blog.kata.academy/api/articles/${article.currentArticle}/favorite`, {
    method: 'DELETE',
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`,
    },
  })
  const data = await response.json()
  return data.article
})

const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    clearCurrentArticle: (state) => {
      state.article = null
      state.isEditing = false
    },
    setIsEditing: (state) => {
      state.isEditing = true
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getArticle.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getArticle.fulfilled, (state, action) => {
        state.article = action.payload
        state.isLoading = false
        state.currentArticle = action.payload.slug
      })
      .addCase(createArticle.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.article = action.payload
        state.isLoading = false
      })
      .addCase(updateArticle.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateArticle.fulfilled, (state) => {
        state.isLoading = false
        state.isEditing = false
        message.open({
          type: 'success',
          content: 'Post updated successfully!',
          duration: 3,
        })
      })
      .addCase(followArticle.pending, (state) => {
        state.isFollowProcess = true
      })
      .addCase(followArticle.fulfilled, (state, action) => {
        state.article = action.payload
        state.isFollowProcess = false
      })
      .addCase(unFollowArticle.pending, (state) => {
        state.isFollowProcess = true
      })
      .addCase(unFollowArticle.fulfilled, (state, action) => {
        state.article = action.payload
        state.isFollowProcess = false
      })
  },
})

// export const { setArticleIndex } = articleSlice.actions
export const { clearCurrentArticle, setIsEditing } = articleSlice.actions

export const articleReducer = articleSlice.reducer
