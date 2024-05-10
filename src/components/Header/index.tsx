import React, { useEffect } from 'react'
import Container from '@mui/material/Container'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'

import { useTypedSelector } from '@/hooks/useTypedSelector'
import { fetchCurrentUser, logout } from '@/store/slices/authSlice'
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

  const headerButtons = isAuth ? (
    <>
      <Link className={styles.link} to="/new-article">
        <Button className={styles.create} variant="outlined" onClick={onClickCreate}>
          Create article
        </Button>
      </Link>
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
      <Link to="/sign-in">
        <Button className={styles.signIn} variant="text" color="info">
          Sign In
        </Button>
      </Link>
      <Link to="/sign-up">
        <Button className={styles.signUp} variant="outlined" color="success">
          Sign Up
        </Button>
      </Link>
    </>
  )
  return (
    <div className={styles.root}>
      <Container component="nav">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <div>Realworld Blog</div>
          </Link>
          <div className={styles.buttons}>{headerButtons}</div>
        </div>
      </Container>
    </div>
  )
}
