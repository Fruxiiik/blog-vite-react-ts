import React from 'react'
import { useDispatch } from 'react-redux'
import { SubmitHandler } from 'react-hook-form'
import { Navigate } from 'react-router-dom'

import { FormContainer } from '@/components'
import { ProfileData, ProfileFormData } from '@/assets/types/formTypes'
import { validateProfileEdit } from '@/helperFunctions/validation'
import { AppDispatch } from '@/store'
import { selectIsAuth } from '@/assets/types/storeTypes'
import { useTypedSelector } from '@/hooks/useTypedSelector'
import { fetchProfileEdit, clearErrors } from '@/store/slices/authSlice'

import styles from './Profile.module.scss'

export const Profile: React.FC = () => {
  const defaultProfileValues: ProfileFormData = {
    username: { value: '', type: 'text', placeholder: 'Username' },
    email: { value: '', type: 'email', placeholder: 'Email address' },
    password: {
      value: '',
      type: 'password',
      placeholder: 'New Password',
    },
    image: { value: '', type: 'text', placeholder: 'Avatar image (url)' },
  }
  const dispatch = useDispatch<AppDispatch>()
  const isAuth = useTypedSelector(selectIsAuth)
  const onSubmit: SubmitHandler<ProfileData> = (data) => {
    const { ...loginData } = data
    dispatch(clearErrors())
    dispatch(fetchProfileEdit(loginData))
  }
  if (!isAuth) {
    return <Navigate to="/" />
  }
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Edit Profile</h3>
      <FormContainer<ProfileFormData, ProfileData>
        onSubmit={onSubmit}
        defaultValues={defaultProfileValues}
        validate={validateProfileEdit}
        buttonText="Save"
      />
    </div>
  )
}
