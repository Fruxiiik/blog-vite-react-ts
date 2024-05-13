import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { message } from 'antd'

import { AuthTypes, UserData, AuthRequest, RegisterRequest } from '@/assets/types/authTypes'

export const fetchAuth = createAsyncThunk('auth/fetchUserData', async (authData: AuthRequest) => {
  const response = await fetch('https://blog.kata.academy/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user: authData,
    }),
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.errors ? JSON.stringify(data.errors) : 'Не удалось авторизоваться')
  }
  return data
})

export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (registerData: RegisterRequest) => {
  const response = await fetch('https://blog.kata.academy/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user: { ...registerData },
    }),
  })
  const data = await response.json()
  // if (!response.ok) {
  //   throw new Error(data.errors ? JSON.stringify(data.errors) : 'Не удалось зарегистрироваться')
  // }
  return data
})

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async () => {
  const response = await fetch('https://blog.kata.academy/api/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${localStorage.getItem('token')}`,
    },
  })
  const data = await response.json()
  return data
})

export const fetchProfileEdit = createAsyncThunk('auth/fetchProfileEdit', async (editData: UserData) => {
  const response = await fetch('https://blog.kata.academy/api/user', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({
      user: { ...editData },
    }),
  })
  const data = await response.json()
  return data
})

const initialState: AuthTypes = {
  data: null,
  status: 'loading',
  isLoading: false,
  isAuthenticated: false,
  token: '',
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null
      state.isAuthenticated = false
      state.token = ''
      localStorage.removeItem('token')
      window.location.reload()
    },
    setAuth: (state) => {
      state.isAuthenticated = !state.isAuthenticated
    },
    setErrors(state, action: PayloadAction<Record<string, string>>) {
      state.errors = action.payload
      state.status = 'failed'
    },
    clearErrors(state) {
      state.errors = {}
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading'
        state.data = null
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        if (!action?.payload?.user.token) {
          state.isAuthenticated = false
          return
        }
        state.status = 'loaded'
        state.isLoading = false
        state.token = action.payload.token
        state.data = action.payload.user
        state.isAuthenticated = true
        message.open({
          type: 'success',
          content: 'You have successfully logged in!',
          duration: 3,
        })
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.status = 'error'
        state.data = null
      })
      .addCase(fetchAuth.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchAuth.fulfilled, (state, action) => {
        localStorage.removeItem('token')
        if (!action.payload?.user?.token) {
          message.open({
            type: 'error',
            content: 'Failed to authorize user. Please try again.',
            duration: 5,
          })
          state.isLoading = false
          return
        }
        localStorage.setItem('token', action.payload.user.token)
        message.open({
          type: 'success',
          content: 'You are successfully logged in!',
          duration: 3,
        })
        state.isLoading = false
        state.data = action.payload.user
        state.token = action.payload.user.token
        state.isAuthenticated = true
      })
      .addCase(fetchAuth.rejected, (state) => {
        state.isLoading = false
        state.status = 'error'
        state.data = null
        message.open({
          type: 'error',
          content: 'Failed to authorize user. Please check email and password and try again.',
          duration: 5,
        })
      })
      .addCase(fetchRegister.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchRegister.fulfilled, (state, action) => {
        if ('errors' in action.payload) {
          message.open({
            type: 'error',
            content: 'There was an error while register new account. Please check the form and correct errors.',
            duration: 5,
          })
          Object.entries(action.payload.errors).forEach(([key, value]) => {
            if (!state.errors) state.errors = {}
            state.errors[key] = `${key}: ${value}`
          })
          return
        }
        state.isLoading = false
        state.token = action.payload.user.token
        state.data = action.payload.user
        state.isAuthenticated = true
        localStorage.setItem('token', state.token)
        message.open({
          type: 'success',
          content: 'Account created successfully.',
          duration: 3,
        })
      })
      .addCase(fetchProfileEdit.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchProfileEdit.fulfilled, (state, action) => {
        state.isLoading = false
        if ('errors' in action.payload) {
          message.open({
            type: 'error',
            content: 'There was an error while updating profile. Please check the form and correct errors.',
            duration: 5,
          })
          Object.entries(action.payload.errors).forEach(([key, value]) => {
            if (!state.errors) state.errors = {}
            state.errors[key] = `${key}: ${value}`
          })
          return
        }
        state.isLoading = false
        state.data = { ...action.payload.user }
        message.open({
          type: 'success',
          content: 'Account have been successfully updated.',
          duration: 5,
        })
      })
      .addCase(fetchProfileEdit.rejected, (state) => {
        state.isLoading = false
      })
  },
})

export const authReducer = authSlice.reducer

export const { logout, setAuth, clearErrors, setErrors } = authSlice.actions
