import React from 'react'
import { useDispatch } from 'react-redux'
import { SubmitHandler } from 'react-hook-form'
import { Link, Navigate } from 'react-router-dom'

import { FormContainer } from '@/components'
import { RegistrationData, RegistrationFormData } from '@/assets/types/formTypes'
import { validateRegistration } from '@/helperFunctions/validation'
import { AppDispatch, selectIsAuth } from '@/store'
import { useTypedSelector } from '@/hooks/useTypedSelector'
import { clearErrors, fetchRegister } from '@/store/slices/authSlice'

import styles from './Registration.module.scss'

export const Registration: React.FC = () => {
  const defaultRegistrationValues: RegistrationFormData = {
    email: { value: '', type: 'email', placeholder: 'Email address', required: 'Введите email' },
    username: { value: '', type: 'text', placeholder: 'Username', required: 'Введите username' },
    password: { value: '', type: 'password', placeholder: 'Password', minLength: 5, required: 'Введите password' },
    repeatPassword: {
      value: '',
      type: 'password',
      placeholder: 'Repeat Password',
      minLength: 5,
      required: 'Введите password',
    },
    agree: { type: 'checkbox', required: 'Необходимо согласие на обработку персональных данных' },
  }
  const dispatch = useDispatch<AppDispatch>()
  const isAuth = useTypedSelector(selectIsAuth)
  const onSubmit: SubmitHandler<RegistrationData> = (data) => {
    const { repeatPassword, agree, ...registerData } = data
    dispatch(clearErrors())
    dispatch(fetchRegister(registerData))
  }
  if (isAuth) {
    return <Navigate to="/" />
  }
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Sign Up</h3>
      <FormContainer<RegistrationFormData, RegistrationData>
        onSubmit={onSubmit}
        defaultValues={defaultRegistrationValues}
        validate={validateRegistration}
        buttonText="Register"
      />
      <p className={`${styles.link__text} ${styles.link}`}>
        Don’t have an account?
        <Link className={styles.link__signUp} to="/sign-in">
          Sign In
        </Link>
      </p>
    </div>
  )
}
