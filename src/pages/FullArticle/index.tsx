import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { CircularProgress } from '@mui/material'

import { AppDispatch } from '@/store'
import { useTypedSelector } from '@/hooks/useTypedSelector'
import { Article } from '@/components/Article'
import { getArticle } from '@/store/slices/articleSlice'

import styles from './FullArticle.module.scss'

export const FullArticle: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { article, isLoading } = useTypedSelector((state) => state.article)
  const articleData = article?.article // Получаем вложенный объект статьи
  const { slug } = useParams<{ slug: string }>()

  useEffect(() => {
    if (!isLoading && slug) {
      dispatch(getArticle(slug))
    }
  }, [slug, dispatch])
  function renderContent() {
    if (isLoading || !articleData) {
      return <CircularProgress />
    }
    return <Article article={articleData} isFullArticle />
  }

  return <div className={styles.root}>{renderContent()}</div>
}
