import React, { useEffect } from 'react'
import Container from '@mui/material/Container'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'

import { useTypedSelector } from '@/hooks/useTypedSelector'
import { fetchCurrentUser, logout, clearErrors } from '@/store/slices/authSlice'
import { clearCurrentArticle } from '@/store/slices/articleSlice'
import { AppDispatch } from '@/store'
import { selectIsAuth } from '@/assets/types/storeTypes'

import styles from './Header.module.scss'

const Img = styled('img')({
  display: 'block',
  width: '46px',
  height: '46px',
  objectFit: 'cover',
})

export const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const isAuth = useTypedSelector(selectIsAuth)
  const userData = useTypedSelector((state) => state.auth.data)
  const username = userData?.username ?? 'Default Username'
  const image = userData?.image ?? 'src/assets/images/profile-logo.svg'
  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(fetchCurrentUser())
    }
  }, [])
  const onClickLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      dispatch(logout())
      window.localStorage.removeItem('token')
    }
  }
  const onClickCreate = () => {
    dispatch(clearCurrentArticle())
  }
  const onClickButton = () => {
    dispatch(clearErrors())
  }

  const headerButtons = isAuth ? (
    <>
      <Button
        component={Link}
        to="/new-article"
        role="button"
        onClick={onClickCreate}
        aria-label="Create an article"
        className={styles.create}
        variant="outlined"
      >
        Create article
      </Button>
      <Link className={styles.link} to="/profile">
        <div className={styles.profile}>
          <p className={styles.profile__username}>{username}</p>
          <Img className={styles.profile__img} src={image} alt="logo" />
        </div>
      </Link>
      <Button className={styles.logOut} variant="outlined" onClick={onClickLogout}>
        Log Out
      </Button>
    </>
  ) : (
    <>
      <Button
        component={Link}
        to="/sign-in"
        role="button"
        aria-label="Sign in for an account"
        onClick={onClickButton}
        className={styles.signIn}
        variant="text"
        color="info"
      >
        Sign In
      </Button>
      <Button
        component={Link}
        to="/sign-up"
        role="button"
        aria-label="Sign up for an account"
        onClick={onClickButton}
        className={styles.signUp}
        variant="outlined"
        color="success"
      >
        Sign Up
      </Button>
    </>
  )
  return (
    <header className={styles.root}>
      <Container component="nav">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <h1 className={styles.logo__title}>Realworld Blog</h1>
          </Link>
          <div className={styles.buttons}>{headerButtons}</div>
        </div>
      </Container>
    </header>
  )
}
