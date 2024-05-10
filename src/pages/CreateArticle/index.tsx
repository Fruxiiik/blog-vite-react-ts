import React from 'react'
import { useDispatch } from 'react-redux'
import { SubmitHandler } from 'react-hook-form'
import { useNavigate, Navigate } from 'react-router-dom'

import { FormArticleContainer } from '@/components'
import { CreateArticleData, CreateArticleFormData } from '@/assets/types/formTypes'
import { validateCreateArticle } from '@/helperFunctions/validation'
import { AppDispatch } from '@/store'
import { useTypedSelector } from '@/hooks/useTypedSelector'
import { clearErrors } from '@/store/slices/authSlice'
import { selectIsAuth } from '@/assets/types/storeTypes'
import { createArticle, updateArticle } from '@/store/slices/articleSlice'
import { ArticleData } from '@/assets/types/articleTypes'

import styles from './CreateArticle.module.scss'

export const CreateArticle: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const isAuth = useTypedSelector(selectIsAuth)
  const navigate = useNavigate()
  const { isEditing, currentArticle, article } = useTypedSelector((state) => state.article)
  const title = article?.title || ''
  const description = article?.description || ''
  const body = article?.body || ''
  const tagList = article?.tagList || ['']
  const defaultCreateArticleValues: CreateArticleFormData = {
    title: { value: title, type: 'text', placeholder: 'Title' },
    description: { value: description, type: 'text', placeholder: 'Short description' },
    body: { value: body, type: 'text', placeholder: 'Text' },
    tagList,
  }

  const defaultValues = {
    title: defaultCreateArticleValues.title.value,
    description: defaultCreateArticleValues.description.value,
    body: defaultCreateArticleValues.body.value,
    tagList: defaultCreateArticleValues.tagList.map((value) => value),
  }
  const onSubmit: SubmitHandler<CreateArticleData> = async (data) => {
    const { ...registerData } = data
    dispatch(clearErrors())
    if (isEditing) {
      await dispatch(updateArticle(registerData as ArticleData))
      navigate(`/articles/${currentArticle}`)
    } else {
      await dispatch(createArticle(registerData as ArticleData))
      navigate('/')
    }
  }
  if (!isAuth) {
    return <Navigate to="/" />
  }
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{isEditing ? 'Edit article' : 'Create new article'}</h3>
      <FormArticleContainer<CreateArticleFormData, CreateArticleData>
        onSubmit={onSubmit}
        formData={defaultCreateArticleValues}
        defaultValues={defaultValues}
        validate={validateCreateArticle}
        buttonText="Send"
      />
    </div>
  )
}
