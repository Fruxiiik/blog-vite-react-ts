import React from 'react'
import { useDispatch } from 'react-redux'
import { SubmitHandler } from 'react-hook-form'
import { Link, Navigate } from 'react-router-dom'

import { FormContainer } from '@/components'
import { LoginData, LoginFormData } from '@/assets/types/formTypes'
import { validateLogin } from '@/helperFunctions/validation'
import { AppDispatch } from '@/store'
import { selectIsAuth } from '@/assets/types/storeTypes'
import { useTypedSelector } from '@/hooks/useTypedSelector'
import { fetchAuth } from '@/store/slices/authSlice'

import styles from './Login.module.scss'

export const Login: React.FC = () => {
  const defaultLoginValues: LoginFormData = {
    email: { value: '', type: 'email', placeholder: 'Email address', required: 'Введите email' },
    password: { value: '', type: 'password', placeholder: 'Password', minLength: 5, required: 'Введите password' },
  }
  const dispatch = useDispatch<AppDispatch>()
  const isAuth = useTypedSelector(selectIsAuth)
  const onSubmit: SubmitHandler<LoginData> = (data) => {
    const loginData = { ...data }
    dispatch(fetchAuth(loginData))
  }
  if (isAuth) {
    return <Navigate to="/" />
  }
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Sign In</h3>
      <FormContainer<LoginFormData, LoginData>
        onSubmit={onSubmit}
        defaultValues={defaultLoginValues}
        validate={validateLogin}
        buttonText="Log In"
      />
      <p className={`${styles.link__text} ${styles.link}`}>
        Don’t have an account?
        <Link className={styles.link__signUp} to="/sign-up">
          Sign Up
        </Link>
      </p>
    </div>
  )
}
