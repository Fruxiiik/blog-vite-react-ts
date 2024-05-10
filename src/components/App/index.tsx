import { createRoot } from 'react-dom/client'
import React, { StrictMode } from 'react'
import { Provider, useDispatch } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { Header, ProtectedRoute } from '@/components'
import { Home, FullArticle, Login, Registration, Profile, CreateArticle } from '@/pages'
import store, { AppDispatch } from '@/store'
import { autoSetArticleIndex } from '@/store/slices/articlesSlice'
import { setAuth } from '@/store/slices/authSlice'

import classes from './App.module.scss'

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  if (localStorage.getItem('token')) {
    dispatch(setAuth())
  }
  dispatch(autoSetArticleIndex())
  return (
    <div className={classes.App}>
      <div className={classes.app_wrapper}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/articles/:slug"
            element={
              <ProtectedRoute>
                <FullArticle />
              </ProtectedRoute>
            }
          />
          <Route path="/sign-in" element={<Login />} />
          <Route path="/sign-up" element={<Registration />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/new-article"
            element={
              <ProtectedRoute>
                <CreateArticle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/articles/:slug/edit"
            element={
              <ProtectedRoute>
                <CreateArticle />
              </ProtectedRoute>
            }
          />
        </Routes>
        {/* <main className={classes.main} /> */}
      </div>
    </div>
  )
}

const container = document.getElementById('root')
const root = createRoot(container!) // используем Non-null assertion operator (!) для указания, что элемент существует
root.render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>
)
